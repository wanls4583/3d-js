import { clamp } from './MathUtils.js'

// 球坐标
export default class {
    constructor(radius, phi, theta) {
        this.radius = radius
        this.phi = phi //从y轴正半轴开始，往y负半轴方向的夹角
        this.theta = theta //从z轴正半轴开始，往x轴正半轴方向的夹角
    }
    clone() {
        return new this.constructor(this.radius, this.phi, this.theta)
    }
    copy(s) {
        this.radius = s.radius
        this.phi = s.phi
        this.theta = s.theta

        return this
    }
    makeSafe() {
        const min = 0.000001
        this.phi = clamp(this.phi, min, Math.PI - min)

        return this
    }
    set(radius, phi, theta) {
        this.radius = radius
        this.phi = phi
        this.theta = theta

        return this
    }
    setFromVector3(vec3) {
        return this.setFromCartesianCoords(...vec3)
    }
    setFromCartesianCoords(x, y, z) {
        this.radius = Math.sqrt(x * x + y * y + z * z)
        if (this.radius === 0) {
            this.phi = 0
            this.theta = 0
        } else {
            this.phi = Math.atan2(Math.sqrt(x * x + z * z), y)
            this.theta = Math.atan2(x, z)
        }

        return this
    }
}