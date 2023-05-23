import Matrix4 from '../math/Matrix4.js'
import Vector3 from '../math/Vector3.js'
import Quaternion from '../math/Quaternion.js'
import { generateUUID } from '../math/MathUtils.js'

let _object3DId = 0

const _xAxis = new Vector3(1, 0, 0)
const _yAxis = new Vector3(0, 1, 0)
const _zAxis = new Vector3(0, 0, 1)

const _target = new Vector3()
const _position = new Vector3();
const _scale = new Vector3();
const _quaternion = new Quaternion();

const _v1 = new Vector3()
const _m1 = new Matrix4()
const _q1 = new Quaternion()

class Object3D {
    constructor() {
        this.children = []
        this.isObject3D = true
        this.id = _object3DId++
        this.name = ''
        this.matrix = new Matrix4()
        this.matrixWorld = new Matrix4()
        this.matrixAutoUpdate = Object3D.DEFAULT_MATRIX_AUTO_UPDATE
        this.matrixWorldAutoUpdate = Object3D.DEFAULT_MATRIX_WORLD_AUTO_UPDATE
        this.parent = null
        this.position = new Vector3()
        this.quaternion = new Quaternion()
        this.scale = new Vector3(1, 1, 1)
        this.type = 'Object3D'
        this.up = Object3D.DEFAULT_UP.clone()
        this.uuid = generateUUID()
    }
    applyMatrix4(m) {
        if (this.matrixAutoUpdate) {
            this.updateMatrix()
        }

        this.matrix.premultiply(m)
        this.matrix.decompose(this.position, this.quaternion, this.scale)

        return this
    }
    applyQuaternion(q) {
        this.quaternion.premultiply(q)

        return this
    }
    setRotationFromAxisAngle(axis, angle) {
        this.quaternion.setFromAxisAngle(axis, angle)

        return this
    }
    setRotationFromMatrix(m) {
        this.quaternion.setFromRotationMatrix(m)

        return this
    }
    setRotationFromQuaternion(q) {
        this.quaternion.copy(q)

        return this
    }
    // 在本地坐标系绕axis旋转angle
    rotateOnAxis(axis, angle) {
        _q1.setFromAxisAngle(axis, angle)
        this.quaternion.multiply(_q1)

        return this
    }
    // 在世界坐标系中绕axis旋转angle
    rotateOnWorldAxis(axis, angle) {
        _q1.setFromAxisAngle(axis, angle)
        this.quaternion.preMultiply(_q1)

        return this
    }
    rotateX(angle) {
        return this.rotateOnAxis(_xAxis, angle)
    }
    rotateY(angle) {
        return this.rotateOnAxis(_yAxis, angle)
    }
    rotateZ(angle) {
        return this.rotateOnAxis(_zAxis, angle)
    }
    translateOnAxis(axis, distance) {
        _v1.copy(axis).applyQuaternion(this.quaternion)
        this.position.add(_v1.multiplyScalar(distance))

        return this
    }
    translateX(distance) {
        return this.translateOnAxis(_xAxis, distance)
    }
    translateY(distance) {
        return this.translateOnAxis(_yAxis, distance)
    }
    translateZ(distance) {
        return this.translateOnAxis(_zAxis, distance)
    }
    localToWorld(vector) {
        this.updateWorldMatrix(true, false)

        return vector.applyMatrix4(this.matrixWorld)
    }
    worldToLocal(vector) {
        this.updateWorldMatrix(true, false)

        return vector.applyMatrix4(_m1.copy(this.matrixWorld).invert())
    }
    lookAt(x, y, z) {
        if (x.isVector3) {
            _target.copy(x)
        } else {
            _target.set(x, y, z)
        }

        this.updateWorldMatrix(true, false)
        _position.setFromMatrixPosition(this.matrixWorld)

        if (this.isCamera || this.isLight) {
            _m1.lookAt(_position, _target, this.up)
        } else {
            _m1.lookAt(_target, _position, this.up)
        }

        this.quaternion.setFromRotationMatrix(_m1)

        if (this.parent) { //转换成相对于父坐标系的四元数
            _m1.extractRotation(this.parent.matrixWorld)
            _q1.setFromRotationMatrix(_m1)
            this.quaternion.preMultiply(_q1.invert())
        }

        return this
    }
    add(object) {
        if (arguments.length > 1) {
            for (let i = 0; i < arguments.length; i++) {
                this.add(arguments[i])
            }
            return this
        }
        if (object === this) {
            console.error('Object3D.add: object can\'t be added as a child of itself.', object)
            return this
        }
        if (object && object.isObject3D) {
            if (object.parent !== null) {
                object.parent.remove(object)
            }
            object.parent = this
            this.children.push(object)
        } else {
            console.error('Object3D.add: object not an instance of Object3D.', object)
        }

        return this
    }
    remove(object) {
        if (arguments.length > 1) {
            for (let i = 0; i < arguments.length; i++) {
                this.remove(arguments[i])
            }
            return this
        }
        const index = this.children.indexOf(object)
        if (index > -1) {
            object.parent = null
            this.children.splice(index, 1)
        }

        return this
    }
    removeFromParent() {
        const parent = this.parent

        if (parent !== null) {
            parent.remove(this)
        }

        return this
    }
    clone() {
        return new this.constructor().copy(this)
    }
    copy(source, recursive = true) {
        this.name = source.name
        this.matrix.copy(source.matrix)
        this.matrixWorld.copy(source.matrixWorld)
        this.matrixAutoUpdate = source.matrixAutoUpdate
        this.matrixWorldAutoUpdate = source.matrixWorldAutoUpdate
        this.position.copy(source.position)
        this.quaternion.copy(source.quaternion)
        this.scale.copy(source.scale)
        this.up.copy(source.up)

        if (recursive) {
            source.children.forEach(child => {
                this.add(child.clone())
            })
        }

        return this
    }
    clear() {
        this.children.forEach(obj => {
            obj.parent = null
        })
        this.children.length = 0

        return this
    }
    getObjectById(id) {
        return this.getObjectByProperty('id', id)
    }
    getObjectByName(name) {
        return this.getObjectByProperty('name', name)
    }
    getObjectByProperty(name, value) {
        if (this[name] === value) {
            return this
        }
        for (let i = 0, l = this.children.length; i < l; i++) {
            let child = this.children[i]
            let obj = child.getObjectByProperty(name, value)
            if (obj !== undefined) {
                return obj
            }
        }

        return undefined
    }
    getObjectsByProperty(name, value) {
        let result = []

        if (this[name] === value) {
            result.push(this)
        }
        for (let i = 0, l = this.children.length; i < l; i++) {
            let child = this.children[i]
            let objs = child.getObjectsByProperty(name, value)
            if (objs.length) {
                result = result.concat(objs)
            }
        }

        return result
    }
    getWorldPosition(target) {
        this.updateWorldMatrix(true, false)

        return target.setFromMatrixPosition(this.matrixWorld)
    }
    getWorldQuaternion(target) {
        this.updateWorldMatrix(true, false)
        this.matrixWorld.decompose(_position, target, _scale)

        return target
    }
    getWorldScale(target) {
        this.updateWorldMatrix(true, false)
        this.matrixWorld.decompose(_position, _quaternion, target)

        return target
    }
    // 获取Z轴方向
    getWorldDirection(target) {
        this.updateWorldMatrix(true, false)

        const te = this.matrixWorld.elements

        return target.set(te[8], te[9], te[10]).normalize()
    }
    updateMatrix() {
        this.matrix.compose(this.position, this.quaternion, this.scale)
        this.matrixWorldNeedsUpdate = true

        return this
    }
    updateMatrixWorld(force) {
        if (this.matrixAutoUpdate) {
            this.updateMatrix()
        }

        if (this.matrixWorldNeedsUpdate || force) {
            if (this.parent === null) {
                this.matrixWorld.copy(this.matrix)
            } else {
                this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix)
            }
            this.matrixWorldNeedsUpdate = false
            force = true
        }

        const children = this.children;

        for (let i = 0, l = children.length; i < l; i++) {
            const child = children[i]
            if (child.matrixWorldAutoUpdate === true || force === true) {
                child.updateMatrixWorld(force)
            }
        }

        return this
    }
    updateWorldMatrix(updateParents, updateChildren) {
        const parent = this.parent

        if (updateParents && parent !== null && parent.matrixWorldAutoUpdate) {
            parent.updateWorldMatrix(true, false)
        }

        if (this.matrixAutoUpdate) {
            this.updateMatrix()
        }

        if (this.parent === null) {
            this.matrixWorld.copy(this.matrix)
        } else {
            this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix)
        }

        if (updateChildren) {
            this.children.forEach(child => {
                if (child.matrixWorldAutoUpdate === true) {
                    child.updateWorldMatrix(false, true)
                }
            })
        }

        return this
    }
}

Object3D.DEFAULT_MATRIX_AUTO_UPDATE = true
Object3D.DEFAULT_MATRIX_WORLD_AUTO_UPDATE = true
Object3D.DEFAULT_UP = new Vector3(0, 1, 0)

export default Object3D