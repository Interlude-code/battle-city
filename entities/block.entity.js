import {Rectangle} from "../utils/rectangle.js";

class BlockEntity {
    constructor(blockInit) {
        this.sizeX = 62
        this.sizeY = 62
        this.sprite = blockInit.initSprite
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