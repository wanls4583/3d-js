export function initShaders(gl, vSource, fSource, ifUse = true) {
    const program = gl.createProgram();
    const vertexShader = _loaderShader(gl, gl.VERTEX_SHADER, vSource);
    const fragmentShader = _loaderShader(gl, gl.FRAGMENT_SHADER, fSource);
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (ifUse) {
        gl.useProgram(program);
        gl.program = program;
    }
    return program;

    function _loaderShader(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        return shader;
    }
}

export function createProgram(gl, vSource, fSource) {
    return initShaders(gl, vSource, fSource, false)
}

export function enableVertexAttribArray(gl, prop, vertexs, size) {
    const attr = gl.getAttribLocation(gl.program, prop)
    const vertexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, vertexs, gl.STATIC_DRAW)
    gl.vertexAttribPointer(attr, size, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(attr)
}

export function setUniform(gl, prop, type, arr) {
    const u = gl.getUniformLocation(gl.program, prop)
    gl[type](u, ...arr)
}

export function loadImg(image) {
    return new Promise((resolve) => {
        if (typeof image === 'string') {
            let img = new Image();
            img.src = image;
            img.onload = () => {
                resolve(img);
            }
        } else {
            resolve(image);
        }
    })
}