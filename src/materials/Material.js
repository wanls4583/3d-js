export default class Material {
    constructor(vertexShader, fragmentShader) {
        this.isMaterial = true
        this.uniforms = {}
        this.vertexShader = vertexShader
        this.fragmentShader = fragmentShader
    }
}