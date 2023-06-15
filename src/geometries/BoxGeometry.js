import BufferGeometry from "../core/BufferGeometry.js";

export default class BoxGeometry extends BufferGeometry {
    constructor() {
        super()

        this.attributes.position = {
            data: [],
            size: 3
        }
        this.attributes.normal = {
            data: [],
            size: 3
        }
        this.attributes.uv = {
            data: [],
            size: 2
        }
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
        const position = [
            [-1, -1, 1], //v0
            [1, -1, 1], //v1
            [1, 1, 1], //v2
            [-1, 1, 1], //v3
            [1, -1, -1], //v4
            [-1, -1, -1], //v5
            [-1, 1, -1], //v6
            [1, 1, -1], //v7
        ]

        _buildPlane.call(this, position[0], position[1], position[2], position[3], [0, 0, 1]) //前
        _buildPlane.call(this, position[1], position[4], position[7], position[2], [1, 0, 0]) //右
        _buildPlane.call(this, position[4], position[5], position[6], position[7], [0, 0, -1]) //后
        _buildPlane.call(this, position[5], position[0], position[3], position[6], [-1, 0, 0]) //左
        _buildPlane.call(this, position[3], position[2], position[7], position[6], [0, 1, 0]) //上
        _buildPlane.call(this, position[5], position[4], position[1], position[0], [0, -1, 0]) //下
        
        function _buildPlane(v1, v2, v3, v4, normal) {
            this.attributes.position.data.push(...v1)
            this.attributes.position.data.push(...v2)
            this.attributes.position.data.push(...v3)
            this.attributes.position.data.push(...v1)
            this.attributes.position.data.push(...v3)
            this.attributes.position.data.push(...v4)

            this.attributes.normal.data.push(...normal)

            this.attributes.uv.data.push(0, 0)
            this.attributes.uv.data.push(1, 0)
            this.attributes.uv.data.push(1, 1)
            this.attributes.uv.data.push(0, 0)
            this.attributes.uv.data.push(1, 1)
            this.attributes.uv.data.push(0, 1)
        }
    }
}