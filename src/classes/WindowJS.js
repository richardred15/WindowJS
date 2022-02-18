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

    attachListeners() {
        window.addEventListener("pointerdown", (e) => {
            this.pointerdown = true;
            this.mousePosition = {
                x: e.clientX,
                y: e.clientY
            };
            for (let window of this.windows) {
                if (!window.minimized && window.isTitleBarClick(e.target)) {
                    this.selectedWindow = window;
                } else if (window.minimized) {
                    window.toggleMinimized();
                }
            }
            if (this.lastClickTime == 0) {
                this.lastClickTime = Date.now();
            }
            e.preventDefault();
        });

        window.addEventListener("blur", (e) => {
            this.dragging = false;
            this.pointerdown = false;
            if (this.selectedWindow) {
                this.selectedWindow.dragStop();
                this.selectedWindow = null;
            }
            e.preventDefault();
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
            e.preventDefault();
        });

        window.addEventListener("pointerup", (e) => {
            this.dragging = false;
            this.pointerdown = false;
            if (this.selectedWindow) {
                this.selectedWindow.dragStop();
                this.selectedWindow = null;
            }
            if (Date.now() - this.lastClickTime < 300) {
                for (let window of this.windows) {
                    if (!window.minimized && window.isTitleBarClick(e.target)) {
                        window.toggleMaximized();
                    }
                }
            }
            this.lastClickTime = Date.now();
            e.preventDefault();
        });
    }

    newWindow(title, x, y, width, height) {
        let newWindow = new Window(title, x, y, width, height);
        newWindow.id = this.nextWindowID;
        newWindow.setTemplates(this.rawTemplateHTML, this.rawContentHTML);
        newWindow.buildTemplate();
        this.windows.push(newWindow);
        this.nextWindowID++;
        return newWindow;
    }

    async init() {
        this.rawContentHTML = await (await fetch("src/template/example.html")).text();
        this.rawTemplateHTML = await (await fetch("src/template/window.html")).text();
    }

    onload() {

    }
}