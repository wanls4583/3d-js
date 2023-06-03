import { clamp, multiplyComplex } from './MathUtils.js'
import Quaternion from './Quaternion.js'

const _quaternion = new Quaternion();

class Vector3 {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x
        this.y = y
        this.z = z
        this.isVector3 = true
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
    applyAxisAngle(axis, angle) {
        return this.applyQuaternion(_quaternion.setFromAxisAngle(axis, angle));
    }
    applyMatrix3(m) {
        const x = this.x, y = this.y, z = this.z
        const te = m.elements

        this.x = te[0] * x + te[3] * y + te[6] * z
        this.y = te[1] * x + te[4] * y + te[7] * z
        this.z = te[2] * x + te[5] * y + te[8] * z

        return this
    }
    applyMatrix4(m) {
        const x = this.x, y = this.y, z = this.z
        const te = m.elements
        const w = te[3] * x + te[7] * y + te[11] * z + te[15]

        this.x = (te[0] * x + te[4] * y + te[8] * z + te[12]) / w
        this.y = (te[1] * x + te[5] * y + te[9] * z + te[13]) / w
        this.z = (te[2] * x + te[6] * y + te[10] * z + te[14]) / w

        return this
    }
    applyQuaternion(q) {
        return this.copy(multiplyComplex(q, this, q.clone().invert()))
    }
    angleTo(vec3) {
        const denominator = Math.sqrt(this.lengthSq() * vec3.lengthSq())
        if (denominator === 0) {
            return Math.PI / 2
        }
        const theta = this.dot(vec3) / denominator

        return Math.acos(clamp(theta, -1, 1))
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
        const ax = a.x, ay = a.y, az = a.z
        const bx = b.x, by = b.y, bz = b.z
        this.x = ay * bz - az * by
        this.y = az * bx - ax * bz
        this.z = ax * by - ay * bx

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
    setFromSpherical(spherical) {
        return this.setFromSphericalCoords(spherical.radius, spherical.phi, spherical.theta)
    }
    setFromSphericalCoords(radius, phi, theta) {
        const len = radius * Math.sin(phi)

        this.x = len * Math.sin(theta)
        this.y = radius * Math.cos(phi)
        this.z = len * Math.cos(theta)

        return this
    }
    setFromGeography(geography) {
        return this.setFromGeographyCoords(geography.radius, geography.latitude, geography.longtidude)
    }
    setFromGeographyCoords(radius, latitude, longtidude) {
        const len = radius * Math.cos(latitude)

        this.x = len * Math.cos(longtidude)
        this.y = radius * Math.sin(latitude)
        this.z = -len * Math.sin(longtidude)

        return this
    }
    setFromMatrixPosition(m) {
        const te = m.elements

        this.x = te[12]
        this.y = te[13]
        this.z = te[14]

        return this
    }
    setFromMatrixColumn(m, i) {
        const te = m.elements

        i = i * 4

        this.x = te[i]
        this.y = te[i + 1]
        this.z = te[i + 2]

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
    *[Symbol.iterator]() {
        yield this.x;
        yield this.y;
        yield this.z;
    }
}

export default Vector3