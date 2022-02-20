/**
 * @type {WindowJS}
 */
let winjs;
/**
 * @type {WindowJSWindow}
 */
let win;
let win2;

let buildSteps = [
    ["window", "Window One", 100, 100, 283, 185],
    /*     ["button", "Potato", (btn) => {
            alert("Works");
        }], */
    /* ["text", "Hello, how are you?"],
    ["input", "text", "name", "You're a dick"],
    ["text", "This will be bad"], */
    ["form", (form) => {
            console.log(JSON.stringify(Array.from(new FormData(form)), null, 2));
            return false;
        },
        [
            ["select", "potatoSelector", {
                "potato": "Potato",
                "noPotato": "Non-Potato",
                "cake": "Cake",
                "spaghet": "Spaghetti",
                "porn": "Porno :o"
            }],
            ["input", "text", "dicks"],
            ["input", "submit", "submit"]
        ]
    ],
    /*     ["container", "secondary", [
            ["button", "Close", () => {
                alert('poop')
            }]
        ]] */
]

window.onload = function () {
    winjs = new WindowJS();
    winjs.onload = function () {
        //win = winjs.newWindow("Window One", 100, 100);
        win = winjs.runBuildSteps(buildSteps);
        win.attach();
    }
}