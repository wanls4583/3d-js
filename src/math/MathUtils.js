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

function printMtrix(mt, title = 'matrix') {
    let arrs = matrixToRowCol(mt.elements)
    let str = []
    console.log(title)
    arrs.forEach(arr => {
        arr = arr.map(num => {
            num = num.toFixed(4)
            num = num == '-' ? num : ' ' + num
            return num
        })
        let rowStr = arr.join('    ')
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
    printMtrix
}