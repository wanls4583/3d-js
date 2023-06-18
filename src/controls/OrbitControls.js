import { clamp } from '../math/MathUtils.js'
import Matrix4 from '../math/Matrix4.js'
import Vector3 from '../math/Vector3.js'
import Vector2 from '../math/Vector2.js'
import Spherical from '../math/Spherical.js'
import Quaternion from '../math/Quaternion.js'

export default class {
    constructor(camera, domElement, useTrackBall = false) {
        this.camera = camera
        this.domElement = domElement
        this.target = new Vector3()

        this.minDistance = 0
        this.maxDistance = Infinity

        this.minZoom = 0
        this.maxZoom = Infinity

        this.minPolarAngle = 0
        this.maxPolarAngle = Math.PI

        this.minAzimuthAngle = -Infinity
        this.maxAzimuthANgle = Infinity

        this.enableZoome = true
        this.zoomSpeed = 1.0

        this.enableRotate = true
        this.rotateSpeed = 1.0
        this.rotateDir = 'xy'

        this.enablePan = true
        this.panSpeed = 1.0
        this.screenSpacePanning = true

        this.target0 = this.target.clone()
        this.position0 = this.camera.position.clone()
        this.zoom0 = this.camera.zoom

        const scope = this
        const evnetMap = new Map([
            [0, 'rotate'],
            [2, 'pan']
        ])
        const PI2 = Math.PI * 2

        let state = -1
        let dragStart = new Vector2()
        let dragEnd = new Vector2()
        let panOffset = new Vector3()
        let spherical = new Spherical().setFromVector3(this.camera.position.clone().sub(this.target))
        let quaternion = new Quaternion().setFromRotationMatrix(new Matrix4())

        _initMouseEvent()

        function _initMouseEvent() {
            const domElement = scope.domElement

            domElement.addEventListener('contextmenu', e => {
                e.preventDefault()
            })

            domElement.addEventListener('pointerdown', e => {
                state = evnetMap.get(e.button)
                dragStart.set(e.clientX, e.clientY)
            })

            domElement.addEventListener('pointermove', e => {
                dragEnd.set(e.clientX, e.clientY)
                switch (state) {
                    case 'pan':
                        if (scope.enablePan) {
                            _pan(dragEnd.clone().sub(dragStart).multiplyScalar(scope.panSpeed))
                        }
                        break
                    case 'rotate':
                        if (scope.enableRotate) {
                            if (useTrackBall) {
                                _rotate2(dragEnd.clone().sub(dragStart).multiplyScalar(scope.rotateSpeed))
                            } else {
                                _rotate(dragEnd.clone().sub(dragStart).multiplyScalar(scope.rotateSpeed))
                            }
                        }
                }
                dragStart.copy(dragEnd)
            })

            domElement.addEventListener('pointerup', e => {
                state = -1
            })

            domElement.addEventListener('wheel', ({ deltaY }) => {
                if (scope.enableZoome) {
                    if (deltaY < 0) {
                        _scale(scope.zoomSpeed / 0.95)
                    } else {
                        _scale(0.95 / scope.zoomSpeed)
                    }
                }
            })
        }

        function _pan({ x, y }) {
            let cameraW = scope.camera.right - scope.camera.left
            let cameraH = scope.camera.top - scope.camera.bottom
            let deltaX = (-cameraW / scope.domElement.clientWidth) * x
            let deltaY = (cameraH / scope.domElement.clientHeight) * y
            let vx = new Vector3().setFromMatrixColumn(scope.camera.matrix, 0).multiplyScalar(deltaX)
            let vy = new Vector3()
            if (scope.screenSpacePanning) {
                vy.setFromMatrixColumn(scope.camera.matrix, 1)
            } else {
                vy.setFromMatrixColumn(scope.camera.matrix, 2)
            }
            vy.multiplyScalar(deltaY)
            panOffset.copy(vx.add(vy))
            scope.update()
        }

        function _scale(zoomScale) {
            if (scope.camera.isOrthographicCamera) {
                scope.camera.zoom *= zoomScale
                scope.camera.zoom = clamp(scope.camera.zoom, scope.minZoom, scope.maxZoom)
            } else {
                scope.camera.position.lerp(scope.target, zoomScale - 1)
            }
            scope.camera.updateProjectionMatrix()
            scope.update()
        }

        // 球坐标旋转
        function _rotate({ x, y }) {
            spherical.setFromVector3(scope.camera.position.clone().sub(scope.target))
            if (scope.rotateDir.indexOf('x') > -1) {
                spherical.theta -= (x / scope.domElement.clientHeight) * Math.PI * 2
                spherical.theta = clamp(spherical.theta, scope.minAzimuthAngle, scope.maxAzimuthANgle)
            }
            if (scope.rotateDir.indexOf('y') > -1) {
                spherical.phi -= (y / scope.domElement.clientHeight) * Math.PI * 2
                spherical.phi = clamp(spherical.phi, scope.minPolarAngle, scope.maxPolarAngle)
            }
            scope.update()
        }

        // 轨迹球旋转
        function _rotate2({ x, y }) {
            let angle = new Vector2(x / scope.domElement.clientHeight, -y / scope.domElement.clientHeight).length() * PI2
            let cameraW = scope.camera.right - scope.camera.left
            let cameraH = scope.camera.top - scope.camera.bottom
            let deltaX = (cameraW / scope.domElement.clientWidth) * x
            let deltaY = (cameraH / scope.domElement.clientHeight) * -y
            let vx = new Vector3().setFromMatrixColumn(scope.camera.matrix, 0).multiplyScalar(deltaX)
            let vy = new Vector3().setFromMatrixColumn(scope.camera.matrix, 1).multiplyScalar(deltaY)
            let dir = scope.camera.position.clone().sub(scope.target).normalize()
            let axis = vx.add(vy).normalize().cross(dir)
            quaternion.setFromAxisAngle(axis, angle)
            scope.update()
        }

        this.update = function () {
            //平移
            this.target.add(panOffset)
            this.camera.position.add(panOffset)

            if (useTrackBall) {
                //轨迹球旋转
                let rotateOffset = this.camera.position.clone().sub(this.target).applyQuaternion(quaternion)
                this.camera.up.applyQuaternion(quaternion)
                this.camera.position.copy(this.target.clone().add(rotateOffset))
            } else {
                //球坐标旋转
                let rotateOffset = new Vector3().setFromSpherical(spherical)
                if (this.camera.isPerspectiveCamera) {
                    spherical.radius = clamp(spherical.radius, this.minDistance, this.maxDistance)
                }
                this.camera.position.copy(this.target.clone().add(rotateOffset))
            }

            panOffset.set(0, 0, 0)
            spherical.setFromVector3(this.camera.position.clone().sub(this.target))
            quaternion.setFromRotationMatrix(new Matrix4())
        }

        this.saveState = function () {
            scope.target0.copy(scope.target);
            scope.position0.copy(scope.camera.position);
            scope.zoom0 = scope.camera.zoom;
        }

        this.reset = function () {
            camera.target = this.target0
            camera.position = this.position0
            camera.zoom = this.zoom0
        }
    }
}