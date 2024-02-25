import {positionToNumber} from './global-states-storage.js';
import {Rectangle} from "./rectangle.js";

class TankEntity {

    sizeX = 62
    sizeY = 62
    collisionSizeX = 15.5
    collisionSizeY = 15.5
    isMoving = false
    spriteState
    allSprites
    playerNumber
    keyPressed
    keysState
    positionX
    positionY
    speed
    life
    moves = 0

    constructor(playerInit) {
        const increase = 50;
        this.speed = playerInit.speed
        this.life = playerInit.life
        this.positionX = playerInit.positionX
        this.positionY = playerInit.positionY
        this.keysState = playerInit.keysState
        this.playerNumber = playerInit.playerNumber
        this.spriteState = playerInit.initSprite
        this.allSprites = playerInit.allSprites
        this.spacialPoint = new Rectangle(
            this.positionX - this.sizeX / 2,
            this.positionY - this.sizeY / 2,
            this.sizeX,
            this.sizeY
        )

    }

    updateSprite(direction) {
        this.moves++;
        if (this.moves % 20 === 0) this.isMoving = !this.isMoving;
        const directionIndex = positionToNumber[direction];
        const isMovingIndex = Number(this.isMoving);
        this.spriteState[isMovingIndex][0] = this.allSprites[directionIndex][isMovingIndex][0];
        this.spriteState[isMovingIndex][1] = this.allSprites[directionIndex][isMovingIndex][1];
        this.spriteState[isMovingIndex][2] = this.allSprites[directionIndex][isMovingIndex][2];
        this.spriteState[isMovingIndex][3] = this.allSprites[directionIndex][isMovingIndex][3];
    }

    tankMovement(canvasWidth, canvasHeight, ctx, $sprite) {
        const [upKey, downKey, leftKey, rightKey] = Object.keys(this.keysState);
        ctx.beginPath();
        if (this.keysState[rightKey] && this.positionX < canvasWidth) {
            this.positionX += this.speed;
            this.spacialPoint.x = this.positionX;
            this.updateSprite('rightKey');
        } else if (this.keysState[leftKey] && this.positionX > 0) {
            this.positionX -= this.speed;
            this.spacialPoint.x = this.positionX;
            this.updateSprite('leftKey');
        } else if (this.keysState[upKey] && this.positionY > 0) {
            this.positionY -= this.speed;
            this.spacialPoint.y = this.positionY;
            this.updateSprite('upKey');
        } else if (this.keysState[downKey] && this.positionY < canvasHeight) {
            this.positionY += this.speed;
            this.spacialPoint.y = this.positionY;
            this.updateSprite('downKey');
        }
        ctx.drawImage(
            $sprite,
            this.spriteState[Number(this.isMoving)][0],
            this.spriteState[Number(this.isMoving)][1],
            this.spriteState[Number(this.isMoving)][2],
            this.spriteState[Number(this.isMoving)][3],
            this.positionX,
            this.positionY,
            1,
            1
        );

        if (this.moves === 1000) this.moves = 0;
        ctx.closePath();
    }

}

export default TankEntity