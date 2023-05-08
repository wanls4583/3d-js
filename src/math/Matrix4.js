export default class {
    constructor() {
        const elements = []
        elements[0] = 1, elements[4] = 0, elements[8] = 0, elements[12] = 0
        elements[1] = 0, elements[5] = 1, elements[9] = 0, elements[13] = 0
        elements[2] = 0, elements[6] = 0, elements[10] = 1, elements[14] = 0
        elements[3] = 0, elements[7] = 0, elements[11] = 0, elements[15] = 1
        this.elements = elements
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
        const elements = this.elements
        const n11 = elements[0], n12 = elements[4], n13 = elements[8], n14 = elements[12]
        const n21 = elements[1], n22 = elements[5], n23 = elements[9], n24 = elements[13]
        const n31 = elements[2], n32 = elements[6], n33 = elements[10], n34 = elements[14]
        const n41 = elements[3], n42 = elements[7], n43 = elements[11], n44 = elements[15]

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
}