let winjs;
let win;
let win2;

window.onload = function () {
    winjs = new WindowJS();
    winjs.onload = function () {
        win = winjs.newWindow("Window One", 100, 100);
        win.attach();

        win2 = winjs.newWindow("Window Two", 657, 78, 959, 671);
        win2.attach();
    }
}