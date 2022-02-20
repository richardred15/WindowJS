Element.prototype.addClass = function (name) {
    this.classList.add(name);
}

Element.prototype.removeClass = function (name) {
    this.classList.remove(name);
}

Element.prototype.hasClass = function (name) {
    return this.classList.contains(name);
}

Element.prototype.toggleClass = function (name) {
    if (this.hasClass(name)) {
        this.removeClass(name);
    } else {
        this.addClass(name);
    }
}