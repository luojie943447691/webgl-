window.onload = () => {
    // 获取 canvas 元素
    const canvas = document.querySelector('#canvas')
    // 获取 webgl 绘图上下文
    const gl = getWebGLContext(canvas,true)
    const gl1 = canvas.getContext('webgl')

    if(!gl){
        return console.error("不支持");
    }
    
    // 清空 canvas 颜色 
    gl.clearColor(0,0,1,0.5) 
    // gl1.clearColor(0,0,0,1.0)

    // 清空 canvas
    gl.clear(gl.COLOR_BUFFER_BIT)
    // gl1.clear(gl1.COLOR_BUFFER_BIT)
}