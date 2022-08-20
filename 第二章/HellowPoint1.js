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
        ` void main(){ 
            gl_Position = vec4(0.5,0,0.0,1.0);
            gl_PointSize = 10.0;
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

    // 设置背景颜色
    gl.clearColor(0, 0, 0, 1)
    // 清空颜色缓冲区
    gl.clear(gl.COLOR_BUFFER_BIT)
    // 绘制一个点
    gl.drawArrays(gl.POINTS, 0, 1)
}