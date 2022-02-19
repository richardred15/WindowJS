class WindowJS {
    constructor() {
        /**
         * @type {Window[]}
         */
        this.windows = [];
        this.nextWindowID = 1001;

        this.init().then(() => {
            this.onload()
        });

        this.dragging = false;
        this.resizing = false;
        this.pointerdown = false;
        this.lastClickTime = 0;
        /**
         * @type {Window}
         */
        this.selectedWindow = null;

        this.mousePosition = {
            x: 0,
            y: 0
        };

        this.attachListeners();
    }

    focusWindow(index) {
        for (let window of this.windows) {
            window.windowElement.removeClass("focused");
        }
        this.windows[index].windowElement.addClass("focused");
    }

    attachListeners() {
        window.addEventListener("pointerdown", (e) => {
            this.pointerdown = true;
            this.mousePosition = {
                x: e.clientX,
                y: e.clientY
            };
            for (let w in this.windows) {
                let window = this.windows[w];
                if (!window.minimized) {
                    if (window.isClicked(e.target)) {
                        if (window.isTitleBarClick(e.target)) {
                            this.selectedWindow = window;
                        } else {
                            if (e.target.hasClass("windowJSWindowBorder")) {
                                let which = e.target.className.replace("windowJSWindowBorder ", "").replace("corner ", "");
                                this.resizing = which;
                                this.selectedWindow = window;
                                this.selectedWindow.windowElement.addClass("resizing");
                            }
                        }
                        this.focusWindow(w);
                    }
                } else if (window.minimized && window.isClicked(e.target)) {
                    window.toggleMinimized();
                }
            }
            if (this.lastClickTime == 0) {
                //this.lastClickTime = Date.now();
            }

        });

        window.addEventListener("blur", (e) => {
            this.dragging = false;
            this.pointerdown = false;
            this.resizing = false;
            if (this.selectedWindow && this.dragging) {
                this.selectedWindow.dragStop();
            }
            this.selectedWindow = null;
        });

        window.addEventListener("pointermove", (e) => {
            if (this.pointerdown && this.resizing) {
                switch (this.resizing) {
                    case "right":
                        //this.selectedWindow.setLocationRelative(e.clientX - this.mousePosition.x, e.clientY - this.mousePosition.y);
                        this.selectedWindow.width += e.clientX - this.mousePosition.x;
                        this.selectedWindow.updateSize();
                        break;
                    case "left":
                        this.selectedWindow.width -= e.clientX - this.mousePosition.x;
                        this.selectedWindow.x += e.clientX - this.mousePosition.x;
                        if (this.selectedWindow.updateSize()) {
                            this.selectedWindow.updateLocation();
                        }
                        break;
                    case "bottom":
                        this.selectedWindow.height += e.clientY - this.mousePosition.y;
                        this.selectedWindow.updateSize();
                        break;
                    case "top":
                        this.selectedWindow.height -= e.clientY - this.mousePosition.y;
                        this.selectedWindow.y += e.clientY - this.mousePosition.y;
                        if (this.selectedWindow.updateSize()) {
                            this.selectedWindow.updateLocation();
                        }
                        break;
                    case "bottomright":
                        this.selectedWindow.height += e.clientY - this.mousePosition.y;
                        this.selectedWindow.width += e.clientX - this.mousePosition.x;
                        this.selectedWindow.updateSize();
                        break;
                    case "bottomleft":
                        this.selectedWindow.height += e.clientY - this.mousePosition.y;
                        this.selectedWindow.width -= e.clientX - this.mousePosition.x;
                        this.selectedWindow.x += e.clientX - this.mousePosition.x;
                        if (this.selectedWindow.updateSize()) {
                            this.selectedWindow.updateLocation();
                        }
                        break;
                    case "topright":
                        this.selectedWindow.height -= e.clientY - this.mousePosition.y;
                        this.selectedWindow.y += e.clientY - this.mousePosition.y;
                        this.selectedWindow.width += e.clientX - this.mousePosition.x;
                        if (this.selectedWindow.updateSize()) {
                            this.selectedWindow.updateLocation();
                        }
                        break;
                    case "topleft":
                        this.selectedWindow.height -= e.clientY - this.mousePosition.y;
                        this.selectedWindow.y += e.clientY - this.mousePosition.y;
                        this.selectedWindow.width -= e.clientX - this.mousePosition.x;
                        this.selectedWindow.x += e.clientX - this.mousePosition.x;
                        if (this.selectedWindow.updateSize()) {
                            this.selectedWindow.updateLocation();
                        }
                        break;
                    default:
                        break;
                }
            } else if (this.pointerdown && !this.dragging && !this.resizing) {
                this.dragging = true;
                if (this.selectedWindow && this.selectedWindow.maximized) {
                    this.selectedWindow.toggleMaximized();
                    this.selectedWindow.setLocation(e.clientX - (this.selectedWindow.width / 2), e.clientY - 15);
                }
            } else if (this.dragging && this.pointerdown && !this.resizing) {
                if (this.selectedWindow) {
                    this.selectedWindow.dragStart();
                    this.selectedWindow.setLocationRelative(e.clientX - this.mousePosition.x, e.clientY - this.mousePosition.y);
                }
            }
            this.mousePosition = {
                x: e.clientX,
                y: e.clientY
            };
            return true;
        });

        window.addEventListener("pointerup", (e) => {
            this.dragging = false;
            this.pointerdown = false;
            if (this.resizing) {
                this.selectedWindow.windowElement.removeClass("resizing");
            }
            this.resizing = false;
            if (this.selectedWindow && this.dragging) {
                this.selectedWindow.dragStop();
            }
            if (this.selectedWindow) {
                this.selectedWindow = null;
            }
            if (Date.now() - this.lastClickTime < 300) {
                //console.log(this.lastClickTime, Date.now() - this.lastClickTime);
                for (let window of this.windows) {
                    if (!window.minimized && window.isTitleBarClick(e.target)) {
                        window.toggleMaximized();
                    }
                }
            }
            this.lastClickTime = Date.now();
        });
    }

    newWindow(title, x, y, width, height) {
        let newWindow = new Window(title, x, y, width, height);
        newWindow.id = this.nextWindowID;
        newWindow.setTemplates(this.rawTemplateHTML, this.rawContentHTML);
        newWindow.buildTemplate();
        this.windows.push(newWindow);
        this.focusWindow(this.windows.length - 1);
        this.nextWindowID++;
        return newWindow;
    }

    removeWindow(id) {
        let index = parseInt(id) - 1001;
        let window = this.windows[index];
        document.body.removeChild(window.windowElement);
        this.windows.splice(index, 1);
    }

    async init() {
        this.rawContentHTML = await (await fetch("src/template/example.html")).text();
        this.rawTemplateHTML = await (await fetch("src/template/window.html")).text();
    }

    onload() {

    }
}