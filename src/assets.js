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
let animationDatas;

//
// Helper functions for loading and getting animations
//

let imagesLoading = 0;
function loadAll() {
    const fetchPromise = async (file) => {
        let response = await fetch(file);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        let json = await response.json();
        return json;
    }

    // Load animation data from json data file
    fetchPromise("data/animations.json")
        .then((animData) => {
            animationDatas = animData;
            imagesLoading = animationDatas.length + spriteNames.length;

            for (let name of spriteNames) {
                sprites[name] = loadImage(name);
            }
            for (let data of animationDatas) {
                loadAnimation(data);
            }
        }).catch(e => console.log(`In catch with e=${e}`));
}

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