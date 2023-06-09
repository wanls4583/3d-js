let nowObj = null
let nowMtl = null
let nowUsemtl = ''
let mtllibFile = ''
let allVtn = {
    v: [],
    vt: [],
    vn: []
}

export default class OBJLoader {
    constructor() {
        this.objs = {}
        this.mtls = {}
    }
    async parseObj(objUrl) {
        const text = await this.loadFile(objUrl)
        const lines = text.split(/\r\n|\n|\r/)
        const keyR = /\s*?(\w+)\s+/
        lines.forEach(line => {
            let key = keyR.exec(line)
            if (key && key[1]) {
                this[key[1]] && this[key[1]](line.slice(key.index + key[0].length))
            }
        })
        if (mtllibFile) {
            return this.parseMTL(mtllibFile).then(() => {
                return {
                    objs: this.objs,
                    mtls: this.mtls
                }
            })
        }
    }
    async parseMTL(objUrl) {
        const text = await this.loadFile(objUrl)
        const lines = text.split(/\r\n|\n|\r/)
        const keyR = /\s*?(\w+)\s+/
        lines.forEach(line => {
            let key = keyR.exec(line)
            if (key && key[1]) {
                this[key[1]] && this[key[1]](line.slice(key.index + key[0].length))
            }
        })
    }
    async loadFile(objUrl) {
        const response = await fetch(objUrl);
        const text = response.text();
        return text
    }
    splitData(str) {
        str = str.split(/\s/).map(s => s.trim())
        return str.filter(s => s)
    }
    mtllib(data) {
        mtllibFile = data.trim()
    }
    usemtl(data) {
        nowUsemtl = data.trim()
    }
    o(data) {
        nowObj = {
            f: []
        }
        this.objs[data] = nowObj
    }
    v(data) {
        data = this.splitData(data).map(s => Number(s))
        allVtn.v.push(data.slice(0, 3))
    }
    vt(data) {
        data = this.splitData(data).map(s => Number(s))
        allVtn.vt.push(data.slice(0, 3))
    }
    vn(data) {
        data = this.splitData(data).map(s => Number(s))
        allVtn.vn.push(data.slice(0, 3))
    }
    f(data) {
        const v = [], vt = [], vn = []
        data = this.splitData(data).map(s => s.split('/').map(d => d - 0 || 0))
        for (let i = 0; i < data.length - 2; i++) {
            _addVertex(data[0])
            _addVertex(data[i + 1])
            _addVertex(data[i + 2])
        }
        nowObj.f.push({ v, vt, vn, usemtl: nowUsemtl })

        function _addVertex(d) {
            d[0] && v.push(allVtn.v[d[0] - 1])
            d[1] && vt.push(allVtn.vt[d[1] - 1])
            d[2] && vn.push(allVtn.vn[d[2] - 1])
        }
    }
    // 以下为mtl文件相关属性
    newmtl(data) {
        nowMtl = {}
        this.mtls[data.trim()] = nowMtl
    }
    // 环境色
    Ka(data) {
        nowMtl.Ka = this.splitData(data).map(s => Number(s)).slice(0, 3)
    }
    // 漫射色
    Kd(data) {
        nowMtl.Kd = this.splitData(data).map(s => Number(s)).slice(0, 3)
    }
    // 高光色
    Ks(data) {
        nowMtl.Ks = this.splitData(data).map(s => Number(s)).slice(0, 3)
    }
    // 高光色权重
    Ns(data) {
        nowMtl.Ns = data - 0 || 0
    }
    // 表面光学密度
    Ni(data) {
        nowMtl.Ns = data - 0 || 0
    }
    // 透明的
    d(data) {
        nowMtl.d = data - 0 || 0
    }
    // 光照模型
    illum(data) {
        nowMtl.illum = data - 0 || 0
    }
}