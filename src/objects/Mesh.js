import Object3D from '../core/Object3D.js'

export default class Mesh extends Object3D {
    constructor(geometry, material) {
        super()

        this.type = 'Mesh'
        this.isMesh = true
        this.geometry = geometry
        this.material = material
    }
}