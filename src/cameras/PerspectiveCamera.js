import Camera from './Camera.js'
import { RAD2DEG, DEG2RAD } from '../math/MathUtils.js'

class PerspectiveCamera extends Camera {
    constructor(fov = 50, aspect = 1, near = 0.1, far = 2000) {
        super()

        this.isPerspectiveCamera = true
        this.type = 'PerspectiveCamera'
        this.zoom = 1
        this.view = null
        this.near = near
        this.far = far
        this.fov = fov
        this.aspect = aspect
        this.filmGauge = 35 //交卷尺寸
        this.filmOffset = 0 //交卷水平偏移量

        this.updateProjectionMatrix()
    }
    copy(source, recursive) {
        super.copy(source, recursive)

        this.view = source.view ? Object.assign({}, source.view) : null
        this.zoom = source.zoom
        this.near = source.near
        this.far = source.far
        this.fov = source.fov
        this.aspect = source.aspect
        this.filmGauge = source.filmGauge
        this.filmOffset = source.filmOffset

        return this
    }
    // 设置焦距
    setFocalLength(focalLength) {
        const filmHeight = this.getFilmHeight()

        this.fov = Math.atan(filmHeight / 2 / focalLength) * 2 * RAD2DEG
        this.updateProjectionMatrix()

        return this
    }
    // 获取焦距
    getFocalLength() {
        const filmHeight = this.getFilmHeight()
        const tan = Math.tan(this.fov * DEG2RAD / 2)

        return filmHeight / 2 / tan
    }
    // 获取有效的垂直视野角度
    getEffectiveFOV() {
        return RAD2DEG * 2 * Math.atan(Math.tan(this.fov / 2 * DEG2RAD) / this.zoom)
    }
    // 获取交卷的宽度
    getFilmWidth() {
        // 如果aspect小于1，则filmGauge代表的是交卷高度
        return this.filmGauge * Math.min(this.aspect, 1)
    }
    // 获取交卷的高度
    getFilmHeight() {
        // 如果aspect大于1，则filmGauge代表的是交卷宽度
        return this.filmGauge / Math.max(this.aspect, 1)
    }
    setViewOffset(fullWidth, fullHeight, x, y, width, height) {
        this.view = this.view === null ? {} : this.view
        this.view.enabled = true
        this.view.fullWidth = fullWidth
        this.view.fullHeight = fullHeight
        this.view.offsetX = x
        this.view.offsetY = y
        this.view.width = width
        this.view.height = height

        this.updateProjectionMatrix()

        return this
    }
    clearViewOffset() {
        if (this.view !== null) {
            this.view.enabled = false
        }

        this.updateProjectionMatrix()

        return this
    }
    updateProjectionMatrix() {
        const top = this.near * Math.tan(this.fov / 2 * DEG2RAD) / this.zoom
        const height = top * 2
        const width = height * this.aspect
        const left = -width / 2

        if (this.view !== null && this.view.enabled) {
            const scaleW = width / this.view.fullWidth
            const scaleH = height / this.view.fullHeight

            left += scaleW * this.view.offsetX
            top += scaleH * this.view.offsetY
            width *= scaleW
            height *= scaleH
        }

        // 交卷向右偏移
        if (this.filmOffset !== 0) {
            left += this.near * this.filmOffset / this.getFilmWidth()
        }

        this.projectionMatrix.makePerspective(left, left + width, top, top - height, this.near, this.far)
        this.projectionMatrixInverse.copy(this.projectionMatrix.clone().invert())

        return this
    }
}

export default PerspectiveCamera