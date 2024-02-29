import {positionToNumber} from '../global/constants/constants.js';
import {Rectangle} from "./rectangle.entity.ts";

class TankEntity {
    sizeX: number;
    sizeY: number;
    moves: number;
    direction: string;
    restringedDirection: string;
    isMoving: boolean;
    isCollisioned: boolean;
    isMovingSprite: boolean;
    mapSizeX: number;
    mapSizeY: number;
    speed: number;
    life: number;
    keysState: any;
    playerNumber: number;
    $sprite: any;
    spriteState: any;
    tankSprites: any;
    spacialPoint: Rectangle;

    constructor(playerInit) {
        this.sizeX = 62
        this.sizeY = 62
        this.moves = 0
        this.direction = 'up'
        this.restringedDirection = 'none'
        this.isMoving = false
        this.isCollisioned = false
        this.isMovingSprite = false
        this.mapSizeX = playerInit.mapSizeX
        this.mapSizeY = playerInit.mapSizeY
        this.speed = playerInit.speed
        this.life = playerInit.life
        this.keysState = playerInit.keysState
        this.playerNumber = playerInit.playerNumber
        this.$sprite = playerInit.$sprite
        this.spriteState = playerInit.initSprite
        this.tankSprites = playerInit.tankSprites
        this.spacialPoint = new Rectangle(
            playerInit.positionX,
            playerInit.positionY,
            this.sizeX,
            this.sizeY
        )
    }

    init(ctx) {
        this.tankMovement()
        this.drawTank(ctx)
    }

    captureKeysState(key, isKeyDown) {
        this.keysState[key] = isKeyDown;

        const [upKey, downKey, leftKey, rightKey] = Object.keys(this.keysState);
        if (this.keysState[rightKey]) {
            this.direction = 'right'
            this.isMoving = true
        } else if (this.keysState[leftKey]) {
            this.direction = 'left'
            this.isMoving = true
        } else if (this.keysState[upKey]) {
            this.direction = 'up'
            this.isMoving = true
        } else if (this.keysState[downKey]) {
            this.direction = 'down'
            this.isMoving = true
        } else if (
            !this.keysState[rightKey] &&
            !this.keysState[leftKey] &&
            !this.keysState[upKey] &&
            !this.keysState[downKey]) {

            this.isMoving = false
        }

    }

    drawTank(ctx) {
        this.moves++;
        if (this.moves % 20 === 0) this.isMovingSprite = !this.isMovingSprite;
        const directionIndex = positionToNumber[this.direction];
        const isMovingIndex = Number(this.isMovingSprite);

        this.spriteState[isMovingIndex][0] = this.tankSprites[directionIndex][isMovingIndex][0];
        this.spriteState[isMovingIndex][1] = this.tankSprites[directionIndex][isMovingIndex][1];
        this.spriteState[isMovingIndex][2] = this.tankSprites[directionIndex][isMovingIndex][2];
        this.spriteState[isMovingIndex][3] = this.tankSprites[directionIndex][isMovingIndex][3];
        ctx.drawImage(
            this.$sprite,
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

    tankMovement() {

        if (this.direction === "right" && this.isMoving && this.spacialPoint.x < this.mapSizeX - this.sizeX && this.restringedDirection !== 'right' && !this.isCollisioned) {
            this.spacialPoint.x += this.speed;
        } else if (this.direction === "left" && this.isMoving && this.spacialPoint.x > 0 && this.restringedDirection !== 'left' && !this.isCollisioned) {
            this.spacialPoint.x -= this.speed;
        } else if (this.direction === "up" && this.isMoving && this.spacialPoint.y > 0 && this.restringedDirection !== 'up' && !this.isCollisioned) {
            this.spacialPoint.y -= this.speed;
        } else if (this.direction === "down" && this.isMoving && this.spacialPoint.y < this.mapSizeY - this.sizeY && this.restringedDirection !== 'down' && !this.isCollisioned) {
            this.spacialPoint.y += this.speed;
        } else if (!this.isMoving) {
            this.isMoving = false
        }

    }

    restrictMovement() {
        this.isCollisioned = true
        if (this.isMoving) {
            this.restringedDirection = this.direction;
            if (this.restringedDirection === 'right') this.spacialPoint.x -= 1;
            else if (this.restringedDirection === 'left') this.spacialPoint.x += 1;
            else if (this.restringedDirection === 'up') this.spacialPoint.y += 1;
            else if (this.restringedDirection === 'down') this.spacialPoint.y -= 1;
        }

    }

}

export default TankEntity