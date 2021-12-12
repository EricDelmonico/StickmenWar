// Author: Eric Delmonico
//
// assets.js loads all the image assets and animations for the game

import { Animation } from "./animation.js";

// Array of all Image objects created from files in spriteNames
const sprites = {};

// Array of animations created from files in animationDatas
const animations = {};

let spriteNames = [
    "friendlyBase",
    "enemyBase",
    "enemyArrow",
    "energyBall",
    "friendlyArrow"
];

// Animations! Format is anim name, file name, frame width, frame height, fps, frame y, looping, playbackDirection, frames
let animationDatas = [
    { name: "friendlyWalk", file: "friendlyWalk", frameW: 100, frameH: 200, fps: 10, y: 200, looping: true, playbackDirection: 1, frames: 8 },
    { name: "friendlyIdle", file: "friendlyWalk", frameW: 100, frameH: 200, fps: 4, y: 0, looping: true, playbackDirection: 1, frames: 4 },
    { name: "friendlyWalkRanged", file: "friendlyWalkRanged", frameW: 100, frameH: 200, fps: 10, y: 200, looping: true, playbackDirection: 1, frames: 4 },
    { name: "friendlyIdleRanged", file: "friendlyWalkRanged", frameW: 100, frameH: 200, fps: 4, y: 0, looping: true, playbackDirection: 1, frames: 4 },
    { name: "friendlyAttack", file: "friendlyAttackDie", frameW: 100, frameH: 200, fps: 10, y: 0, looping: true, playbackDirection: 1, frames: 8 },
    { name: "friendlyDeath", file: "friendlyAttackDie", frameW: 100, frameH: 200, fps: 10, y: 200, looping: false, playbackDirection: 1, frames: 8 },
    { name: "enemyWalk", file: "enemyWalk", frameW: 100, frameH: 200, fps: 10, y: 200, looping: true, playbackDirection: -1, frames: 8 },
    { name: "enemyIdle", file: "enemyWalk", frameW: 100, frameH: 200, fps: 4, y: 0, looping: true, playbackDirection: -1, frames: 4 },
    { name: "enemyWalkRanged", file: "enemyWalkRanged", frameW: 100, frameH: 200, fps: 10, y: 200, looping: true, playbackDirection: -1, frames: 4 },
    { name: "enemyIdleRanged", file: "enemyWalkRanged", frameW: 100, frameH: 200, fps: 4, y: 0, looping: true, playbackDirection: -1, frames: 4 },
    { name: "enemyAttack", file: "enemyAttackDie", frameW: 100, frameH: 200, fps: 10, y: 0, looping: true, playbackDirection: -1, frames: 8 },
    { name: "enemyDeath", file: "enemyAttackDie", frameW: 100, frameH: 200, fps: 10, y: 200, looping: false, playbackDirection: -1, frames: 8 }
];

//
// Helper functions for loading and getting animations
//

function loadAll() {
    for (let name of spriteNames) {
        sprites[name] = loadImage(name);
    }
    for (let data of animationDatas) {
        loadAnimation(data);
    }
}

let imagesLoading = animationDatas.length + spriteNames.length;

function loadImage(imageFileName) {
    let img = new Image();
    img.src = `./assets/${imageFileName}.png`;
    img.onload = imageOnLoad;
    return img;
}

function loadAnimation(data) {
    let img = loadImage(data.file);
    img.onload = () => animationOnLoad(data, img);
}

function getAnimation(animationName) {
    let a = animations[animationName];
    return new Animation(a.spriteSheet, a.frameWidth, a.frameHeight, a.fps, a.frameY, a.looping, a.playbackDirection, a.frames);
}

// Decrement imagesLoading and fire assetsLoaded event if all the images loaded
function imageOnLoad() {
    imagesLoading--;
    if (imagesLoading <= 0) {
        let assetsLoaded = new Event("assetsLoaded");
        document.dispatchEvent(assetsLoaded);
    }
}

// Create a new animation, then call imageOnLoad
function animationOnLoad(data, img) {
    animations[data.name] = new Animation(img, data.frameW, data.frameH, data.fps, data.y, data.looping, data.playbackDirection, data.frames);
    imageOnLoad();
}

export { loadAll, sprites, getAnimation }