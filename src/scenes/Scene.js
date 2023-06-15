import Object3D from "../core/Object3D.js";

class Scene extends Object3D {
    constructor() {
        super()

        this.isScene = true
        this.type = 'Scene'
        this.background = null
        this.environment = null
    }
    copy(source, recursive) {
        super.copy(source, recursive)

        if (source.background !== null) {
            this.background = source.background
        }

        if (source.environment !== null) {
            this.environment = source.environment
        }

        return this
    }
}

export default Scene