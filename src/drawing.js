// Author: Eric Delmonico
//
// drawing.js handles the basic drawing needs of the game.
// It has a definition for a Rect class for drawing, and
// will have methods to draw rects, sprites, and sprites
// from spritesheets.

export class Rect {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}

function drawRect(ctx, rect, color) {
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.rect(rect.x, rect.y, rect.width, rect.height);
    ctx.fill();
    ctx.closePath();
    ctx.restore();
}

// Draws a sprite from a spritesheet to the screen
function drawSprite(ctx, spriteSheet, destRect, sourceRect = new Rect(0, 0, spriteSheet.width, spriteSheet.height)) {
    ctx.drawImage(
        spriteSheet, 
        sourceRect.x, sourceRect.y, sourceRect.width, sourceRect.height, 
        destRect.x, destRect.y, destRect.width, destRect.height);
}

export { drawRect, drawSprite }