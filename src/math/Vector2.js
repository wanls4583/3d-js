import { clamp } from './MathUtils.js'

class Vector3 {
    constructor(x = 0, y = 0) {
        this.x = x
        this.y = y
        this.isVector2 = true
    }
    add(vec2) {
        this.x += vec2.x
        this.y += vec2.y

        return this
    }
    addScalar(scaler) {
        this.x += scaler
        this.y += scaler

        return this
    }
    addVectors(a, b) {
        this.x = a.x + b.x
        this.y = a.y + b.y

        return this
    }
    applyMatrix3(m) {
        const x = this.x, y = this.y
        const te = m.elements

        this.x = te[0] * x + te[3] * y + te[6]
        this.y = te[1] * x + te[4] * y + te[7]

        return this
    }
    angleTo(vec2) {
        const denominator = Math.sqrt(this.lengthSq() * vec2.lengthSq())
        if (denominator === 0) {
            return Math.PI / 2
        }
        const theta = this.dot(vec2) / denominator

        return Math.acos(clamp(theta, -1, 1))
    }
    clamp(min, max) {
        this.x = Math.max(min.x, Math.min(max.x, this.x));
        this.y = Math.max(min.y, Math.min(max.y, this.y));

        return this
    }
    copy(vec2) {
        this.x = vec2.x
        this.y = vec2.y

        return this
    }
    clone() {
        return new this.constructor(this.x, this.y)
    }
    cross(vec2) {
        return this.x * vec2.y - this.y * vec2.x
    }
    distanceTo(vec2) {
        return Math.sqrt(this.distanceToSquared(vec2))
    }
    distanceToSquared(vec2) {
        let dx = this.x - v.x, dy = this.y - vec2.y
        return dx * dx + dy * dy
    }
    divide(vec2) {
        this.x /= vec2.x
        this.y /= vec2.y

        return this
    }
    divideScalar(scaler) {
        return this.multiplyScalar(1 / scaler)
    }
    dot(vec2) {
        return this.x * vec2.x + this.y * vec2.y
    }
    lerp(v, alpha) {
        this.x += (v.x - this.x) * alpha;
        this.y += (v.y - this.y) * alpha;

        return this;
    }
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y)
    }
    lengthSq() {
        return this.x * this.x + this.y * this.y
    }
    multiply(vec2) {
        this.x *= vec2.x
        this.y *= vec2.y

        return this
    }
    multiplyScalar(scaler) {
        this.x *= scaler
        this.y *= scaler

        return this
    }
    normalize() {
        return this.divideScalar(this.length() || 1)
    }
    set(x, y) {
        this.x = x
        this.y = y

        return this
    }
    setX(x) {
        this.x = x

        return this
    }
    setY() {
        this.y = y

        return this
    }
    sub(vec2) {
        this.x -= vec2.x
        this.y -= vec2.y

        return this
    }
    subScalar(scaler) {
        this.x -= scaler
        this.y -= scaler

        return this
    }
    subVectors(a, b) {
        this.x = a.x - b.x
        this.y = a.y - b.y

        return this
    }
    *[Symbol.iterator]() {
        yield this.x;
        yield this.y;
    }
}

export default Vector3