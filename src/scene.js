// Author: Eric Delmonico
//
// scene.js will contain the entities in a scene, and handle the
// collisions and other misc interactions between them.

import { Unit, UnitStates } from "./entities.js";
import * as assets from "./assets.js";
import { Rect } from "./rect.js";
import * as input from "./input.js";
import { Keys } from "./input.js";

export class Scene {
    constructor(cameraWidth, worldHeight) {
        // Pixel width of the world
        this.worldWidth = 1200;
        // Pixel width of the camera
        this.cameraWidth = cameraWidth;
        // Pixel position of the camera in the world
        this.cameraPos = 0;
        // Movement speed of the camera in pixels per second
        this.cameraMoveSpeed = 500;

        this.friendlyEntities = [];
        this.friendlyEntities.push(new Unit(assets.getAnimation("friendlyWalk"), null, assets.getAnimation("friendlyAttack"), new Rect(0, worldHeight - 110, 50, 100), 1, this.friendlyEntities));
        
        this.enemyEntities = [];
        this.enemyEntities.push(new Unit(assets.getAnimation("enemyWalk"), null, assets.getAnimation("enemyAttack"), new Rect(this.worldWidth - 75, worldHeight - 110, 50, 100), -1, this.enemyEntities));
    }

    update(dt) {
        this.userInput(dt);
        this.cameraClamp();
        this.collideUnits(dt);
        this.updateEntities(dt);
    }

    draw(ctx, dt) {
        // Offset drawing by the camera position
        ctx.translate(-this.cameraPos, 0);
        this.drawEntities(ctx, dt);
    }

    // Test collisions between the enemy and friendly units
    collideUnits(dt) {
        for (let f of this.friendlyEntities) {
            for (let e of this.enemyEntities) {
                if (e.rect.collidesWith(f.rect)) {
                    f.state = UnitStates.Stopped;
                    e.state = UnitStates.Stopped;
                    e.doDamage(f.damage * dt);
                    f.doDamage(e.damage * dt);
                }
            }
        }
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
    userInput(dt) {
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