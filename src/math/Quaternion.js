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
        // 2(xx+ww)-1    2(xy-zw)    2(xz+yw)    0
        // 2(xy+zw)      2(yy+ww)-1  2(yz-xw)    0
        // 2(xz-yw)      2(yz+xw)    2(zz+ww)-1  0
        // 0             0           0           1 
        const te = m.elements
        const m11 = te[0], m12 = te[4], m13 = te[8]
        const m21 = te[1], m22 = te[5], m23 = te[9]
        const m31 = te[2], m32 = te[6], m33 = te[10]

        //trace = 4*w*w - 1
        let trace = m11 + m22 + m33
        let t = 0

        if(trace > 0) {
            t = Math.sqrt(trace + 1) / 2
            this.w = t
            this.x = (m32 - m23) / t / 4
            this.y = (m13 - m31) / t / 4
            this.z = (m21 - m12) / t / 4
        } else if (m11 > m22 && m11 > m33) { //斜对角线中x最大（选取最大值优先计算，增加精确度）
            //trace = 4*x*x - 1
            trace = m11 - m22 - m33
            t = Math.sqrt(trace + 1) / 2
            this.x = t
            this.y = (m21 + m12) / t / 4
            this.z = (m31 + m13) / t / 4
            this.w = (m32 - m23) / t / 4
        } else if (m22 > m33) { //斜对角线中y最大
            //trace = 4*y*y - 1
            trace = m22 - m11 - m33
            t = Math.sqrt(trace + 1) / 2
            this.y = t
            this.x = (m21 + m12) / t / 4
            this.z = (m32 + m23) / t / 4
            this.w = (m13 - m31) / t / 4
        } else { //斜对角线中z最大
            //trace = 4*z*z - 1
            trace = m33 - m11 - m22
            t = Math.sqrt(trace + 1) / 2
            this.z = t
            this.x = (m31 + m13) / t / 4
            this.y = (m32 + m23) / t / 4
            this.w = (m21 - m12) / t / 4
        }

        return this
    }
    *[Symbol.iterator]() {
        yield this.x;
        yield this.y;
        yield this.z;
        yield this.w;
    }
}