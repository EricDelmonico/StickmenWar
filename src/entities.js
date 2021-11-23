// Author: Eric Delmonico
//
// entities.js contains the entities in the game.
// Entities are drawable, and have a bounding box.
// This includes UI elements, in-game characters,
// pretty much everything that's drawn on screen.

import * as drawing from "./drawing.js";
import { Rect } from "./rect.js";

export const UnitStates = {
    Walking: 0,
    Stopped: 1
};

export class Unit {
    constructor(walkAnimation, idleAnimation, attackAnimation, rect, dir, entityList, damage = 1, hp = 10) {
        this.walkAnim = walkAnimation;
        this.idleAnim = idleAnimation;
        this.attackAnim = attackAnimation;
        this.animation = walkAnimation;
        this.rect = rect;
        this.state = UnitStates.Walking;
        this.dir = dir;
        this.speed = 100;
        this.damage = damage;
        this.hp = hp;
        this.maxHP = hp;
        this.maxHPRect = new Rect(0, this.rect.y - 10, this.maxHP * 5, 10);
        this.hpRect = new Rect(0, this.rect.y - 10, this.maxHP * 5, 10);
        this.entityList = entityList;
    }

    update(dt) {
        this.animation.update(dt);

        // Update health bar position to be centered on the unit
        let hpx = (this.rect.x + this.rect.width / 2) - (this.maxHPRect.width / 2);
        this.maxHPRect.x = hpx;
        this.hpRect.x = hpx; 

        // Update hp bar width
        this.hpRect.width = this.hp / this.maxHP * this.maxHPRect.width;

        switch (this.state) {
            case UnitStates.Walking:
                this.animation = this.walkAnim;
                this.rect.x += this.dir * this.speed * dt;
                break;
            case UnitStates.Stopped:
                this.animation = this.attackAnim;
                break;
        }
    }

    draw(ctx, dt) {
        this.animation.draw(ctx, dt, this.rect);

        // Draw health bar
        drawing.drawRect(ctx, this.maxHPRect, "red");
        drawing.drawRect(ctx, this.hpRect, "green");
    }

    doDamage(damage) {
        this.hp -= damage;
        if (this.hp <= 0) {
            let index = this.entityList.indexOf(this);
            this.entityList.splice(index, 1);
        }
    }
}