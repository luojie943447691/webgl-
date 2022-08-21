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
            uniform float u_SinB,u_CosB;
            void main(){ 
                gl_Position.x = a_Position.x * u_CosB - a_Position.y * u_SinB;
                gl_Position.y = a_Position.x * u_SinB + a_Position.y * u_CosB;
                gl_Position.z = a_Position.z;
                gl_Position.w = 1.0;
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
    // 获取 u_SinB 和 u_CosB
    const u_SinB = gl.getUniformLocation(gl.program,"u_SinB")
    const u_CosB = gl.getUniformLocation(gl.program,"u_CosB")

    // 赋值
    gl.uniform1f(u_SinB,sinValue)
    gl.uniform1f(u_CosB,cosValue)

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
        -0.5,-0.5, 
        
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
    gl.vertexAttribPointer(a_Position,2,gl.FLOAT,false,0,0)

    // 连接a_Position变量与分配分配给他的缓冲区对象
    gl.enableVertexAttribArray(a_Position)

    return n
}

