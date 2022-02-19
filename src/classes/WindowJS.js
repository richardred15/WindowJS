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
            if (this.selectedWindow) {
                this.selectedWindow.dragStop();
                this.selectedWindow = null;
            }

        });

        window.addEventListener("pointermove", (e) => {

            if (this.pointerdown && !this.dragging) {
                this.dragging = true;
                if (this.selectedWindow && this.selectedWindow.maximized) {
                    this.selectedWindow.toggleMaximized();
                    /* let diff = (window.innerWidth - e.clientX) / window.innerWidth;
                    let x = e.clientX - (this.selectedWindow.width - (this.selectedWindow.width * diff));
                    console.log(diff, x); */
                    this.selectedWindow.setLocation(e.clientX - (this.selectedWindow.width / 2), e.clientY - 15);
                }
            } else if (this.dragging) {
                if (this.selectedWindow) {
                    this.selectedWindow.dragStart();
                    this.selectedWindow.setLocationRelative(e.clientX - this.mousePosition.x, e.clientY - this.mousePosition.y);
                }
            }
            this.mousePosition = {
                x: e.clientX,
                y: e.clientY
            };

        });

        window.addEventListener("pointerup", (e) => {
            this.dragging = false;
            this.pointerdown = false;
            if (this.selectedWindow) {
                this.selectedWindow.dragStop();
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