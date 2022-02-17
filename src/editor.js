let winjs;
let previewWindow;

let previewElement; // = document.getElementById("previewElement");

window.onload = function () {
    previewElement = document.getElementById("previewElement");
    winjs = new WindowJS();
    winjs.onload = () => {
        previewWindow = winjs.newWindow("Testing");
        console.log(previewWindow.rawHTML);
        previewElement.innerHTML = previewWindow.rawHTML;
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