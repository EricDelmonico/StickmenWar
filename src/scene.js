// Author: Eric Delmonico
//
// scene.js will contain the entities in a scene, and handle the
// collisions and other misc interactions between them.

import { Unit } from "./entities.js";
import * as assets from "./assets.js";
import { Rect } from "./rect.js";
import * as input from "./input.js";
import { Keys } from "./input.js";

export class Scene {
    constructor(cameraWidth) {
        // Pixel width of the world
        this.worldWidth = 1200;
        // Pixel width of the camera
        this.cameraWidth = cameraWidth;
        // Pixel position of the camera in the world
        this.cameraPos = 0;
        // Movement speed of the camera in pixels per second
        this.cameraMoveSpeed = 500;

        this.friendlyEntities = [
            new Unit(assets.getAnimation("friendlyWalk"), new Rect(0, 0, 75, 150)),
        ];
        this.enemyEntities = [
            new Unit(assets.getAnimation("enemyWalk"), new Rect(this.worldWidth - 75, 0, 75, 150)),
        ];
    }

    update(dt) {
        this.userInput();
        this.cameraClamp();
        this.updateEntities(dt);
    }

    draw(ctx, dt) {
        // Offset drawing by the camera position
        ctx.translate(-this.cameraPos, 0);

        this.drawEntities(ctx, dt);
    }

    updateEntities(dt) {
        // Update all entities
        for (let e of this.friendlyEntities) {
            e.update(dt);
        }
        for (let e of this.enemyEntities) {
            e.update(dt);
        }
    }

    drawEntities(ctx, dt) {
        for (let e of this.friendlyEntities) {
            e.draw(ctx, dt);
        }
        for (let e of this.enemyEntities) {
            e.draw(ctx, dt);
        }
    }

    // Take care of user input
    userInput() {
        // Update the camera
        if (input.getKeyDown(Keys.RIGHT)) {
            this.cameraPos += this.cameraMoveSpeed * dt;
        }
        if (input.getKeyDown(Keys.LEFT)) {
            this.cameraPos -= this.cameraMoveSpeed * dt;
        }
    }

    // Make sure camera position is on-screen
    cameraClamp() {
        if (this.cameraPos < 0) {
            this.cameraPos = 0;
        }

        if (this.cameraPos > this.worldWidth - this.cameraWidth) {
            this.cameraPos = this.worldWidth - this.cameraWidth;
        }
    }
}