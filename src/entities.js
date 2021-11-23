// Author: Eric Delmonico
//
// entities.js contains the entities in the game.
// Entities are drawable, and have a bounding box.
// This includes UI elements, in-game characters,
// pretty much everything that's drawn on screen.

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
}