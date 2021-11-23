// Author: Eric Delmonico
//
// entities.js contains the entities in the game.
// Entities are drawable, and have a bounding box.
// This includes UI elements, in-game characters,
// pretty much everything that's drawn on screen.

import * as drawing from "./drawing.js";

export class Unit {
    constructor(animation, rect) {
        this.animation = animation;
        this.rect = rect;
    }

    update(dt) {
        this.animation.update(dt);
    }

    draw(ctx, dt) {
        this.animation.draw(ctx, dt, this.rect);
    }

    // Returns true if colliding with other entity, false if not
    //
    // For simplicity's sake, other must be an entity to the right of this entity
    collidingWithObjectOnRight(other) {
        let right = this.rect.x + this.rect.width;
        let otherLeft = other.rect.x;

        if (right >= otherLeft) return true;
        return false;
    }
}