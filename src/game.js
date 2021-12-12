// Author: Eric Delmonico
//
// game.js contains the main gameloop for the game.

// Need to make the game scene here
import { Scene } from "./scene.js";

// Asset imports
import * as assets from "./assets.js";

// Handles user input for this game.
import * as input from "./input.js";

let ctx;
let canvas;
let clearColor = "#FFF";

// Current scene
let gameScene;

// Take care of initializing canvas and grabbing the context
window.onload = init;

function init() {
    canvas = document.querySelector("#mycanvas");
    ctx = canvas.getContext("2d");

    // initialize the input class
    input.init();

    // load all image assets
    assets.loadAll();

    // Once the assets are loaded, create scene and kick off the game loop
    document.addEventListener("assetsLoaded", () => {
        gameScene = new Scene(canvas.width, canvas.height);
        gameLoop();
    });
}

// Gameloop will probably never need to be touched.
// It should always do just these things.
// It takes care of calculating dt, and
// running the current scene's update and draw loops.
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

    gameScene.update(dt);

    // Modify draw position based on camera position
    ctx.save();
    gameScene.draw(ctx, dt);
    ctx.restore();

    prevFrameTimeStamp = timestamp;
    window.requestAnimationFrame(gameLoop);
}