class Window {
    constructor(title = "WindowJS", x = 100, y = 100, width = 350, height = 400) {
        this.built = false;
        this.title = title;
        this.largeTitle = false;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.minWidth = 280;
        this.minHeight = 375;
        this.lastLocation = {
            x: x,
            y: y
        }

        this.rawHTML = "";
        this.rawContentHTML = "";
        this.rawTemplateHTML = "";
        /**
         * @type {HTMLElement}
         */
        this.windowElement = document.createElement("div");

        this.dragged = false;
        this.minimized = false;
        this.maximized = false;

        this.sizeUpdateTimeout = 0;
    }

    dragStart() {
        if (!this.dragged) {
            this.windowElement.addClass("dragging");
            this.dragged = true;
        }
    }

    dragStop() {
        if (this.dragged) {
            this.windowElement.removeClass("dragging");
            this.dragged = false;
        }
    }

    setSize(width, height) {
        this.width = width;
        this.height = height;
        this.updateSize();
    }

    center() {
        this.setLocation((window.innerWidth / 2) - (this.width / 2), (window.innerHeight / 2) - (this.height / 2))
    }

    setLocationRelative(dX, dY) {
        this.setLocation(this.x + dX, this.y + dY);
    }

    setLocation(x, y) {
        this.lastLocation = {
            x: this.x,
            y: this.y
        }
        this.x = x;
        this.y = y;
        this.updateLocation();
    }

    setTitle(title) {
        if (this.built) {
            this.title = title;
            this.largeTitle = false;
            let titleElement = this.titleBarElement.querySelector(".windowJSTitleBarTitle");
            titleElement.innerHTML = title;
            if (titleElement.scrollWidth > titleElement.clientWidth) {
                this.largeTitle = true;
                while (titleElement.scrollWidth > titleElement.clientWidth) {
                    titleElement.innerHTML = titleElement.innerHTML.slice(0, titleElement.innerHTML.length - 1);
                    titleElement.innerHTML = titleElement.innerHTML.trim();
                }
                titleElement.innerHTML = titleElement.innerHTML.slice(0, titleElement.innerHTML.length - 3);
                titleElement.innerHTML += "...";
            }
        }
    }

    updateLocation() {
        if (this.x >= 0 && this.x + this.width <= window.innerWidth) {
            if (this.y >= 0 && this.y + this.height <= window.innerHeight) {
                this.windowElement.style.top = this.y + "px";
                this.windowElement.style.left = this.x + "px";
                this.onmove();
            }
        } else {
            this.x = this.lastLocation.x;
            this.y = this.lastLocation.y;
        }

    }

    updateSize() {
        if (this.width <= this.minWidth) {
            this.width = this.minWidth;
            return false;
        }
        if (this.height <= this.minHeight) {
            this.height = this.minHeight;
            return false;
        }
        this.windowElement.style.width = this.width + "px";
        this.windowElement.style.height = this.height + "px";
        clearTimeout(this.sizeUpdateTimeout);
        this.sizeUpdateTimeout = setTimeout(() => {
            this.onresize()
        }, 300);
        return true;
    }

    onmove() {

    }

    onresize() {
        this.setTitle(this.title);
    }

    isClicked(target) {
        return this.windowElement.contains(target);
    }

    isTitleBarClick(target) {
        return this.titleBarElement.contains(target);
    }

    buildElement() {
        this.buildTemplate();
        let tempDiv = document.createElement("div");
        tempDiv.innerHTML = this.rawHTML;
        this.windowElement = tempDiv.firstChild;
        this.titleBarElement = this.windowElement.getElementsByClassName("windowJSTitleBar")[0];
        this.body = this.windowElement.getElementsByClassName("windowJSContent")[0];
        this.main = this.body.querySelector(".main");
        this.closeButton = this.windowElement.querySelector(".windowJSTitleBarControl.close");
        this.minimizeButton = this.windowElement.querySelector(".windowJSTitleBarControl.minimize");
        this.closeButton = this.windowElement.querySelector(".windowJSTitleBarControl.close");
        this.maximizeButton = this.windowElement.querySelector(".windowJSTitleBarControl.maximize");
        this.main.appendChild(buildSelect("potatoinfo1", potatoSelectOptions));
        this.main.appendChild(buildSelect("potatoinfo2", potatoSelectOptions));
        this.main.appendChild(buildSelect("potatoinfo3", potatoSelectOptions));
        this.main.appendChild(buildSelect("potatoinfo4", potatoSelectOptions));
        this.attachListeners();
        this.built = true;
    }

    setTemplates(rawTemplateHTML, rawContentHTML) {
        this.rawTemplateHTML = rawTemplateHTML;
        this.rawContentHTML = rawContentHTML;

        this.buildElement();
    }

    attachListeners() {
        let thisWindow = this;
        this.minimizeButton.addEventListener("click", (e) => {
            this.toggleMinimized();
        });
        this.maximizeButton.addEventListener("click", (e) => {
            this.toggleMaximized();
        });

        this.closeButton.addEventListener("click", (e) => {
            this.close();
        });
    }

    /**
     * Removes window from DOM and memory
     */
    close() {
        this.onclose();
        winjs.removeWindow(this.id);
    }

    /**
     * Event to be overridden, fires when window closes, before it's final removal
     */
    onclose() {

    }

    toggleMinimized() {
        if (this.minimized) {
            this.windowElement.removeClass("minimized");
        } else {
            this.windowElement.addClass("minimized");
        }
        this.minimized = !this.minimized;
    }

    toggleMaximized() {
        if (this.maximized) {
            this.windowElement.removeClass("maximized");
        } else {
            this.windowElement.addClass("maximized");
        }
        this.maximized = !this.maximized;
    }

    buildTemplate() {
        let content = this.rawContentHTML;

        let title = this.title;

        let repl = {
            x: this.x,
            y: this.y,
            height: this.height,
            width: this.width,
            id: this.id,
            title: title,
            content: content
        }
        this.rawHTML = this.parseTemplate(this.rawTemplateHTML, repl);
        this.setTitle(this.title);
    }

    /**
     * Parse the HTML template data
     * @param {String} text 
     * @param {Object} repl 
     * @returns {String}
     */
    parseTemplate(text, repl) {
        for (let name in repl) {
            let val = repl[name];
            let regex = new RegExp("\\$\\{" + name + "\\}", "g");
            text = text.replace(regex, val);
        }
        return text;
    }

    attach() {
        document.body.appendChild(this.windowElement);
    }
}