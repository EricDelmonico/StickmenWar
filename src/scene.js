// Author: Eric Delmonico
//
// scene.js will contain the entities in a scene, and handle the
// collisions and other misc interactions between them.

import { Base, Unit, UnitStates } from "./entities.js";
import * as assets from "./assets.js";
import { Rect } from "./rect.js";
import * as input from "./input.js";
import { Keys } from "./input.js";
import { EnemyAI } from "./enemyAI.js";

export class Scene {
    constructor(cameraWidth, worldHeight) {
        // Pixel width of the world
        this.worldWidth = 1200;
        // Pixel width of the camera
        this.cameraWidth = cameraWidth;
        // Pixel position of the camera in the world
        this.cameraPos = 0;
        // Movement speed of the camera in pixels per second
        this.cameraMoveSpeed = 750;

        this.friendlySpawn = { x: 0, y: worldHeight - 110 };
        this.enemySpawn = { x: this.worldWidth - 75, y: worldHeight - 110 };
        this.unitDimensions = { w: 50, h: 100 };

        this.friendlyEntities = [];
        this.friendlyEntities.push();
        document.querySelector("#spawnTroops").onclick = () => this.spawnUnit(["friendlyWalk", "friendlyIdle", "friendlyDeath", "friendlyAttack", 1, 2, 10], true);

        this.enemyEntities = [];
        const enemySpawnCallback = () => this.spawnUnit(["enemyWalk", "enemyIdle", "enemyDeath", "enemyAttack", -1, 1, 10]);
        this.enemyAI = new EnemyAI(enemySpawnCallback);

        this.gameOver = false;
        let onBaseDestroy = () => this.gameOver = true;
        this.friendlyBase = new Base(assets.sprites["friendlyBase"], new Rect(0, worldHeight - 200, 200, 200), 75, onBaseDestroy);
        this.enemyBase = new Base(assets.sprites["enemyBase"], new Rect(this.worldWidth - 200, worldHeight - 200, 200, 200), 75, onBaseDestroy);

        // Set up pause button
        this.paused = true;
        this.pauseButton = document.querySelector("#pause");
        this.pauseButton.onclick = () => {
            if (this.paused) {
                this.paused = false;
                this.pauseButton.textContent = "Pause";
            } else {
                this.paused = true;
                this.pauseButton.textContent = "Play";
            }
        };
    }

    update(dt) {
        this.userInput(dt);
        this.cameraClamp();

        if (!this.paused) {
            this.enemyAI.update(dt, this.enemyEntities.length);
            this.collideUnits(dt);
            this.updateEntities(dt);
            this.enemyBase.update(dt);
            this.friendlyBase.update(dt);
        }
    }

    draw(ctx, dt) {
        // Offset drawing by the camera position
        ctx.translate(-this.cameraPos, 0);
        // Draw bases
        this.friendlyBase.draw(ctx, dt);
        this.enemyBase.draw(ctx, dt);
        this.drawEntities(ctx, dt);
    }

    // unit data should be walk animation, idle animation, death animation, attack animation, direction
    spawnUnit(unitData, friendly = false) {
        let list = friendly ? this.friendlyEntities : this.enemyEntities;
        let x = friendly ? this.friendlySpawn.x : this.enemySpawn.x;
        let y = friendly ? this.friendlySpawn.y : this.enemySpawn.y;
        this.addUnit(list, unitData[0], unitData[1], unitData[2], unitData[3], x, y, this.unitDimensions.w, this.unitDimensions.h, unitData[4], unitData[5], unitData[6]);
    }

    addUnit(unitList, walkAnim, idleAnim, deathAnim, atkAnim, x, y, w, h, dir, damage, hp) {
        if (!this.gameOver)
            unitList.push(
                new Unit(
                    assets.getAnimation(walkAnim), 
                    assets.getAnimation(idleAnim), 
                    assets.getAnimation(deathAnim), 
                    assets.getAnimation(atkAnim), 
                    new Rect(x, y, w, h), 
                    dir, 
                    unitList,
                    damage,
                    hp));
    }

    // Test collisions between units
    collideUnits(dt) {
        // friendly-friendly collisions
        // They should only be able to be blocked by the friendly in front of them
        for (let i = 1; i < this.friendlyEntities.length; i++) {
            if (this.friendlyEntities[i].rect.collidesWith(this.friendlyEntities[i - 1].rect)) {
                this.friendlyEntities[i].state = UnitStates.Stopped;
            } else {
                this.friendlyEntities[i].state = UnitStates.Walking;
            }
        }

        // Enemy-enemy collisions
        // They should only be able to be blocked by the enemy in front of them
        for (let i = 1; i < this.enemyEntities.length; i++) {
            if (this.enemyEntities[i].rect.collidesWith(this.enemyEntities[i - 1].rect)) {
                this.enemyEntities[i].state = UnitStates.Stopped;
            } else {
                this.enemyEntities[i].state = UnitStates.Walking;
            }
        }

        // If the game is over, trot the winners past the opposing base, and ignore base collisions
        if (this.gameOver) {
            if (this.friendlyEntities.length > 0) this.friendlyEntities[0].state = UnitStates.Walking;
            if (this.enemyEntities.length > 0) this.enemyEntities[0].state = UnitStates.Walking;
            return;
        }

        // friendly-enemy collision--only the front ones can collide
        let frontEnemy = this.enemyEntities[0];
        let frontFriendly = this.friendlyEntities[0];
        if (frontEnemy && frontFriendly && frontEnemy.rect.collidesWith(frontFriendly.rect)) {
            frontFriendly.state = UnitStates.Attacking;
            frontEnemy.state = UnitStates.Attacking;
            frontEnemy.doDamage(frontFriendly.damage * dt);
            frontFriendly.doDamage(frontEnemy.damage * dt);
            return;
        }
        // both exist but they're not colliding, so they need to walk forwards
        else if (frontEnemy && frontFriendly && frontEnemy.state != UnitStates.Dead) {
            frontEnemy.state = UnitStates.Walking;
            frontFriendly.state = UnitStates.Walking;
        }
        // Front enemy exists but there's no friendly
        else if (frontEnemy && !frontFriendly) {
            frontEnemy.state = UnitStates.Walking;
        }
        // Front friendly exists but there's no enemy
        else if (frontFriendly && !frontEnemy) {
            frontFriendly.state = UnitStates.Walking;
        }

        // Friendly-enemy base collision
        if (this.friendlyEntities.length > 0 && this.friendlyEntities[0].rect.collidesWith(this.enemyBase.rect)) {
            this.friendlyEntities[0].state = UnitStates.Attacking;
            this.enemyBase.doDamage(this.friendlyEntities[0].damage * dt);
        }

        // Enemy-friendly base collision
        if (this.enemyEntities.length > 0 && this.enemyEntities[0].rect.collidesWith(this.friendlyBase.rect)) {
            this.enemyEntities[0].state = UnitStates.Attacking;
            this.friendlyBase.doDamage(this.enemyEntities[0].damage * dt);
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