import Shader from "./shader/Shader.js"
export default class WebGLRenderer {
    constructor() {
        this.domElement = null
        this.gl = null
        this.shader = null
        this.init()
    }
    init() {
        this.domElement = document.createElement('canvas')
        this.gl = this.domElement.getContext('webgl')
        this.shader = new Shader(this.gl)
    }
    setSize(width, height) {
        this.domElement.width = width
        this.domElement.height = height
        this.gl = this.domElement.getContext('webgl')
        this.shader = new Shader(this.gl)
    }
    render(scene, camera) {
        const renderList = []

        this.gl.clearColor(0, 0, 0, 1)
        this.gl.clear(this.gl.COLOR_BUFFER_BIT)
        this.gl.enable(this.gl.DEPTH_TEST)

        scene.updateWorldMatrix(false, true)
        _getRenderList(scene)

        for (let i = 0; i < renderList.length; i++) {
            let mesh = renderList[i]
            this.renderObject(mesh, camera)
        }

        function _getRenderList(scene) {
            const children = scene.children
            for (let i = 0; i < children.length; i++) {
                let obj = children[i]
                if (obj.isScene) {
                    _getRenderList(obj)
                } else if (obj.isMesh) {
                    renderList.push(obj)
                }
            }
        }
    }
    renderObject(mesh, camera) {
        const { vertexShader, fragmentShader } = mesh.material
        const program = this.shader.createProgram(vertexShader, fragmentShader)

        this.shader.useProgram(program)
        this.setAttributes(mesh.geometry)
        this.setUniforms(mesh.material)
        this.gl.drawArrays(this.gl.TRIANGLES, 0, mesh.geometry.attributes.position.length / 3)
    }
    setAttributes(geometry) {
        const { attributes } = geometry

        if(geometry.bufferData) {
            this.shader.bindBuffer(geometry.bufferData)
        } else {
            let data = []
            let offset = 0
            Object.entries(attributes).forEach(item => {
                item[1].offset = offset
                offset += item[1].size * Float32Array.BYTES_PER_ELEMENT
                data = data.concat(item[1].data)
            })
            Object.entries(attributes).forEach(item => {
                item[1].stride = offset
            })
            geometry.bufferData = this.shader.setBufferData(data)
        }
        for (let key in attributes) {
            let attr = attributes[key]
            this.shader.vertexAttribPointer(key, attr.size, attr.stride, attr.offset)
        }
    }
    setUniforms(material) {
        const uniforms = material.uniforms

        for (let key in uniforms) {
            let attr = uniforms[key]
            this.shader[attr.type](...attr.data)
        }
    }
}