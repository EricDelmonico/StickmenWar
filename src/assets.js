// Author: Eric Delmonico
//
// assets.js loads all the image assets and animations for the game

import * as drawing from "./drawing.js";
import { Rect } from "./drawing.js";

// Holds an animation
export class Animation {
    constructor(spriteSheet, frameWidth, frameHeight, fps, frameY = 0) {
        this.spriteSheet = spriteSheet;
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
        this.frameY = frameY;

        this.currentFrame = 0;
        this.currentSeconds = 0;
        this.maxSeconds = 1 / fps;
        this.maxFrame = spriteSheet.width / frameWidth;
    }

    update(dt) {
        this.currentSeconds += dt;

        // Move animation a frame if needed
        if (this.currentSeconds > this.maxSeconds) {
            this.currentFrame++;
            // Restart animation if it finished
            if (this.currentFrame >= this.maxFrame) {
                this.currentFrame = 0;
            }

            // Reset currentSeconds
            this.currentSeconds = 0;
        }
    }

    draw(ctx, dt, destRect) {
        drawing.drawSprite(
            ctx,
            this.spriteSheet,
            destRect,
            new Rect(this.currentFrame * this.frameWidth, this.frameY, this.frameWidth, this.frameHeight));
    }
}

// Array of all Image objects created from files in spriteNames
const sprites = {};

// Array of animations created from files in animationDatas
const animations = {};

let spriteNames = [

];

// Animations! Format is anim name, file name, frame width, frame height, fps, frame y
let animationDatas = [
    { name: "friendlyWalk", file: "characterWalk", frameW: 100, frameH: 200, fps: 10, y: 200 }
];

function loadAll() {
    for (let name of spriteNames) {
        sprites[name] = loadImage(name);
    }
    for (let data of animationDatas) {
        animations[data.name] = loadAnimation(data);
    }
}

function loadImage(imageFileName) {
    let img = new Image();
    img.src = `../assets/${imageFileName}.png`;
    return img;
}

function loadAnimation(data) {
    let img = loadImage(data.file);
    return new Animation(img, data.frameW, data.frameH, data.fps, data.y);
}

export { loadAll, sprites, animations }