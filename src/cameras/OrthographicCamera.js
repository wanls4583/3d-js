import Camera from './Camera.js'

class OrthographicCamera extends Camera {
    constructor(left = -1, right = 1, top = 1, bottom = -1, near = 0.1, far = 2000) {
        super()

        this.isOrthographicCamera = true
        this.type = 'OrthographicCamera'
        this.zoom = 1
        this.view = null
        this.left = left
        this.right = right
        this.top = top
        this.bottom = bottom
        this.near = near
        this.far = far

        this.updateProjectionMatrix()
    }
    copy(source, recursive) {
        super.copy(source, recursive)

        this.view = source.view ? Object.assign({}, source.view) : null
        this.zoom = source.zoom
        this.left = source.left
        this.right = source.right
        this.top = source.top
        this.bottom = source.bottom
        this.near = source.near
        this.far = source.far

        return this
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
        const halfX = (this.right - this.left) / this.zoom / 2
        const halfY = (this.top - this.bottom) / this.zoom / 2
        const centerX = (this.left + this.right) / 2
        const centerY = (this.top + this.bottom) / 2

        let left = centerX - halfX
        let right = centerX + halfX
        let top = centerY + halfY
        let bottom = centerY - halfY

        if (this.view !== null && this.view.enabled) {
            const scaleW = (this.right - this.left) / this.zoom / this.view.fullWidth
            const scaleH = (this.top - this.bottom) / this.zoom / this.view.fullHeight

            left += scaleW * this.view.offsetX
            right = left + scaleW * this.view.width
            top += scaleH * this.view.offsetY
            bottom = top - scaleH * this.view.height
        }

        this.projectionMatrix.makeOrthographic(left, right, top, bottom, this.near, this.far)
        this.projectionMatrixInverse.copy(this.projectionMatrix.clone().invert())

        return this
    }
}

export default OrthographicCamera