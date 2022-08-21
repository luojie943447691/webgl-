window.onload = () => {
    // 获取 canvas 元素
    const canvas = document.querySelector('#canvas')
    // 获取 webgl 绘图上下文
    const gl = getWebGLContext(canvas, true)

    if (!gl) {
        return console.error("不支持");
    }

    // 顶点着色器
    const VSHADER_SOURCE = (
        ` 
            // x' = x*CosB - y*SinB
            // y' = x*SinB + y*CosB
            // z' = z
            attribute vec4 a_Position;
            uniform mat4 u_xformMatix;
            uniform mat4 u_translationMatix;
            uniform mat4 u_scaleMatix;
            void main(){ 
                gl_Position = u_xformMatix * a_Position;
                gl_Position = u_translationMatix * gl_Position;
                gl_Position = u_scaleMatix * gl_Position;
            }
        `
    )

    // 片元着色器
    const FSHADER_SOURCE = (
        `void main(){
            gl_FragColor = vec4(0,0.5,0,1.0);
        }`
    )

    // 初始化着色器
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log("着色器加载失败!");
        return;
    }

    // 设置顶点信息
    const n = initVertexBuffers(gl)

    // 旋转
    // 旋转角度 
    const angle = 30
    const radian = Math.PI * angle / 180
    const sinValue = Math.sin(radian)
    const cosValue = Math.cos(radian)
    // 获取 u_xformMatix 和 u_translationMatix
    const u_xformMatix = gl.getUniformLocation(gl.program, "u_xformMatix")
    const u_translationMatix = gl.getUniformLocation(gl.program, "u_translationMatix")
    const u_scaleMatix = gl.getUniformLocation(gl.program, "u_scaleMatix")

    // 注意，WebGL 中，矩阵是列主序的
    const rotateMatrix = new Float32Array([
        cosValue, sinValue, 0, 0,
        -sinValue, cosValue, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ])

    // 赋值
    gl.uniformMatrix4fv(u_xformMatix, false,rotateMatrix)

    // 平移 
    const Tx = 0.2;
    const Ty = 0.2;
    const Tz = 0;

    const translationMattix = new Float32Array([
        1,0,0,0,
        0,1,0,0,
        0,0,1,0,
        Tx,Ty,Tz,1
    ]) 

    // 赋值
    gl.uniformMatrix4fv(u_translationMatix, false,translationMattix)

    // 缩放 
    const scaleMattix = new Float32Array([
        0.5,0,0,0,
        0,0.5,0,0,
        0,0,0.5,0,
        0,0,0,1
    ]) 

    // 赋值
    gl.uniformMatrix4fv(u_scaleMatix, false,scaleMattix)

    if (n < 0) {
        return console.log("没事设置顶点信息");
    }

    // 设置背景颜色
    gl.clearColor(0, 0, 0, 1)
    // 清空颜色缓冲区
    gl.clear(gl.COLOR_BUFFER_BIT)

    // 绘制  线
    // gl.drawArrays(gl.TRIANGLE_STRIP, 0, n)
    gl.drawArrays(gl.TRIANGLE_FAN, 0, n)
}


// 设置顶点信息
function initVertexBuffers(gl) {
    const vertices = new Float32Array([
        0.5, 0.5,
        0.5, -0.5,
        -0.5, -0.5,

        -0.5, 0.5,
    ])

    const n = 4 // 点的个数
    // 创建缓冲对象 
    const vertexBuffer = gl.createBuffer()
    if (!vertexBuffer) {
        console.log("创建buffer对象失败！");
        return -1
    }
    // 将缓冲区对象绑定到目标上 
    // gl.ARRAY_BUFFER 表示向顶点写数据
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    // 向缓冲区对象写入数据
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

    const a_Position = gl.getAttribLocation(gl.program, "a_Position");
    if (a_Position < 0) {
        console.error(`需要查询的变量不存在！`);
        return -1
    }

    // 将缓冲区对象分配给 a_Position
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0)

    // 连接a_Position变量与分配分配给他的缓冲区对象
    gl.enableVertexAttribArray(a_Position)

    return n
}

