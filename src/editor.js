/**
 * @type {WindowJS}
 */
let winjs;
let win;

let buildSteps = [
    ["window", "Window One", 100, 100],
    ["select", "potato", {
        "potato": "Potato",
        "noPotato": "Non-Potato",
        "cake": "Cake",
        "spaghet": "Spaghetti",
        "porn": "Porno :o"
    }],
    ["button", "Potato", () => {
        alert('works')
    }],
    ["text", "Hello, how are you?"],
    ["input", "text", "name", "You're a dick"],
    ["text", "This will be bad"]
]


window.onload = function () {
    winjs = new WindowJS();

    winjs.onload = function () {
        win = winjs.runBuildSteps(buildSteps);
        update();
    }
}

function update() {
    document.getElementById("staticViewer").innerHTML = win.html();
}