export default class {
    constructor(x = 0, y = 0, z = 0, w = 1) {
        this.x = x
        this.y = y
        this.z = z
        this.w = w
    }
    invert() {
        this.x = -this.x
        this.y = -this.y
        this.z = -this.z
    }
    setFromAxisAngle(vec3, angle) {

    }
    setFromRotationMatrix(matrix4) {

    }
    multiply() {
        
    }
}