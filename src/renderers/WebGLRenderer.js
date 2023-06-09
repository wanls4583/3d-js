export default class WebGLRenderer {
    constructor() {
        this.domElement = null
    }
    init() {
        this.domElement = document.createElement('canvas')
    }
    setSize(width, height) {
        this.domElement.width = width
        this.domElement.height = height
    }
    render() {

    }
}