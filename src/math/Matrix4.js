import { invertMatrix } from './MathUtils.js'
import Vector3 from './Vector3.js'
export default class {
    constructor() {
        const te = []

        te[0] = 1, te[4] = 0, te[8] = 0, te[12] = 0
        te[1] = 0, te[5] = 1, te[9] = 0, te[13] = 0
        te[2] = 0, te[6] = 0, te[10] = 1, te[14] = 0
        te[3] = 0, te[7] = 0, te[11] = 0, te[15] = 1

        this.elements = te
        this.isMatrix4 = true
    }
    clone() {
        return new this.constructor().fromArray(this.elements)
    }
    copy(m4) {
        for (let i = 0; i < 16; i++) {
            this.elements[i] = m4[i]
        }

        return this
    }
    determinant() {
        const te = this.elements
        const n11 = te[0], n12 = te[4], n13 = te[8], n14 = te[12]
        const n21 = te[1], n22 = te[5], n23 = te[9], n24 = te[13]
        const n31 = te[2], n32 = te[6], n33 = te[10], n34 = te[14]
        const n41 = te[3], n42 = te[7], n43 = te[11], n44 = te[15]

        return (
            + n11 * (
                + n22 * (n33 * n44 - n43 * n34)
                - n23 * (n32 * n44 - n42 * n34)
                + n24 * (n32 * n43 - n42 * n33)
            )
            - n12 * (
                + n21 * (n33 * n44 - n43 * n34)
                - n23 * (n31 * n44 - n41 * n34)
                + n24 * (n31 * n43 - n41 * n33)
            )
            + n13 * (
                + n21 * (n32 * n44 - n42 * n34)
                - n22 * (n31 * n44 - n41 * n34)
                + n24 * (n31 * n42 - n41 * n32)
            )
            - n14 * (
                + n21 * (n32 * n43 - n42 * n33)
                - n22 * (n31 * n43 - n41 * n33)
                + n23 * (n31 * n42 - n41 * n32)
            )
        )
    }
    fromArray(arr, offset = 0) {
        for (let i = 0; i < 16; i++) {
            this.elements[i] = arr[i + offset];
        }

        return this;
    }
    invert() {
        return new this.constructor().fromArray(invertMatrix(this.elements))
    }
    identity() {
        this.set(
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        )

        return this
    }
    lookAt(eye, target, up) {
        let z = eye.clone().sub(target)

        // eye与target在同一个点
        if (z.lengthSq() === 0) {
            z.z = 1
        }

        z.normalize()

        let x = up.clone().cross(z)

        // x与z平行
        if (x.lengthSq() === 0) {
            z.z += 0.0001
            z.normalize()
            x = up.clone().cross(z)
        }

        x.normalize()

        let y = z.clone().cross(x)

        this.fromArray([...x, 0, ...y, 0, ...z, 0, 0, 0, 0, 1])
        this.invert()

        return this
    }
    makeRotationAxis(axis, theta) {
        const a = axis.x, b = axis.y, c = axis.z
        const cos = Math.cos(theta), sin = Math.sin(theta), cos1 = 1 - cos
        const te = this.elements

        te[0] = a * a * cos1 + cos
        te[1] = a * b * cos1 + c * sin
        te[2] = a * c * cos1 - b * sin
        te[3] = 0

        te[4] = a * b * cos1 - c * sin
        te[5] = b * b * cos1 + cos
        te[6] = b * c * cos1 + a * sin
        te[7] = 0

        te[8] = a * c * cos1 + b * sin
        te[9] = b * c * cos1 - a * sin
        te[10] = c * c * cos1 + cos
        te[11] = 0

        te[12] = 0
        te[13] = 0
        te[14] = 0
        te[15] = 1

        return this
    }
    makeOrthographic(left, right, top, bottom, near, far) {
        near = -near
        far = -far

        let xs = 2 / (right - left)
        let ys = 2 / (top - bottom)
        let zs = 2 / (far - near)

        let xw = -(left + right) / 2 * xs
        let yw = -(top + bottom) / 2 * ys
        let zw = -(near + far) / 2 * zs

        return this.fromArray([
            xs, 0, 0, 0,
            0, ys, 0, 0,
            0, 0, zs, 0,
            xw, yw, zw, 1
        ])
    }
    makePerspective(left, right, top, bottom, near, far) {
        // -nA + B = -n*n
        // -fA + B = -f*f
        // =>
        // A = n+f
        // B = nf
        // 2/(r-l)   0     0     -(r+l)/(r-l)
        // 0      2/(t-b)  0     -(t+b)/(t-b)
        // 0         0   2/(n-f) (n+f)/(n-f)
        // 0         0     0           1
        // *
        // n   0   0   0
        // 0   n   0   0
        // 0   0  n+f nf
        // 0   0  -1   0
        // =>
        // 2n/(r-l)   0      (r+l)/(r-l)   0
        // 0       2n/(t-b)  (t+b)/(t-b)   0
        // 0          0      (n+f)/(n-f)   2nf/(n-f)
        // 0          0           -1       0
        const m = new this.constructor().set(
            near, 0, 0, 0,
            0, near, 0, 0,
            0, 0, near + far, near * far,
            0, 0, -1, 0,
        )
        this.makeOrthographic(left, right, top, bottom, near, far).multiply(m)

        return this
    }
    makeRotationFromQuaternion(q) {
        const te = this.elements

        te[0] = 2 * (q.x * q.x + q.w * q.w) - 1
        te[1] = 2 * (q.x * q.y + q.w * q.z)
        te[2] = 2 * (q.x * q.z - q.y * q.w)
        te[3] = 0

        te[4] = 2 * (q.x * q.y - q.w * q.z)
        te[5] = 2 * (q.y * q.y + q.w * q.w) - 1
        te[6] = 2 * (q.y * q.z + q.x * q.w)
        te[7] = 0

        te[8] = 2 * (q.x * q.z + q.y * q.w)
        te[9] = 2 * (q.y * q.z - q.x * q.w)
        te[10] = 2 * (q.z * q.z + q.w * q.w) - 1
        te[11] = 0

        te[12] = 0
        te[13] = 0
        te[14] = 0
        te[15] = 1

        return this
    }
    multiply(m) {
        return this.multiplyMatrices(this, m)
    }
    premultiply() {
        return this.multiplyMatrices(m, this)
    }
    multiplyMatrices(a, b) {
        const ta = a.elements
        const tb = b.elements
        const te = this.elements

        const n11 = ta[0], n12 = ta[4], n13 = ta[8], n14 = ta[12]
        const n21 = ta[1], n22 = ta[5], n23 = ta[9], n24 = ta[13]
        const n31 = ta[2], n32 = ta[6], n33 = ta[10], n34 = ta[14]
        const n41 = ta[3], n42 = ta[7], n43 = ta[11], n44 = ta[15]

        const m11 = tb[0], m12 = tb[4], m13 = tb[8], m14 = tb[12]
        const m21 = tb[1], m22 = tb[5], m23 = tb[9], m24 = tb[13]
        const m31 = tb[2], m32 = tb[6], m33 = tb[10], m34 = tb[14]
        const m41 = tb[3], m42 = tb[7], m43 = tb[11], m44 = tb[15]

        te[0] = n11 * m11 + n12 * m21 + n13 * m31 + n14 * m41
        te[1] = n21 * m11 + n22 * m21 + n23 * m31 + n24 * m41
        te[2] = n31 * m11 + n32 * m21 + n33 * m31 + n34 * m41
        te[3] = n41 * m11 + n42 * m21 + n43 * m31 + n44 * m41

        te[4] = n11 * m12 + n12 * m22 + n13 * m32 + n14 * m42
        te[5] = n21 * m12 + n22 * m22 + n23 * m32 + n24 * m42
        te[6] = n31 * m12 + n32 * m22 + n33 * m32 + n34 * m42
        te[7] = n41 * m12 + n42 * m22 + n43 * m32 + n44 * m42

        te[8] = n11 * m13 + n12 * m23 + n13 * m33 + n14 * m43
        te[9] = n21 * m13 + n22 * m23 + n23 * m33 + n24 * m43
        te[10] = n31 * m13 + n32 * m23 + n33 * m33 + n34 * m43
        te[11] = n41 * m13 + n42 * m23 + n43 * m33 + n44 * m43

        te[12] = n11 * m14 + n12 * m24 + n13 * m34 + n14 * m44
        te[13] = n21 * m14 + n22 * m24 + n23 * m34 + n24 * m44
        te[14] = n31 * m14 + n32 * m24 + n33 * m34 + n34 * m44
        te[15] = n41 * m14 + n42 * m24 + n43 * m34 + n44 * m44

        return this
    }
    set(n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44) {
        const te = this.elements;

        te[0] = n11; te[4] = n12; te[8] = n13; te[12] = n14;
        te[1] = n21; te[5] = n22; te[9] = n23; te[13] = n24;
        te[2] = n31; te[6] = n32; te[10] = n33; te[14] = n34;
        te[3] = n41; te[7] = n42; te[11] = n43; te[15] = n44;

        return this;
    }
}