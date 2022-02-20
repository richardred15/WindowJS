/**
 * The main WindowJS class
 * @typedef {WindowJS}
 */
class WindowJS {
    constructor() {
        /**
         * @type {WindowJSWindow[]}
         */
        this.windows = [];
        /**
         * @type {Builder}
         */
        this.builder = new Builder();
        this.nextWindowID = 1001;

        this.loaded = false;
        this.init().then(() => {
            this.onload()
        });

        this.dragging = false;
        this.resizing = false;
        this.pointerdown = false;
        this.lastClickTime = 0;
        /**
         * @type {WindowJSWindow}
         */
        this.selectedWindow = null;

        this.mousePosition = {
            x: 0,
            y: 0
        };

        this.attachListeners();
    }

    /**
     * Brings a window into focus based on its index in the [windows] array
     * - TODO: Make this based on ID
     * @param {number} index 
     */
    focusWindow(index) {
        for (let window of this.windows) {
            window.windowElement.removeClass("focused");
        }
        this.windows[index].windowElement.addClass("focused");
    }

    /**
     * Attaches event listeners to the DOM for multiple functions
     */
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
                    if (e.clientX <= window.innerWidth && e.clientX > 0) {
                        if (e.clientY <= window.innerHeight && e.clientY > 0) {
                            this.selectedWindow.dragStart();
                            this.selectedWindow.setLocationRelative(e.clientX - this.mousePosition.x, e.clientY - this.mousePosition.y);
                        }
                    }
                }
            }
            this.mousePosition = {
                x: e.clientX,
                y: e.clientY
            };
            return true;
        });

        window.addEventListener("pointerup", (e) => {

            if (this.resizing) {
                this.selectedWindow.windowElement.removeClass("resizing");
            }
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
            this.resizing = false;
            this.dragging = false;
            this.pointerdown = false;
            this.lastClickTime = Date.now();
        });
    }

    /**
     * 
     * @param {string} title Title to be displayed on the window
     * @param {number} x The x position of the window
     * @param {number} y The y position of the window
     * @param {number} width The width of the window
     * @param {number} height The height of the window
     * @returns {WindowJSWindow}
     */
    newWindow(title, x, y, width, height) {
        //console.log(arguments);
        let newWindow = new WindowJSWindow(title, x, y, width, height);
        newWindow.id = this.nextWindowID;
        newWindow.setTemplates(this.rawTemplateHTML, this.rawContentHTML);
        newWindow.buildTemplate();
        this.windows.push(newWindow);
        this.focusWindow(this.windows.length - 1);
        this.nextWindowID++;
        return newWindow;
    }

    /**
     * Removes a window from memory and DOM from ID
     * @param {number} id 
     */
    removeWindow(id) {
        let index = parseInt(id) - 1001;
        let window = this.windows[index];
        document.body.removeChild(window.windowElement);
        this.windows.splice(index, 1);
    }

    /**
     * Do not call this, initializes WindowJS
     */
    async init() {
        this.rawContentHTML = await (await fetch("src/template/example.html")).text();
        this.rawTemplateHTML = await (await fetch("src/template/window.html")).text();
        this.loaded = true;
    }

    /**
     * Onload event, to be overridden
     */
    onload() {

    }

    /**
     * Builds and HTML element from options, do not use externally
     * @param {string} type The element type desired
     * @param {object} data The data to apply to the element
     * @returns {HTMLElement}
     */
    buildElement(type, data) {
        let out;
        switch (type) {
            case "select":
                out = this.builder.buildSelect(...data);
                break;
            case "text":
                out = this.builder.buildParagraph(...data);
                break;
            case "input":
                out = this.builder.buildInput(...data);
                break;
            case "button":
                console.log(data);
                out = this.builder.buildButton(...data);
                break;
            case "container":
                out = this.builder.buildContainer(this, ...data);
                break;
            case "form":
                out = this.builder.buildForm(this, ...data);
                break;
            default:
                return false;
                break;
        }

        return out;
    }

    /**
     * Iterates over WindowJS build data to generate a window
     * @param {object} buildSteps 
     * @returns 
     */
    runBuildSteps(buildSteps) {
        /**
         * @type {WindowJSWindow}
         */
        let win;
        for (let step of buildSteps) {
            let action = step[0];
            step.splice(0, 1);
            if (action == "window") {
                win = this.newWindow(...step);
            } else if (action == "container") {
                win.body.appendChild(this.buildElement(action, step));
            } else {
                let elm = this.buildElement(action, step);
                if (elm) {
                    win.append(elm);
                }
            }
        }
        return win;
    }
}