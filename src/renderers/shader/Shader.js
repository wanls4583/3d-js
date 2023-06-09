const defaultVertexShader = `
attribute vec4 a_Position;
attribute vec4 a_Color;
uniform mat a_ProjectMatrix;
uniform mat a_ViewMatrix;
uniform mat a_ModelMatrix;
varying vec4 v_Position;
varying vec4 v_Color;
#define VERTEX_HEADER
void main() {
    gl_Position = a_ProjectMatrix * a_ViewMatrix * a_ModelMatrix * a_Position;
    v_Position = gl_Position;
    v_Color = a_Color;
    #define VERTEX_MAIN
}
`

const defaultFragmentShader = `
varying vec4 v_Position;
varying vec4 v_Color;
#define FRAGMENT_HEADER
void main() {
    gl_FragColor = v_Color;
    #define FRAGMENT_MAIN
}
`

export default class Shader {
    constructor(gl) {
        this.gl = gl
    }
    createProgram(vSource = defaultVertexShader, fSource = defaultFragmentShader) {
        const gl = this.gl
        const program = gl.createProgram()
        const vertexShader = _loaderShader(gl, gl.VERTEX_SHADER, vSource)
        const fragmentShader = _loaderShader(gl, gl.FRAGMENT_SHADER, fSource)
        gl.attachShader(program, vertexShader)
        gl.attachShader(program, fragmentShader)
        gl.linkProgram(program)

        return program

        function _loaderShader(gl, type, source) {
            const shader = gl.createShader(type)
            gl.shaderSource(shader, source)
            gl.compileShader(shader)

            return shader
        }
    }
    setBufferData(vertexs) {
        const gl = this.gl
        const vertexBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, vertexs, gl.STATIC_DRAW)

        return vertexBuffer
    }
    bindBuffer(vertexBuffer) {
        this.gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    }
    vertextAttribPointer(prop, size, categorySize = 0, startIndex = 0) {
        const gl = this.gl
        const attr = gl.getAttribLocation(gl.program, prop)
        gl.vertextAttribPointer(attr, size, gl.FLOAT, false, categorySize, startIndex)
    }
    setAtribute(prop, type) {
        const gl = this.gl
        const u = gl.getAttribLocation(gl.program, prop)
        const arr = []
        for (let i = 2; i < arguments.length; i++) {
            arr.push(arguments[i])
        }
        gl[type](u, ...arr)
    }
    setUniform(prop, type) {
        const gl = this.gl
        const u = gl.getUniformLocation(gl.program, prop)
        const arr = []
        for (let i = 2; i < arguments.length; i++) {
            arr.push(arguments[i])
        }
        gl[type](u, ...arr)
    }
    vertexAttrib4f(prop, a, b, c, d) {
        this.setAtribute(prop, 'vertexAttrib4f', a, b, c, d)
    }
    vertexAttrib3f(prop, a, b, c) {
        this.setAtribute(prop, 'vertexAttrib3f', a, b, c)
    }
    vertexAttrib2f(prop, a, b) {
        this.setAtribute(prop, 'vertexAttrib2f', a, b)
    }
    vertexAttrib1f(prop, a) {
        this.setAtribute(prop, 'vertexAttrib1f', a)
    }
    uniform4f(prop, a, b, c, d) {
        this.setUniform(prop, 'uniform4f', a, b, c, d)
    }
    uniform3f(prop, a, b, c) {
        this.setUniform(prop, 'uniform3f', a, b, c)
    }
    uniform2f(prop, a, b) {
        this.setUniform(prop, 'uniform2f', a, b)
    }
    uniform1f(prop, a) {
        this.setUniform(prop, 'uniform1f', a)
    }
}