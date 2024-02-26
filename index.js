import TankEntity from "./entities/tank.entity.js"
import initEvents from "./global/events/events.handler.js"
import { drawSquare} from './utils/draw-squeare.function.js'
import {enemyTank, playersKeys, playerTankSprites} from './global/constants/constants.js'
import { Quadtree } from "./global/collitions/colitions.js";
import { Rectangle } from "./utils/rectangle.js";
import BlockEntity from "./entities/block.entity.js";

const canvas = document.querySelector("canvas")
const ctx = canvas.getContext('2d')

canvas.width = 806
canvas.height = 806

const squareSize = 13
const players = 3
let squareX = canvas.width / squareSize
let squareY = canvas.height / squareSize
let initPositionX = squareX * 4
let initPositionY = squareY * 12

const $sprite = document.querySelector('#sprite')

// Crear tanques usando un bucle
const tanks = [];
const blocks = [];
const player1Init = {
    speed: 1,
    life: 3,
    positionX: initPositionX,
    positionY: initPositionY,
    keysState: {...playersKeys[1]},
    playerNumber: 1,
    initSprite: [
        [4, 4, 52, 52],
        [68, 4, 52, 52],
    ],
    allSprites: playerTankSprites
}
const player2Init = {
    speed: 1,
    life: 3,
    positionX: initPositionX * 2,
    positionY: initPositionY,
    keysState: {...playersKeys[2]},
    playerNumber: 1,
    initSprite: [
        [524, 264, 52, 60],
        [588, 264, 52, 60],
    ],
    allSprites: enemyTank
}
const blockInit = {
    positionX: squareX * 6,
    positionY: squareY * 6,
    initSprite: [1116, 128, 60, 62]
}
const blockInit2 = {
    positionX: squareX * 5,
    positionY: squareY * 6,
    initSprite: [1116, 128, 60, 62]
}
const blockInit3 = {
    positionX: squareX * 5,
    positionY: squareY * 7,
    initSprite: [1054, 2, 60, 62]
}
const blockInit4 = {
    positionX: squareX * 6,
    positionY: squareY * 7,
    initSprite: [1054, 2, 60, 62]
}
blocks.push(new BlockEntity(blockInit));
blocks.push(new BlockEntity(blockInit2));
blocks.push(new BlockEntity(blockInit3));
blocks.push(new BlockEntity(blockInit4));
tanks.push(new TankEntity(player1Init));
tanks.push(new TankEntity(player2Init));



// Crear el quadtree y insertar los tanques
const boundary = new Rectangle(0, 0, canvas.width, canvas.height);
const quadtree = new Quadtree(boundary, 4); // El 4 es solo un ejemplo, puedes ajustarlo según tus necesidades
for (const tank of tanks) {
    quadtree.insert(tank.spacialPoint);
}
for (const block of blocks) {
    quadtree.insert(block.spacialPoint);
}

function cleanCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
}

const fps = 144

let msPrev = window.performance.now()
let msFPSPrev = window.performance.now() + 1000;
const msPerFrame = 1000 / fps
let frames = 0
let framesPerSec = fps;

function init() {
    window.requestAnimationFrame(init)
    cleanCanvas()
    const msNow = window.performance.now()
    const msPassed = msNow - msPrev

    if (msPassed < msPerFrame) return

    const excessTime = msPassed % msPerFrame
    msPrev = msNow - excessTime

    frames++

    if (msFPSPrev < msNow) {
        msFPSPrev = window.performance.now() + 1000
        framesPerSec = frames;
        frames = 0;
    }

    for (const tank of tanks) {
        tank.tankMovement(canvas.width, canvas.height, ctx, $sprite)
    }
    for (const block of blocks) {
        block.drawBlock(ctx, $sprite)
    }

    // Realizar colisiones entre tanques
    for (let i = 0; i < tanks.length - 1; i++) {
        const tank1 = tanks[i];
        const nearbyTanks1 = quadtree.query(tank1.spacialPoint);

        for (let j = i + 1; j < tanks.length; j++) {
            const tank2 = tanks[j];
            const nearbyTanks2 = quadtree.query(tank2.spacialPoint);
            console.log(nearbyTanks1[0])
            console.log(nearbyTanks1[1])
            for (const point1 of nearbyTanks1) {
                for (const point2 of nearbyTanks2) {
                    if (point1.intersects(point2)) {
                        tank1.restrictMovement();
                        tank2.restrictMovement();
                    }
                }
            }
        }
    }
    //drawSquare(ctx, canvas, 13)
}

const initPromises = tanks.map(tank => initEvents(tank));
Promise.all(initPromises).then(() => {
    init();
});
