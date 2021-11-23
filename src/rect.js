// Author: Eric Delmonico
//
// rect.js containsa definition of the rect class, which handles the creation
// and collision of rectangles. Used for bounds for in-game objects

export class Rect {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    // Whether this rect collides with the other.
    // NOTE: this is 1-dimensional!!
    collidesWith(other) {
        let right = this.x + this.width;
        let left = this.x;

        let otherRight = other.x + other.width;
        let otherLeft = other.x;

        if (right >= otherLeft && left < otherRight) {
            return true;
        }
        return false;
    }

    // Whether this rect contains a point
    containsPoint(x, y) {
        let top = this.y;
        let bottom = this.y + this.height;
        let left = this.x;
        let right = this.x + this.width;

        if (y > top && y < bottom && x > left && x < right) {
            return true;
        }
        return false;
    }
}