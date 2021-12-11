// Author: Eric Delmonico
//
// arrow.js will house the Arrow class, which is just a projectile that moves itself towards
// the given target position. Super simple class but it's useful to have it be self-contained

import { Rect } from "./rect.js";
import * as assets from "./assets.js";
import { drawSprite } from "./drawing.js";

export class Arrow {
    constructor(target) {
        this.rect = new Rect(10, 0, 50, 50);
        this.sprite = assets.sprites["arrow"];

        // Figure out where the arrow is heading
        this.direction = { x: target.x - this.rect.x, y: target.y - this.rect.y };
        let directionLen = Math.sqrt(this.direction.x * this.direction.x + this.direction.y * this.direction.y);
        this.direction = { x: this.direction.x / directionLen, y: this.direction.y / directionLen };

        // Pixels per second speed
        this.flightSpeed = 500;

        // Base damage to enemies
        this.damage = 0.5;
    }

    update(dt) {
        this.rect.x += this.direction.x * dt * this.flightSpeed;
        this.rect.y += this.direction.y * dt * this.flightSpeed;
    }

    draw(ctx) {
        drawSprite(ctx, this.sprite, this.rect);
    }
}