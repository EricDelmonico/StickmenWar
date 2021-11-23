// Author: Eric Delmonico
//
// animation.js just contains a class that handles the creation and updating/drawing of an animation

import * as drawing from "./drawing.js";
import { Rect } from "./rect.js";

// Holds an animation
export class Animation {
    constructor(spriteSheet, frameWidth, frameHeight, fps, frameY = 0) {
        this.spriteSheet = spriteSheet;
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
        this.frameY = frameY;

        this.currentFrame = 0;
        this.currentSeconds = 0;
        this.fps = fps;
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