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
    }
    setSize(width, height) {
        this.domElement.width = width
        this.domElement.height = height
        this.domElement.style.width = width + 'px'
        this.domElement.style.height = height + 'px'
        this.gl = this.domElement.getContext('webgl')
        this.shader = new Shader(this.gl)
    }
    render(scene, camera) {
        const renderList = []

        this.gl.clearColor(0, 0, 0, 1)
        this.gl.clear(this.gl.COLOR_BUFFER_BIT)
        this.gl.enable(this.gl.DEPTH_TEST)

        scene.updateWorldMatrix(false, true)
        camera.updateWorldMatrix()
        camera.updateProjectionMatrix()
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
        this.shader.uniformMatrix4fv('projectMatrix', new Float32Array(camera.projectionMatrix.elements))
        this.shader.uniformMatrix4fv('viewMatrix', new Float32Array(camera.matrixWorldInverse.elements))
        this.shader.uniformMatrix4fv('modelMatrix', new Float32Array(mesh.matrixWorld.elements))

        let position = mesh.geometry.attributes.position

        this.gl.drawArrays(this.gl.TRIANGLES, 0, position.data.length / position.size)
    }
    setAttributes(geometry) {
        const { attributes } = geometry


        if (geometry.bufferData) {
            this.shader.bindBuffer(geometry.bufferData)
        } else {
            let position = attributes.position
            let data = []
            let offset = 0
            let keys = Object.keys(attributes)

            for (let i = 0, len = position.data.length / position.size; i < len; i++) {
                keys.forEach(key => {
                    let attr = attributes[key]
                    data.push(...attr.data.slice(i * attr.size, (i + 1) * attr.size))
                })
            }
            keys.forEach(key => {
                let attr = attributes[key]
                attr.offset = offset
                offset += attr.size * Float32Array.BYTES_PER_ELEMENT
            })
            keys.forEach(key => {
                let attr = attributes[key]
                attr.stride = offset
            })
            geometry.bufferData = this.shader.setBufferData(new Float32Array(data))
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
            this.shader[attr.type](key, ...attr.data)
        }
    }
}