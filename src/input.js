// Author: Eric Delmonico
//
// input.js wraps user input into a more Unity-like form, which I prefer.

// Keys 'enum'
const Keys = {
    LEFT: 37,
    RIGHT: 39
};

let keys;

function init() {
    document.onkeydown = keyDown;
    document.onkeyup = keyUp;

    // All keys we want to capture
    keys = {};
    for (let key in Keys) {
        keys[Keys[key]] = false;
    }
}

function keyDown(e) {
    keys[e.keyCode] = true;
}

function keyUp(e) {
    keys[e.keyCode] = false;
}

function getKeyDown(keyCode) {
    return keys[keyCode];
}

// Adapted from https://stackoverflow.com/questions/17130395/real-mouse-position-in-canvas
function handleMousePos(e) {
    var rect = document.querySelector("canvas").getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}

export { init, getKeyDown, Keys, handleMousePos }