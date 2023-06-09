import BufferGeometry from "../core/BufferGeometry";

export default class BoxGeometry extends BufferGeometry {
    constructor() {
        super()
        this.indices = []
        this.vertices = []
        this.normals = []
        this.uvs = []
        this.init()
    }
    init() {
        //    v6----- v7
        //   /|      /|
        //  v3------v2|
        //  | |     | |
        //  | |v5---|-|v4
        //  |/      |/
        //  v0------v1
        const vertices = [
            [-1, -1, 1], //v0
            [1, -1, 1], //v1
            [1, 1, 1], //v2
            [-1, 1, 1], //v3
            [1, -1, -1], //v4
            [-1, -1, -1], //v5
            [-1, 1, -1], //v6
            [1, 1, -1], //v7
        ]

        _buildPlane.call(this, vertices[0], vertices[1], vertices[2], vertices[3]) //前
        _buildPlane.call(this, vertices[1], vertices[4], vertices[7], vertices[2]) //右
        _buildPlane.call(this, vertices[4], vertices[5], vertices[6], vertices[7]) //后
        _buildPlane.call(this, vertices[5], vertices[0], vertices[3], vertices[6]) //左
        _buildPlane.call(this, vertices[3], vertices[2], vertices[7], vertices[6]) //上
        _buildPlane.call(this, vertices[5], vertices[4], vertices[1], vertices[0]) //下
        
        function _buildPlane(v1, v2, v3, v4, normal) {
            this.vertices.push(...v1)
            this.vertices.push(...v2)
            this.vertices.push(...v3)
            this.vertices.push(...v1)
            this.vertices.push(...v3)
            this.vertices.push(...v4)

            this.normals.push(...normal)

            this.uvs.push(0, 0)
            this.uvs.push(1, 0)
            this.uvs.push(1, 1)
            this.uvs.push(0, 0)
            this.uvs.push(1, 1)
            this.uvs.push(0, 1)
        }
    }
}