// Author: Eric Delmonico
//
// animation.js just contains a class that handles the creation and updating/drawing of an animation

import * as drawing from "./drawing.js";
import { Rect } from "./rect.js";

// Holds an animation
export class Animation {
    constructor(spriteSheet, frameWidth, frameHeight, fps, frameY = 0, looping = true, playbackDirection = 1) {
        this.spriteSheet = spriteSheet;
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
        this.frameY = frameY;

        this.currentSeconds = 0;
        this.fps = fps;
        this.maxSeconds = 1 / fps;
        this.maxFrame = (spriteSheet.width) / frameWidth;
        this.currentFrame = playbackDirection > 0 ? 0 : this.maxFrame - 1;

        this.looping = looping;
        this.animationFinished = false;

        this.playbackDirection = playbackDirection;
    }

    update(dt) {
        this.currentSeconds += dt;

        // Move animation a frame if needed
        if (this.currentSeconds > this.maxSeconds && !this.animationFinished) {
            this.currentFrame += this.playbackDirection;
            // Restart animation if it finished
            if ((this.currentFrame >= this.maxFrame || this.currentFrame < 0) && this.looping) {
                this.currentFrame = this.currentFrame >= this.maxFrame ? 0 : this.maxFrame - 1;
            }
            else if ((this.currentFrame >= this.maxFrame || this.currentFrame < 0) && !this.looping) {
                this.currentFrame -= this.playbackDirection;
                this.animationFinished = true;
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