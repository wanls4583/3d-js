function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value))
}

function matrixToRowCol(te) {
    let factorial = Math.sqrt(te.length)
    let mt = []
    for (let i = 0; i < factorial; i++) {
        let arr = []
        for (let j = 0; j < factorial; j++) {
            arr.push(te[i + factorial * j])
        }
        mt.push(arr)
    }
    return mt
}

function invertMatrix(te) {
    let result = te
    let factorial = Math.sqrt(te.length)
    let newMt = new Array(factorial).fill(0).map(() => {
        return new Array(factorial).fill(0)
    })
    for (let i = 0; i < factorial; i++) {
        newMt[i][i] = 1
    }
    let mt = matrixToRowCol(te)

    if (_step1()) {
        _step2()
        _step3()
        result = []
        for (let i = 0; i < factorial; i++) {
            for (let j = 0; j < factorial; j++) {
                result.push(newMt[j][i])
            }
        }
    }
    return result


    //左下角归零
    function _step1() {
        for (let row = 0; row < factorial - 1; row++) {
            if (!_moveRow(row)) {
                return false
            }
            let num = mt[row][row]
            for (let downRow = row + 1; downRow < factorial; downRow++) {
                if (mt[downRow][row] != 0) {
                    let k = -mt[downRow][row] / num
                    _multiplyRow(downRow, row, k)
                }
            }
        }
        return true
    }

    //对角线归一
    function _step2() {
        for (let row = 0; row < factorial; row++) {
            if (mt[row][row] != 1) {
                _multiplyNum(row, 1 / mt[row][row])
            }
        }
    }

    //右上角归零
    function _step3() {
        for (let row = factorial - 1; row > 0; row--) {
            let num = mt[row][row]
            for (let upRow = row - 1; upRow >= 0; upRow--) {
                if (mt[upRow][row] != 0) {
                    let k = -mt[upRow][row] / num
                    _multiplyRow(upRow, row, k)
                }
            }
        }
    }

    function _moveRow(row) {
        if (mt[row][row] == 0) {
            for (let i = row + 1; i < factorial; i++) {
                if (mt[i][row] != 0) {
                    _changeRow(row, i)
                    return true
                }
            }
            return false
        }
        return true
    }

    function _changeRow(row1, row2) {
        for (let i = 0; i < factorial; i++) {
            let t1 = mt[row1][i]
            let t2 = newMt[row1][i]
            mt[row1][i] = mt[row2][i]
            mt[row2][i] = t1
            newMt[row1][i] = newMt[row2][i]
            newMt[row2][i] = t2
        }
    }

    function _multiplyNum(row, num) {
        for (let i = 0; i < factorial; i++) {
            mt[row][i] *= num
            newMt[row][i] *= num
        }
    }

    function _multiplyRow(row1, row2, k) {
        k = k || 1
        for (let i = 0; i < factorial; i++) {
            mt[row1][i] += k * mt[row2][i]
            newMt[row1][i] += k * newMt[row2][i]
        }
    }
}

function multiplyComplex() {
    // (w1 + x1i + y1j + z1k) *
    // (w2 + x2i + y2j + z2k)
    // =
    // w1*w2 + w1*x2i + w1*y2j + w1*z2k +
    // x1i*w2 + x1i*x2i + x1i*y2j + x1i*z2k +
    // y1j*w2 + y1j*x2i + y1j*y2j + y1j*z2k +
    // z1k*w2 + z1k*x2i + z1k*y2j + z1k*z2k
    // =
    // w1*w2 + (w1*x2)i + (w1*y2)j + (w1*z2)k +
    // (w2*x1)i - x1*x2 + (x1y2)k - (x1z2)j + 
    // (w2*y1)j - (y1x2)k - y1*y2 + (y1z2)i + 
    // (w2*z1)k + (z1x2)j - (z1y2)i - z1z2
    // =
    // w1*w2 - x1*x2 - y1y2 - z1z2 + 
    // (w1*x2 + w2*x1 + y1z2 - z1y2)i +
    // (w1*y2 + w2*y1 + z1x2 - x1z2)j +
    // (w1*z2 + w2*z1 + x1y2 - y1x2)k
    if (arguments.length === 1) {
        return arguments[0]
    }
    let result = { x: 0, y: 0, z: 0, w: 1 }
    for (let i = 0; i < arguments.length; i++) {
        result = _multiplyComplex(result, arguments[i])
    }
    return result

    function _multiplyComplex(a, b) {
        const x1 = a.x, y1 = a.y, z1 = a.z, w1 = a.w || 0
        const x2 = b.x, y2 = b.y, z2 = b.z, w2 = b.w || 0

        return {
            x: w1 * x2 + w2 * x1 + y1 * z2 - z1 * y2,
            y: w1 * y2 + w2 * y1 + z1 * x2 - x1 * z2,
            z: w1 * z2 + w2 * z1 + x1 * y2 - y1 * x2,
            w: w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2
        }
    }
}

function generateUUID() {
    const d0 = Math.random() * 0xffffffff | 0;
    const d1 = Math.random() * 0xffffffff | 0;
    const d2 = Math.random() * 0xffffffff | 0;
    const d3 = Math.random() * 0xffffffff | 0;
    const uuid = _lut[d0 & 0xff] + _lut[d0 >> 8 & 0xff] + _lut[d0 >> 16 & 0xff] + _lut[d0 >> 24 & 0xff] + '-' +
        _lut[d1 & 0xff] + _lut[d1 >> 8 & 0xff] + '-' + _lut[d1 >> 16 & 0x0f | 0x40] + _lut[d1 >> 24 & 0xff] + '-' +
        _lut[d2 & 0x3f | 0x80] + _lut[d2 >> 8 & 0xff] + '-' + _lut[d2 >> 16 & 0xff] + _lut[d2 >> 24 & 0xff] +
        _lut[d3 & 0xff] + _lut[d3 >> 8 & 0xff] + _lut[d3 >> 16 & 0xff] + _lut[d3 >> 24 & 0xff];

    // .toLowerCase() here flattens concatenated strings to save heap memory space.
    return uuid.toLowerCase();
}

function printMtrix(mt, title = 'matrix') {
    let arrs = matrixToRowCol(mt.elements)
    let str = []
    console.log(title)
    arrs.forEach(arr => {
        arr = arr.map(num => {
            num = num.toFixed(6)
            num = num[0] == '-' ? num : ' ' + num
            for (let i = 0, len = 12 - num.length; i < len; i++) {
                num += ' '
            }
            return num
        })
        let rowStr = arr.join('')
        console.log(rowStr)
        str.push(rowStr)
    })
    console.log('---------------------------------------------------\n')
    return str.join('\n')
}

export {
    clamp,
    matrixToRowCol,
    invertMatrix,
    multiplyComplex,
    generateUUID,
    printMtrix
}