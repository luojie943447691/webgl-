window.onload = () => {
    // 获取 canvas 元素
    const canvas = document.querySelector('#canvas')
    console.dir(canvas);
    // 获取 webgl 绘图上下文
    const gl = getWebGLContext(canvas, true)

    if (!gl) {
        return console.error("不支持");
    }

    // 是否被按下
    let isPress = false

    // 顶点着色器
    const VSHADER_SOURCE = (
        ` 
            attribute vec4 a_Position;
            void main(){ 
                gl_Position = a_Position;
                gl_PointSize = 10.0;
            }
        `
    )

    // 片元着色器 
    // precision mediump float; 精度限定词
    const FSHADER_SOURCE = (
        `
            precision mediump float;
            uniform vec4 u_FragColor;
            void main(){
                gl_FragColor = u_FragColor;
            }
        `
    )

    // 初始化着色器
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log("着色器加载失败!");
        return;
    }

    // 获取 attribute 变量的 存储位置 不存在返回 -1
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position')
    //  不存在 返回 null
    var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor')
    if (a_Position < 0 || !u_FragColor) {
        return console.error(`需要查询的变量不存在！`);
    }

    // canvas.onclick = (e) => click(e, gl, canvas, a_Position)

    canvas.onmousedown = ()=>{
        isPress = true
    }
    canvas.onmouseup = () => {
        isPress = false
    }

    canvas.onmousemove = (e) => {
        click(e, gl, canvas, a_Position,isPress,u_FragColor)
    }

    // 设置背景颜色
    gl.clearColor(0, 0, 0, 1)
    // 清空颜色缓冲区
    gl.clear(gl.COLOR_BUFFER_BIT)
}
// 我们为什么需要记录每次鼠标的位置呢？ 书 P53
// 因为如图 2.10 所示，绘制操作的时候，是读取的颜色缓冲区中进行绘制的，每次绘制结束后，
// 颜色缓冲区都会被清空，而不会记录上一次绘制的数据
var g_points = []
var g_colors = []
function click(e, gl, canvas, a_Position,isPress,u_FragColor) {
    if(!isPress) return;
    // 获取坐标
    const x = (e.clientX - canvas.width / 2) / (canvas.width / 2)
    const y = - (e.clientY - canvas.height / 2) / (canvas.height / 2)
    // console.log(y);
    g_points.push([x, y])
    // 第一象限 红色 
    if(x > 0 && y > 0){
        g_colors.push([1.0,0.0,0.0,0.5])
    }
    else{
        g_colors.push([0.0,0.0,0.0,0.5])
    }
    // 清除 canvas 原本的颜色，由于每次绘制完成之后，颜色缓冲区都会被清空，
    //    我们需要重新设置背景
    gl.clear(gl.COLOR_BUFFER_BIT)
    for (let i = 0; i < g_points.length; i++) {
        gl.vertexAttrib2f(a_Position, g_points[i][0], g_points[i][1])
        gl.uniform4f(u_FragColor,g_colors[i][0],g_colors[i][1],g_colors[i][2],g_colors[i][3])
        // 画点
        gl.drawArrays(gl.POINTS, 0, 1)
    }
}
