import TankEntity from "./tank.entity.js"
import initEvents from "./events.handler.js"
import { playersKeys, playerTankSprites } from './global-states-storage.js'
import { Quadtree } from "./colitions.js";
import { Rectangle } from "./rectangle.js";

const canvas = document.querySelector("canvas")
const ctx = canvas.getContext('2d')

canvas.width = 806
canvas.height = 806
const squareSize = 13
const players = 3  // Cambiado a 3 tanques
let squareX = canvas.width / squareSize
let squareY = canvas.height / squareSize
let initPositionX = squareX * 4
let initPositionY = squareY * 12

const $sprite = document.querySelector('#sprite')

// Crear tanques usando un bucle
const tanks = [];
for (let i = 1; i <= players; i++) {
    const tankInit = {
        speed: 1,
        life: 3,
        positionX: initPositionX * i,
        positionY: initPositionY,
        keysState: {...playersKeys[i]},  // Usar teclas diferentes para cada jugador
        playerNumber: i,
        initSprite: [
            [4, 8, 52, 52],
            [68, 8, 52, 52],
        ],
        allSprites: playerTankSprites
    };
    tanks.push(new TankEntity(tankInit));
}

function drawSquare() {
    ctx.beginPath()
    for (let i = 0; i <= squareSize; i++) {
        ctx.rect(squareX * i, 0, 1, canvas.height)
        ctx.rect(0, squareY * i, canvas.width, 1)
        ctx.fillStyle = '#fff'
        ctx.fill()
    }
    ctx.closePath()
}

// Crear el quadtree y insertar los tanques
const boundary = new Rectangle(0, 0, canvas.width, canvas.height);
const quadtree = new Quadtree(boundary, 4); // El 4 es solo un ejemplo, puedes ajustarlo según tus necesidades
for (const tank of tanks) {
    quadtree.insert(tank.spacialPoint);
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
const increase = 50;

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

    // Realizar colisiones entre tanques
    for (let i = 0; i < tanks.length - 1; i++) {
        const tank1 = tanks[i];
        const nearbyTanks1 = quadtree.query(tank1.spacialPoint);

        for (let j = i + 1; j < tanks.length; j++) {
            const tank2 = tanks[j];
            const nearbyTanks2 = quadtree.query(tank2.spacialPoint);

            for (const point1 of nearbyTanks1) {
                for (const point2 of nearbyTanks2) {
                    if (point1.intersects(point2)) {
                        console.log(
                            `Colisión entre tanques en dirección ${tank1.direction} y ${tank2.direction}`
                        );
                        tank1.restrictMovement();
                        tank2.restrictMovement();
                    }
                }
            }
        }
    }
}

// Inicializar eventos para cada tanque
const initPromises = tanks.map(tank => initEvents(tank));
Promise.all(initPromises).then(() => {
    init();
});
