export default class Shader {
    constructor(gl) {
        this.gl = gl
    }
    createProgram(vSource, fSource) {
        const gl = this.gl
        const program = gl.createProgram()
        const vertexShader = _loaderShader(gl, gl.VERTEX_SHADER, vSource)
        const fragmentShader = _loaderShader(gl, gl.FRAGMENT_SHADER, fSource)
        gl.attachShader(program, vertexShader)
        gl.attachShader(program, fragmentShader)
        gl.linkProgram(program)

        let vertexShaderError = gl.getShaderInfoLog(vertexShader)
        let fragmentShaderError = gl.getShaderInfoLog(fragmentShader)

        vertexShaderError && console.error('vertexShader error:\n', vertexShaderError)
        fragmentShaderError && console.error('fragmentShader error:\n', fragmentShaderError)

        return program

        function _loaderShader(gl, type, source) {
            const shader = gl.createShader(type)
            gl.shaderSource(shader, source)
            gl.compileShader(shader)

            return shader
        }
    }
    useProgram(program) {
        this.gl.useProgram(program)
        this.gl.program = program
    }
    setBufferData(vertexs) {
        const gl = this.gl
        const vertexBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, vertexs, gl.STATIC_DRAW)

        return vertexBuffer
    }
    bindBuffer(vertexBuffer) {
        const gl = this.gl
        this.gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    }
    vertexAttribPointer(prop, size, stride = 0, startIndex = 0) {
        const gl = this.gl
        const attr = gl.getAttribLocation(gl.program, prop)
        if(attr > -1) {
            gl.vertexAttribPointer(attr, size, gl.FLOAT, false, stride, startIndex)
            gl.enableVertexAttribArray(attr)
        }
    }
    setAtribute(prop, type) {
        const gl = this.gl
        const u = gl.getAttribLocation(gl.program, prop)
        if(u > -1) {
            const arr = []
            for (let i = 2; i < arguments.length; i++) {
                arr.push(arguments[i])
            }
            gl[type](u, ...arr)
        }
    }
    setUniform(prop, type) {
        const gl = this.gl
        const u = gl.getUniformLocation(gl.program, prop)
        if(u) {
            const arr = []
            for (let i = 2; i < arguments.length; i++) {
                arr.push(arguments[i])
            }
            gl[type](u, ...arr)
        }
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
    uniformMatrix4fv(prop, a) {
        this.setUniform(prop, 'uniformMatrix4fv', false, a)
    }
}