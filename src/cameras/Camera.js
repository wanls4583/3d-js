import Object3D from "../core/Object3D.js";
import Matrix4 from "../math/Matrix4.js";

class Camera extends Object3D {
    constructor() {
        super()

        this.isCamera = true
        this.type = 'Camera'
        this.matrixWorldInverse = new Matrix4()
        this.projectionMatrix = new Matrix4()
        this.projectionMatrixInverse = new Matrix4()
    }
    copy(source, recursive) {
        super.copy(source, recursive)

        this.matrixWorldInverse.copy(source.matrixWorldInverse)
        this.projectionMatrix.copy(source.projectionMatrix)
        this.projectionMatrixInverse.copy(source.projectionMatrixInverse)
    }
    getWorldDirection(target) {
        this.updateWorldMatrix(true, false)

        const te = this.matrixWorld.elements

        return target.set(-te[8], -te[9], -te[10]).normalize()
    }
    updateMatrixWorld(force) {
        super.updateMatrixWorld(force)

        this.matrixWorldInverse.copy(this.matrixWorld).invert()

        return this
    }
    updateWorldMatrix(updateParents, updateChildren) {
        super.updateWorldMatrix(updateParents, updateChildren)

        this.matrixWorldInverse.copy(this.matrixWorld).invert()

        return this
    }
}

export default Camera