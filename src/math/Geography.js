export default class Geography {
    constructor(radius, latitude, longtidude) {
        this.radius = radius
        this.latitude = latitude //维度，起始于xz平面，向上（0~PI/2），向下（0~-PI/2）
        this.longtidude = longtidude //经度，起始于x正半轴，逆时针（0~PI），顺时针（0~-PI）
    }
    clone() {
        return new this.constructor().copy(this)
    }
    copy(g) {
        this.radius = g.radius
        this.latitude = g.latitude
        this.longtidude = g.longtidude

        return this
    }
    makeSafe() {
        const EPS = 0.000001
        this.latitude = clamp(this.latitude, -Math.PI / 2 + EPS, Math.PI / 2 - EPS)

        return this
    }
    set(radius, latitude, longtidude) {
        this.radius = radius
        this.latitude = latitude
        this.longtidude = longtidude

        return this
    }
    setFromVector3(vec3) {
        return this.setFromCartesianCoords(...vec3)
    }
    setFromCartesianCoords(x, y, z) {
        this.radius = Math.sqrt(x * x + y * y + z * z)
        if (this.radius === 0) {
            this.latitude = 0
            this.longtidude = 0
        } else {
            this.latitude = Math.acos(-y / this.radius) - Math.PI / 2
            this.longtidude = Math.atan2(z, -x) - Math.PI
        }

        return this
    }
}