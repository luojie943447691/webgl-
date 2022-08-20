window.onload = () => {
    // 获取 canvas 元素
    const canvas = document.querySelector('#canvas')
    // 获取画笔
    const ctx = canvas.getContext('2d')

    // 设置画笔颜色
    ctx.fillStyle = 'rgba(0, 0, 255, 0.5)'
    // 填充矩形
    ctx.fillRect(120, 10, 150, 150)
}