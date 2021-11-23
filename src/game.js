// Author: Eric Delmonico
//
// game.js contains the main gameloop for the game.

import { Rect } from "./drawing.js";
import { Unit } from "./entities.js";

// Asset imports
import * as assets from "./assets.js";

// Handles user input for this game.
import * as input from "./input.js";
import { Keys } from "./input.js";

let ctx;
let canvas;
let clearColor = "#EEE";

// Pixel width of the world
let worldWidth = 1200;
// Pixel width of the camera
let cameraWidth;
// Pixel position of the camera in the world
let cameraPos = 0;
// Movement speed of the camera in pixels per second
let cameraMoveSpeed = 500;

// List of entities in the scene -- TODO: make scene class
let entities;

function update(dt) {
    // Update the camera
    if (input.getKeyDown(Keys.RIGHT)) {
        cameraPos += cameraMoveSpeed * dt;
    }
    if (input.getKeyDown(Keys.LEFT)) {
        cameraPos -= cameraMoveSpeed * dt;
    }

    // Update all entities
    for (let e of entities) {
        e.update(dt);
    }
}

function draw(dt) {
    for (let e of entities) {
        e.draw(ctx, dt);
    }
}



//
// BOILERPLATE METHODS BELOW
//

// Take care of initializing canvas and grabbing the context
window.onload = init;

function init() {
    canvas = document.querySelector("#mycanvas");
    ctx = canvas.getContext("2d");
    cameraWidth = canvas.width;

    // initialize the input class
    input.init();

    // load all image assets
    assets.loadAll();

    // init all the entities in the game:
    entities = [
        new Unit(assets.getAnimation("friendlyWalk"), new Rect(0, 0, 75, 150)),
        new Unit(assets.getAnimation("enemyWalk"), new Rect(worldWidth - 75, 0, 75, 150)),
    ];

    gameLoop();
}

// Gameloop will probably never need to be touched.
// It should always do just these things.
// It takes care of calculating dt, and
// running the update and draw loops.
let prevFrameTimeStamp;

function gameLoop(timestamp) {
    // Dt is time passed since last frame in seconds
    let dt = 0;
    dt = (timestamp - prevFrameTimeStamp) / 1000;

    if (isNaN(dt)) dt = 0;

    // Clear, then update, then draw (like a typical game engine)
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = clearColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    update(dt);

    // Make sure camera position is on-screen
    if (cameraPos < 0) {
        cameraPos = 0;
    }

    if (cameraPos > worldWidth - cameraWidth) {
        cameraPos = worldWidth - cameraWidth;
    }

    // Modify draw position based on camera position
    ctx.save();
    ctx.translate(-cameraPos, 0);
    draw(dt);
    ctx.restore();

    prevFrameTimeStamp = timestamp;
    window.requestAnimationFrame(gameLoop);
}