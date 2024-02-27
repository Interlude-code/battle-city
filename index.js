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
    speed: 3,
    life: 3,
    positionX: initPositionX,
    positionY: initPositionY,
    keysState: {...playersKeys[1]},
    playerNumber: 1,
    initSprite: [
        [4, 7, 52, 52],
        [68, 4, 52, 52],
    ],
    allSprites: playerTankSprites
}
const player2Init = {
    speed: 3,
    life: 3,
    positionX: initPositionX * 2,
    positionY: initPositionY,
    keysState: {...playersKeys[2]},
    playerNumber: 2,
    initSprite: [
        [524, 264, 52, 60],
        [588, 264, 52, 60],
    ],
    allSprites: enemyTank
}
const blockInit = {
    positionX: squareX * 6,
    positionY: squareY * 6,
    initSprite: [1116, 128, 60, 62],
    itemNumber: 3,
    haveCollision: false
}
const blockInit2 = {
    positionX: squareX * 5,
    positionY: squareY * 6,
    initSprite: [1116, 128, 60, 62],
    itemNumber: 4,
    haveCollision: false
}
const blockInit3 = {
    positionX: squareX * 5,
    positionY: squareY * 7,
    initSprite: [1054, 2, 60, 62],
    itemNumber: 5,
    haveCollision: true
}
const blockInit4 = {
    positionX: squareX * 6,
    positionY: squareY * 7,
    initSprite: [1054, 2, 60, 62],
    itemNumber: 6,
    haveCollision: true
}
blocks.push(new BlockEntity(blockInit));
blocks.push(new BlockEntity(blockInit2));
blocks.push(new BlockEntity(blockInit3));
blocks.push(new BlockEntity(blockInit4));
tanks.push(new TankEntity(player1Init));
tanks.push(new TankEntity(player2Init));
const allItems = [
    ...tanks,
    ...blocks
]



// Crear el quadtree y insertar los tanques
const boundary = new Rectangle(0, 0, canvas.width, canvas.height);
const quadtree = new Quadtree(boundary, 4, ctx); // El 4 es solo un ejemplo, puedes ajustarlo según tus necesidades
for (const tank of tanks) {
    quadtree.insert(tank.spacialPoint, tank.playerNumber);
}
for (const block of blocks) {
    if (block.haveCollision){
        quadtree.insert(block.spacialPoint, block.itemNumber);
    }
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

    cleanCanvas()
    for (const tank of tanks) {
        tank.tankMovement(canvas.width, canvas.height, ctx, $sprite)
    }
    for (const block of blocks) {
        block.drawBlock(ctx, $sprite)
    }

    const tanksCollisions = tanks.map(tank => quadtree.query(tank.spacialPoint))
    tanksCollisions.forEach((tankCollisions, index) => {
        tankCollisions.forEach((item) => {
            if (item.itemNumber !== tanks[index].playerNumber) {
                tanks[index].restrictMovement();
            }
            tanks[index].isCollisioned = false;
        })
    })
/*    const nearbyTanks1 = quadtree.query(tanks[0].spacialPoint);
    nearbyTanks1.forEach((item) => {
        if (item.itemNumber !== tanks[0].playerNumber) {
            const dato = allItems[item.itemNumber - 1]
            console.log('colision', item.itemNumber, dato)
            tanks[0].restrictMovement();
        }
    })*/
    //drawSquare(ctx, canvas, 13)
}

const initPromises = tanks.map(tank => initEvents(tank));
Promise.all(initPromises).then(() => {
    init();
});
