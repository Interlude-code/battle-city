import {Rectangle} from "./rectangle.entity.ts";

class BlockEntity {

    sizeX: number;
    sizeY: number;
    sprite: any;
    itemNumber: number;
    haveCollision: boolean;
    spacialPoint: Rectangle;

    constructor(blockInit) {
        this.sizeX = 62
        this.sizeY = 62
        this.sprite = blockInit.initSprite
        this.itemNumber = blockInit.itemNumber
        this.haveCollision = blockInit.haveCollision
        this.spacialPoint = new Rectangle(
            blockInit.positionX,
            blockInit.positionY,
            this.sizeX,
            this.sizeY
        )
    }

    drawBlock(ctx, $sprite) {
        ctx.drawImage(
            $sprite,
            this.sprite[0],
            this.sprite[1],
            this.sprite[2],
            this.sprite[3],
            this.spacialPoint.x,
            this.spacialPoint.y,
            this.sizeX,
            this.sizeY
        )
    }
}

export default BlockEntity