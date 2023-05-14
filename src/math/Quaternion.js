import { multiplyComplex } from './MathUtils.js'

export default class {
    constructor(x = 0, y = 0, z = 0, w = 1) {
        this.x = x
        this.y = y
        this.z = z
        this.w = w
    }
    copy(q) {
        this.x = q.x
        this.y = q.y
        this.z = q.z
        this.w = q.w
    }
    clone() {
        return new this.constructor(...this)
    }
    invert() {
        this.x = -this.x
        this.y = -this.y
        this.z = -this.z

        return this
    }
    lengthSq() {
        return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
    }
    normalize() {
        let len = this.length()

        if (len === 0) {
            this.x = 0
            this.y = 0
            this.z = 0
            this.w = 1
        } else {
            len = 1 / len
            this.x *= len
            this.y *= len
            this.z *= len
            this.w *= len
        }

        return this
    }
    multiply(q) {
        this.multiplyQuaternions(this, q)
    }
    multiplyQuaternions(a, b) {
        const result = multiplyComplex(a, b)
        this.copy(result)

        return this
    }
    setFromAxisAngle(axis, angle) {
        const halfAng = angle / 2, sin = Math.sin(halfAng)

        this.x = axis.x * sin
        this.y = axis.y * sin
        this.z = axis.z * sin
        this.w = Math.cos(halfAng)

        return this
    }
    setFromRotationMatrix(m) {

    }
    *[Symbol.iterator]() {
        yield this.x;
        yield this.y;
        yield this.z;
        yield this.w;
    }
}