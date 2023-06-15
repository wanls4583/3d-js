import Material from "./Material.js";

const defaultVertexShader = `
//VERTEX_HEADER_START
attribute vec4 position;
attribute vec2 uv;
uniform mat4 projectMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
varying vec2 vUv;
//VERTEX_HEADER_END
void main() {
    //VERTEX_MAIN_START
    gl_Position = projectMatrix * viewMatrix * modelMatrix * position;
    vUv = uv;
    //VERTEX_MAIN_END
}
`

const defaultFragmentShader = `
precision mediump float;
//FRAGMENT_HEADER_START
uniform bool useTexture;
uniform sampler2D texture;
uniform vec4 color;
varying vec2 vUv;
//FRAGMENT_HEADER_END
void main() {
    //FRAGMENT_MAIN_START
    if(useTexture) {
        gl_FragColor = texture2D(texture, vUv);
    } else {
        gl_FragColor = color;
    }
    //FRAGMENT_MAIN_END
}
`

export default class MeshBasicMaterial extends Material {
    constructor() {
        super(defaultVertexShader, defaultFragmentShader)

        this.uniforms.color = {
            data: [1, 0, 0, 1],
            type: 'uniform4f'
        }
    }
}