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
            attribute vec4 a_Position;
            attribute float a_PointSize;
            void main(){ 
                gl_Position = a_Position;
                gl_PointSize = a_PointSize;
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

    // 获取 attribute 变量的 存储位置
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position')
    var a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize')
    if (a_Position < 0 || a_PointSize < 0) {
        return console.error(`需要查询的变量不存在！`);
    }


    // 设置点的大小 
    gl.vertexAttrib1f(a_PointSize, 10.0)

    // 设置背景颜色
    gl.clearColor(0, 0, 0, 1)
    // 绘制一个点
    // gl.drawArrays(gl.POINTS, 0, 1)

    let v = 0
    function tick() {
        // 清空颜色缓冲区
        gl.clear(gl.COLOR_BUFFER_BIT)
        v += 0.02
        // 没有带 v 的方法，表示非 vector 变量
        // gl.vertexAttrib4f(a_Position,Math.sin(v),Math.cos(v),0,1.0)
        // 带 v 的方法，表示 vector 变量
        const vec = new Float32Array([Math.sin(v), Math.cos(v), 0, 1.0])
        // 将顶点位置传输给 attribute 变量
        // 存储位置 + 值
        gl.vertexAttrib4fv(a_Position, vec)
        // 绘制一个点
        gl.drawArrays(gl.POINTS, 0, 1)
        requestAnimationFrame(tick)
    }
    tick()
}
