// Author: Eric Delmonico
//
// assets.js loads all the image assets and animations for the game

import { Animation } from "./animation.js";

// Array of all Image objects created from files in spriteNames
const sprites = {};

// Array of animations created from files in animationDatas
const animations = {};

let spriteNames = [

];

// Animations! Format is anim name, file name, frame width, frame height, fps, frame y
let animationDatas = [
    { name: "friendlyWalk", file: "friendlyWalk", frameW: 100, frameH: 200, fps: 10, y: 200 },
    { name: "friendlyAttack", file: "friendlyAttackDie", frameW: 100, frameH: 200, fps: 10, y: 0 },
    { name: "friendlyDie", file: "friendlyAttackDie", frameW: 100, frameH: 200, fps: 10, y: 200 },
    { name: "enemyWalk", file: "enemyWalk", frameW: 100, frameH: 200, fps: 10, y: 400 },
    { name: "enemyAttack", file: "enemyAttackDie", frameW: 100, frameH: 200, fps: 10, y: 0 },
    { name: "enemyDie", file: "enemyAttackDie", frameW: 100, frameH: 200, fps: 10, y: 200 }
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
    img.src = `../assets/${imageFileName}.png`;
    img.onload = imageOnLoad;
    return img;
}

function loadAnimation(data) {
    let img = loadImage(data.file);
    img.onload = () => animationOnLoad(data, img);
}

function getAnimation(animationName) {
    let a = animations[animationName];
    return new Animation(a.spriteSheet, a.frameWidth, a.frameHeight, a.fps, a.frameY);
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
    animations[data.name] = new Animation(img, data.frameW, data.frameH, data.fps, data.y);
    imageOnLoad();
}

export { loadAll, sprites, getAnimation }