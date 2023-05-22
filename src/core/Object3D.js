import Matrix4 from '../math/Matrix4.js'
import Vector3 from '../math/Vector3.js'
import Quaternion from '../math/Quaternion.js'
import { generateUUID } from '../math/MathUtils.js'

let _object3DId = 0

const _xAxis = new Vector3(1, 0, 0)
const _yAxis = new Vector3(0, 1, 0)
const _zAxis = new Vector3(0, 0, 1)

const _position = new Vector3();
const _scale = new Vector3();
const _quaternion = new Quaternion();

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
        this.up = Object3D.DEFAULT_UP.clone()
        this.uuid = generateUUID()
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