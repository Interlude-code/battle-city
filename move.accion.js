import { playerTankSprites, positionToNumber } from "./global-states-storage.js";

function updateSprite(tank, direction) {
    tank.move++;
    if (tank.move % 20 === 0) tank.isMoving = !tank.isMoving;
    const directionIndex = positionToNumber[direction];
    const isMovingIndex = Number(tank.isMoving);
    tank.positionSprite[isMovingIndex][0] = playerTankSprites[directionIndex][isMovingIndex][0];
    tank.positionSprite[isMovingIndex][1] = playerTankSprites[directionIndex][isMovingIndex][1];
    tank.positionSprite[isMovingIndex][2] = playerTankSprites[directionIndex][isMovingIndex][2];
    tank.positionSprite[isMovingIndex][3] = playerTankSprites[directionIndex][isMovingIndex][3];
}

export function tankMovement(tank, canvasWidth, canvasHeight, ctx, $sprite) {
    const { sizeY, sizeX, speed, positionX, positionY } = tank;
    const [upKey, downKey, leftKey, rightKey] = Object.keys(tank.keysState);

    if (tank.keysState[rightKey] && positionX < canvasWidth - sizeY) {
        tank.positionX += speed;
        updateSprite(tank, 'rightKey');
    } else if (tank.keysState[leftKey] && positionX > 0) {
        tank.positionX -= speed;
        updateSprite(tank, 'leftKey');
    } else if (tank.keysState[upKey] && positionY > 0) {
        tank.positionY -= speed;
        updateSprite(tank, 'upKey');
    } else if (tank.keysState[downKey] && positionY < canvasHeight - sizeX) {
        tank.positionY += speed;
        updateSprite(tank, 'downKey');
    }

    ctx.drawImage(
        $sprite,
        tank.positionSprite[Number(tank.isMoving)][0],
        tank.positionSprite[Number(tank.isMoving)][1],
        tank.positionSprite[Number(tank.isMoving)][2],
        tank.positionSprite[Number(tank.isMoving)][3],
        tank.positionX,
        tank.positionY,
        tank.sizeX,
        tank.sizeY
    );

    if (tank.move === 1000) tank.move = 0;
    ctx.closePath();
}