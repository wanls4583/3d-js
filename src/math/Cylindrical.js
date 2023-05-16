// 圆柱坐标
export default class {
    constructor(radius, theta, y) {
        this.radius = radius
        this.theta = theta //从z轴正半轴开始，往x轴正半轴方向的夹角
        this.y = y
    }
    clone() {
        return new this.constructor(this.radius, this.theta, this.y)
    }
    copy(s) {
        this.radius = s.radius
        this.theta = s.theta
        this.y = s.y

        return this
    }
    set(radius, theta, y) {
        this.radius = radius
        this.theta = theta
        this.y = y

        return this
    }
    setFromVector3(vec3) {
        return this.setFromCartesianCoords(...vec3)
    }
    setFromCartesianCoords(x, y, z) {
        this.radius = Math.sqrt(x * x + z * z)
        this.theta = Math.atan2(x, z)
        this.y = y

        return this
    }
}