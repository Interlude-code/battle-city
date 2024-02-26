export function drawSquare(ctx, canvas, squareSize) {
    const squareX = canvas.width / squareSize
    const squareY = canvas.height / squareSize
    ctx.beginPath()
    for (let i = 0; i <= squareSize; i++) {
        ctx.rect(squareX * i, 0, 1, canvas.height)
        ctx.rect(0, squareY * i, canvas.width, 1)
        ctx.fillStyle = '#fff'
        ctx.fill()
    }
    ctx.closePath()
}