import TankEntity from "./tank.entity.js"
import initEvents from "./events.handler.js"
import {keysPlayer1, keysPlayer2, playerTankSprites, enemyTank} from './global-states-storage.js'
import {tankMovement} from './move.accion.js'

const canvas = document.querySelector("canvas")
const ctx = canvas.getContext('2d')

canvas.width = 800
canvas.height = 800
const squareSize = 13
const playes = 2
let squareX = canvas.width / squareSize
let squareY = canvas.height / squareSize
let initPositionX = squareX * 4
let initPositionY = squareY * 12

const $sprite = document.querySelector('#sprite')
const player1Init = {
    speed: 1,
    life: 3,
    positionX: initPositionX,
    positionY: initPositionY,
    keysState: {...keysPlayer1},
    playerNumber: 1,
    initSprite: [
        [4, 8, 52, 52], 
        [68, 8, 52, 52],
    ],
    allSprites: playerTankSprites
}
const player2Init = {
    speed: 1,
    life: 3,
    positionX: initPositionX * 2,
    positionY: initPositionY,
    keysState: {...keysPlayer2},
    playerNumber: 1,
    initSprite: [
        [524, 264, 52, 60],
        [588, 264, 52, 60],
    ],
    allSprites: enemyTank
}


const tank = new TankEntity(player1Init)
const tank2 = new TankEntity(player2Init)
const playesTank = [tank, tank2]

function drawSquare(){
    ctx.beginPath()
    for (let i = 0; i <= squareSize; i++){
        ctx.rect(squareX * i, 0, 1, canvas.height)
        ctx.rect(0 ,squareY * i , canvas.width, 1)
        ctx.fillStyle = '#fff'
        ctx.fill()
    }
    ctx.closePath()
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

function init(){
    window.requestAnimationFrame(init)
    const msNow = window.performance.now()
    const msPassed = msNow - msPrev

    if (msPassed < msPerFrame) return

    const excessTime = msPassed % msPerFrame
    msPrev = msNow - excessTime

    frames++

    if (msFPSPrev < msNow)
    {
      msFPSPrev = window.performance.now() + 1000
      framesPerSec = frames;
      frames = 0;
    }


    cleanCanvas()
   
    //drawSquare()
    tank.tankMovement(canvas.width, canvas.height, ctx, $sprite)
    tank2.tankMovement(canvas.width, canvas.height, ctx, $sprite)
}


Promise.all([initEvents(tank), initEvents(tank2)]).then(() => {
    init();
  });