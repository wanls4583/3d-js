let nowObj = null
let nowMtl = null
let mtllibFile = ''

export default class OBJLoader {
    constructor() {
        this.objs = {
            'default': {}
        }
        this.mtls = {}
        nowObj = this.objs.default
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
            return this.parseMTL(mtllibFile)
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
        nowObj.usemtl = data.trim()
    }
    o(data) {
        nowObj = {
            v: [],
            vt: [],
            vn: [],
            f: []
        }
        this.objs[data] = nowObj
    }
    v(data) {
        data = this.splitData(data).map(s => Number(s))
        nowObj.v.push(data.slice(0, 3))
    }
    vt(data) {
        data = this.splitData(data).map(s => Number(s))
        nowObj.vt.push(data.slice(0, 3))
    }
    vn(data) {
        data = this.splitData(data).map(s => Number(s))
        nowObj.vn.push(data.slice(0, 3))
    }
    f(data) {
        const v = [], vt = [], vn = []
        data = this.splitData(data).map(s => s.split('/').map(d => d - 0 || 0))
        data.forEach(d => {
            d[0] && v.push(nowObj.v[d[0] - 1])
            d[1] && vt.push(nowObj.vt[d[1] - 1])
            d[2] && vn.push(nowObj.vn[d[2] - 1])
        })
        nowObj.f.push({ v, vt, vn, usemtl: nowObj.usemtl })
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