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
                if (window.isTitleBarClick(e.target)) {
                    this.selectedWindow = window;
                }
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