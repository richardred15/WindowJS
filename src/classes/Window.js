class Window {
    constructor(title = "WindowJS", x = 100, y = 100, width = 350, height = 400) {
        this.title = title;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

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
        if (x >= 0 && x + this.width <= window.innerWidth) {
            if (y >= 0 && y + this.height <= window.innerHeight) {
                this.x = x;
                this.y = y;
                this.updateLocation();
                this.onmove();
            }
        }
    }

    updateLocation() {
        this.windowElement.style.top = this.y + "px";
        this.windowElement.style.left = this.x + "px";
    }

    updateSize() {
        this.windowElement.style.width = this.width + "px";
        this.windowElement.style.height = this.height + "px";
    }

    onmove() {

    }

    onresize() {

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
        this.closeButton = this.windowElement.querySelector(".windowJSTitleBarControl.close");
        this.minimizeButton = this.windowElement.querySelector(".windowJSTitleBarControl.minimize");
        this.maximizeButton = this.windowElement.querySelector(".windowJSTitleBarControl.maximize");

        this.attachListeners();
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
            //thisWindow.windowElement.toggleClass("minimized");
        });
        this.maximizeButton.addEventListener("click", (e) => {
            this.toggleMaximized();
            //thisWindow.windowElement.toggleClass("maximized");
        });
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

    }

    parseTemplate(text, repl) {
        for (let name in repl) {
            let val = repl[name];
            text = text.replaceAll(`\${${name}}`, val);
        }
        return text;
    }
}