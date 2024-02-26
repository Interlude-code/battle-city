import {positionToNumber} from './global-states-storage.js';
import {Rectangle} from "./rectangle.js";

class TankEntity {
    constructor(playerInit) {
        this.sizeX = 62
        this.sizeY = 62
        this.moves = 0
        this.direction = 'up'
        this.restringedDirection = 'none'
        this.isMoving = false
        this.isMovingSprite = false
        this.speed = playerInit.speed
        this.life = playerInit.life
        this.keysState = playerInit.keysState
        this.playerNumber = playerInit.playerNumber
        this.spriteState = playerInit.initSprite
        this.allSprites = playerInit.allSprites
        this.spacialPoint = new Rectangle(
            playerInit.positionX,
            playerInit.positionY,
            this.sizeX,
            this.sizeY
        )
    }

    updateSprite(direction) {
        this.moves++;
        if (this.moves % 20 === 0) this.isMovingSprite = !this.isMovingSprite;
        const directionIndex = positionToNumber[direction];
        const isMovingIndex = Number(this.isMovingSprite);
        this.spriteState[isMovingIndex][0] = this.allSprites[directionIndex][isMovingIndex][0];
        this.spriteState[isMovingIndex][1] = this.allSprites[directionIndex][isMovingIndex][1];
        this.spriteState[isMovingIndex][2] = this.allSprites[directionIndex][isMovingIndex][2];
        this.spriteState[isMovingIndex][3] = this.allSprites[directionIndex][isMovingIndex][3];
    }

    tankMovement(canvasWidth, canvasHeight, ctx, $sprite) {
        const [upKey, downKey, leftKey, rightKey] = Object.keys(this.keysState);
        if (this.keysState[rightKey] && this.spacialPoint.x < canvasWidth - this.sizeX && this.restringedDirection !== 'right') {
            this.spacialPoint.x += this.speed;
            this.direction = 'right'
            this.isMoving = true
            this.updateSprite('rightKey');
        } else if (this.keysState[leftKey] && this.spacialPoint.x > 0 && this.restringedDirection !== 'left') {
            this.spacialPoint.x -= this.speed;
            this.direction = 'left'
            this.isMoving = true
            this.updateSprite('leftKey');
        } else if (this.keysState[upKey] && this.spacialPoint.y > 0 && this.restringedDirection !== 'up') {
            this.spacialPoint.y -= this.speed;
            this.direction = 'up'
            this.isMoving = true
            this.updateSprite('upKey');
        } else if (this.keysState[downKey] && this.spacialPoint.y < canvasHeight - this.sizeY && this.restringedDirection !== 'down') {
            this.spacialPoint.y += this.speed;
            this.direction = 'down'
            this.isMoving = true
            this.updateSprite('downKey');
        } else if (!this.keysState[rightKey] && !this.keysState[leftKey] && !this.keysState[upKey] && !this.keysState[downKey]) {
            this.isMoving = false
        }
        ctx.drawImage(
            $sprite,
            this.spriteState[Number(this.isMovingSprite)][0],
            this.spriteState[Number(this.isMovingSprite)][1],
            this.spriteState[Number(this.isMovingSprite)][2],
            this.spriteState[Number(this.isMovingSprite)][3],
            this.spacialPoint.x,
            this.spacialPoint.y,
            this.sizeX,
            this.sizeY
        );

        if (this.moves === 1000) this.moves = 0;
        this.restringedDirection = "none"
        ctx.closePath();
    }

    restrictMovement() {
        console.log(this.isMoving)
        if (this.isMoving) {
            this.restringedDirection = this.direction;
            if (this.restringedDirection === 'right') this.spacialPoint.x -= this.speed;
            else if (this.restringedDirection === 'left') this.spacialPoint.x += this.speed;
            else if (this.restringedDirection === 'up') this.spacialPoint.y += this.speed;
            else if (this.restringedDirection === 'down') this.spacialPoint.y -= this.speed;
        }

    }

}

export default TankEntity