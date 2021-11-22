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

export { init, getKeyDown, Keys }