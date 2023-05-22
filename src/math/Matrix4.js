import { invertMatrix } from './MathUtils.js'
import Vector3 from './Vector3.js'

const _zero = new Vector3(0, 0, 0);
const _one = new Vector3(1, 1, 1);
const _v1 = new Vector3()

class Matrix4 {
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
            this.elements[i] = m4.elements[i]
        }

        return this
    }
    compose(position, quaternion, scale) {
        const q = quaternion
        const te = this.elements

        te[0] = (2 * (q.x * q.x + q.w * q.w) - 1) * scale.x
        te[1] = (2 * (q.x * q.y + q.w * q.z)) * scale.x
        te[2] = (2 * (q.x * q.z - q.y * q.w)) * scale.x
        te[3] = 0

        te[4] = (2 * (q.x * q.y - q.w * q.z)) * scale.y
        te[5] = (2 * (q.y * q.y + q.w * q.w) - 1) * scale.y
        te[6] = (2 * (q.y * q.z + q.x * q.w)) * scale.y
        te[7] = 0

        te[8] = (2 * (q.x * q.z + q.y * q.w)) * scale.z
        te[9] = (2 * (q.y * q.z - q.x * q.w)) * scale.z
        te[10] = (2 * (q.z * q.z + q.w * q.w) - 1) * scale.z
        te[11] = 0

        te[12] = position.x
        te[13] = position.y
        te[14] = position.z
        te[15] = 1

        return this
    }
    decompose(position, quaternion, scale) {
        const te = this.elements

        let sx = _v1.set(te[0], te[1], te[2]).length()
        const sy = _v1.set(te[4], te[5], te[6]).length()
        const sz = _v1.set(te[8], te[9], te[10]).length()

        if (this.determinant() < 0) {
            sx = -sx
        }

        _m1.copy(this)

        _m1.elements[0] /= sx
        _m1.elements[1] /= sx
        _m1.elements[2] /= sx

        _m1.elements[4] /= sy
        _m1.elements[5] /= sy
        _m1.elements[6] /= sy

        _m1.elements[8] /= sz
        _m1.elements[9] /= sz
        _m1.elements[10] /= sz

        quaternion.setFromRotationMatrix(_m1)

        position.x = te[12]
        position.y = te[13]
        position.z = te[14]

        scale.x = sx
        scale.y = sy
        scale.z = sz

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
    makeBasis(vx, vy, vz) {
        this.set(
            vx.x, vy.x, vz.x, 0,
            vx.y, vy.y, vz.y, 0,
            vx.z, vy.z, vz.z, 0,
            0, 0, 0, 1
        )

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
        return this.compose(_zero, q, _one)
    }
    makeRotationX(theta) {
        const c = Math.cos(theta), s = Math.sin(theta)

        this.set(
            1, 0, 0, 0,
            0, c, -s, 0,
            0, s, c, 0,
            0, 0, 0, 1
        )

        return this
    }
    makeRotationY(theta) {
        const c = Math.cos(theta), s = Math.sin(theta)

        this.set(
            c, 0, s, 0,
            0, 1, 0, 0,
            -s, 0, c, 0,
            0, 0, 0, 1
        )

        return this
    }
    makeRotationZ(theta) {
        const c = Math.cos(theta), s = Math.sin(theta)

        this.set(
            c, -s, 0, 0,
            s, c, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        )

        return this
    }
    makeScale(x, y, z) {
        this.set(
            x, 0, 0, 0,
            0, y, 0, 0,
            0, 0, z, 0,
            0, 0, 0, 1
        );

        return this;
    }
    makeTranslation(x, y, z) {
        this.set(

            1, 0, 0, x,
            0, 1, 0, y,
            0, 0, 1, z,
            0, 0, 0, 1

        );

        return this;
    }
    multiply(m) {
        return this.multiplyMatrices(this, m)
    }
    premultiply() {
        return this.multiplyMatrices(m, this)
    }
    multiplyScalar(scaler) {
        const te = this.elements

        te[0] *= scaler, te[4] *= scaler, te[8] *= scaler, te[12] *= scaler
        te[1] *= scaler, te[5] *= scaler, te[9] *= scaler, te[13] *= scaler
        te[2] *= scaler, te[6] *= scaler, te[10] *= scaler, te[14] *= scaler
        te[3] *= scaler, te[7] *= scaler, te[11] *= scaler, te[15] *= scaler

        return this
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
    setFromMatrix3(m) {
        const me = m.elements;

        this.set(
            me[0], me[3], me[6], 0,
            me[1], me[4], me[7], 0,
            me[2], me[5], me[8], 0,
            0, 0, 0, 1
        );

        return this;
    }
    setPostion(x, y, z) {
        if (x.isVector3) {
            y = x.y, z = x.z, x = x.x
        }

        const te = this.elements

        te[12] = x
        te[13] = y
        te[14] = z

        return this
    }
}

const _m1 = new Matrix4();

export default Matrix4