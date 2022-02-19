let winjs;
let win;
let win2;

window.onload = function () {
    winjs = new WindowJS();
    winjs.onload = function () {
        win = winjs.newWindow("Window One", 100, 100);
        win.attach();

        win2 = winjs.newWindow("Window Two", 200, 200);
        win2.attach();
    }
}


Element.prototype.addClass = function (name) {
    if (!this.hasClass(name)) {
        this.className = (this.className + ' ' + name).trim();

    }
}

Element.prototype.removeClass = function (name) {
    let className = this.className;
    if (this.hasClass(name)) {
        className = className.replace(name, "").replace("  ", " ").trim();
        this.className = className;
    }
}

Element.prototype.hasClass = function (name) {
    let classes = this.className.split(" ");
    if (classes.indexOf(name) != -1) {
        return true;
    }
    return false;
}

Element.prototype.toggleClass = function (name) {
    if (this.hasClass(name)) {
        this.removeClass(name);
    } else {
        this.addClass(name);
    }
}