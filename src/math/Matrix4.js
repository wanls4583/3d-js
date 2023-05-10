import { invertMatrix } from './MathUtils.js'
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
        let z = eye.clone().sub(target).normalize()
        let x = up.clone().cross(z).normalize()
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
    set(n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44) {
        const te = this.elements;

        te[0] = n11; te[4] = n12; te[8] = n13; te[12] = n14;
        te[1] = n21; te[5] = n22; te[9] = n23; te[13] = n24;
        te[2] = n31; te[6] = n32; te[10] = n33; te[14] = n34;
        te[3] = n41; te[7] = n42; te[11] = n43; te[15] = n44;

        return this;
    }
}