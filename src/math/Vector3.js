import MathUtils from './MathUtils'

export default class {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x
        this.y = y
        this.z = z
    }
    add(vec3) {
        this.x += vec3.x
        this.y += vec3.y
        this.z += vec3.z
        return this
    }
    addScalar(scaler) {
        this.x += scaler
        this.y += scaler
        this.z += scaler
        return this
    }
    addVectors(a, b) {
        this.x = a.x + b.x
        this.y = a.y + b.y
        this.z = a.z + b.z
        return this
    }
    applyAxisAngle() {

    }
    applyMatrix3() {

    }
    applyMatrix4() {

    }
    applyQuaternion() {

    }
    angleTo(vec3) {
        const denominator = Math.sqrt(this.lengthSq() * vec3.lengthSq())
        if (denominator === 0) {
            return Math.PI / 2
        }
        const theta = this.dot(vec3) / denominator
        return Math.acos(MathUtils.clamp(theta, -1, 1))
    }
    clamp(min, max) {
        this.x = Math.max(min.x, Math.min(max.x, this.x));
        this.y = Math.max(min.y, Math.min(max.y, this.y));
        this.z = Math.max(min.z, Math.min(max.z, this.z));
        return this
    }
    copy(vec3) {
        this.x = vec3.x
        this.y = vec3.y
        this.z = vec3.z
        return this
    }
    clone() {
        return new this.constructor(this.x, this.y, this.z)
    }
    cross(vec3) {
        return this.crossVectors(this, vec3)
    }
    crossVectors(a, b) {
        this.x = a.y * b.z - a.z * b.y
        this.y = a.z * b.x - a.x * b.z
        this.z = a.x * b.y - a.y * b.x
        return this
    }
    distanceTo(vec3) {
        return Math.sqrt(this.distanceToSquared(vec3))
    }
    distanceToSquared(vec3) {
        let dx = this.x - v.x, dy = this.y - vec3.y, dz = this.z - vec3.z
        return dx * dx + dy * dy + dz * dz
    }
    divide(vec3) {
        this.x /= vec3.x
        this.y /= vec3.y
        this.z /= vec3.z
        return this
    }
    divideScalar(scaler) {
        return this.multiplyScalar(1 / scaler)
    }
    dot(vec3) {
        return this.x * vec3.x + this.y * vec3.y + this.z * vec3.z
    }
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
    }
    lengthSq() {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }
    multiply(vec3) {
        this.x *= vec3.x
        this.y *= vec3.y
        this.z *= vec3.z
        return this
    }
    multiplyScalar(scaler) {
        this.x *= scaler
        this.y *= scaler
        this.z *= scaler
        return this
    }
    normalize() {
        return this.divideScalar(this.length() || 1)
    }
    set(x, y, z) {
        this.x = x
        this.y = y
        this.z = z
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
    setZ() {
        this.z = z
        return this
    }
    sub(vec3) {
        this.x -= vec3.x
        this.y -= vec3.y
        this.z -= vec3.z
        return this
    }
    subScalar(scaler) {
        this.x -= scaler
        this.y -= scaler
        this.z -= scaler
        return this
    }
    subVectors(a, b) {
        this.x = a.x - b.x
        this.y = a.y - b.y
        this.z = a.z - b.z
        return this
    }
}