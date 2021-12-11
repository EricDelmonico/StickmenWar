// Author: Eric Delmonico
//
// entities.js contains the entities in the game.
// Entities are drawable, and have a bounding box.
// This includes UI elements, in-game characters,
// pretty much everything that's drawn on screen.

import { Arrow } from "./arrow.js";
import * as drawing from "./drawing.js";
import { Rect } from "./rect.js";

export const UnitStates = {
    Walking: 0,
    Stopped: 1,
    Attacking: 2,
    Dead: 3
};

export class Base {
    constructor(sprite, rect, hp = 100, onDestroy = () => { console.log("Destroyed") }) {
        this.sprite = sprite;
        this.rect = rect;

        this.hp = hp;
        this.maxHP = hp;
        this.maxHPRect = new Rect(0, this.rect.y - 30, 175, 25);
        this.hpRect = new Rect(0, this.rect.y - 30, this.maxHPRect.width, 25);
        this.maxHPRect.x = (this.rect.x + this.rect.width / 2) - (this.maxHPRect.width / 2);
        this.hpRect.x = (this.rect.x + this.rect.width / 2) - (this.maxHPRect.width / 2);

        this.onDestroy = onDestroy;
    }

    update(dt) {
        this.hpRect.width = (this.hp / this.maxHP) * this.maxHPRect.width;
    }

    draw(ctx, dt) {
        drawing.drawSprite(ctx, this.sprite, this.rect);
        // Draw health bar
        drawing.drawRect(ctx, this.maxHPRect, "red");
        drawing.drawRect(ctx, this.hpRect, "green");
    }

    doDamage(damage) {
        this.hp -= damage;
        if (this.hp <= 0) {
            this.onDestroy();
        }
    }
}

export class Unit {
    constructor(walkAnimation, idleAnimation, deathAnimation, attackAnimation, rect, dir, entityList, arrowList, damage = 2, hp = 10, enemy = false, ranged = false) {
        this.walkAnim = walkAnimation;
        this.idleAnim = idleAnimation;
        this.deathAnim = deathAnimation;
        this.attackAnim = attackAnimation;
        this.animation = walkAnimation;
        this.rect = rect;
        this.internalState = UnitStates.Walking;
        this.dir = dir;
        this.speed = 100;
        this.damage = damage;
        this.hp = hp;
        this.maxHP = hp;
        // rect.width with 10 pixels padding seems reasonable for health bar size
        this.maxHPRect = new Rect(0, this.rect.y - 10, rect.width - 10, 10);
        this.hpRect = new Rect(0, this.rect.y - 10, rect.width - 10, 10);
        this.entityList = entityList;
        this.arrowList = arrowList;

        this.enemy = enemy;

        // 1 shot per shootingTime seconds
        this.shootingTime = 1.5;
        this.currentShootTime = 0;
        this.ranged = ranged;
    }

    update(dt) {
        this.animation.update(dt);

        // Update health bar position to be centered on the unit
        let hpx = (this.rect.x + this.rect.width / 2) - (this.maxHPRect.width / 2);
        this.maxHPRect.x = hpx;
        this.hpRect.x = hpx;

        // Update hp bar width
        this.hpRect.width = this.hp / this.maxHP * this.maxHPRect.width;

        switch (this.internalState) {
            case UnitStates.Walking:
                this.animation = this.walkAnim;
                this.rect.x += this.dir * this.speed * dt;
                this.doShooting(dt);
                break;
            case UnitStates.Attacking:
                this.animation = this.attackAnim;
                break;
            case UnitStates.Stopped:
                this.animation = this.idleAnim;
                this.doShooting(dt);
                break;
            case UnitStates.Dead:
                this.animation = this.deathAnim;
                if (this.animation.animationFinished) {
                    this.deathAnimationOver();
                }
                break;
        }
    }

    // Shoot in idle and walking
    doShooting(dt) {
        if (!this.ranged) return;

        this.currentShootTime += dt;
        if (this.currentShootTime > this.shootingTime) {
            this.currentShootTime = 0;
            this.arrowList.push(
                    new Arrow({ x: this.dir * 10000, y: this.rect.y + 45 }, // target, x is * 10000 so the target is off-screen in dir direction 
                        this.enemy ? "enemyArrow" : "friendlyArrow", // sprite for the arrow
                        { x: this.rect.x, y: this.rect.y + 45 })) // starting position
        }
    }

    draw(ctx, dt) {
        this.animation.draw(ctx, dt, this.rect);

        // Draw health bar
        drawing.drawRect(ctx, this.maxHPRect, "red");
        drawing.drawRect(ctx, this.hpRect, "green");
    }

    doDamage(damage) {
        // Don't do any damage if we're already dead
        if (this.internalState == UnitStates.Dead) {
            return;
        }

        this.hp -= damage;
        if (this.hp <= 0) {
            this.internalState = UnitStates.Dead;

            if (this.enemy) {
                let e = new Event("enemydied");
                document.dispatchEvent(e);
            }
        }
    }

    deathAnimationOver() {
        let index = this.entityList.indexOf(this);
        this.entityList.splice(index, 1);

        // Make sure the entity behind this one kicks it into gear :)
        if (this.entityList.length > 0) this.entityList[0].state = UnitStates.Walking;
    }

    set state(newstate) {
        if (this.internalState != UnitStates.Dead) {
            this.internalState = newstate;
        }
    }
}