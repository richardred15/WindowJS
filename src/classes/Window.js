class WindowJS {
    constructor(title = "WindowJS", x, y, width, height) {
        this.title = title;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.html();

    }

    async html() {
        let content = await (await fetch("src/template/example.html")).text();
        let id = "testID123"
        let title = this.title;

        let resp = await fetch("src/template/window.html");
        let text = await resp.text();
        let repl = {
            id: id,
            content: content
        }
        this.rawHTML = this.parseTemplate(text, repl);
        document.body.innerHTML = this.rawHTML;
    }

    parseTemplate(text, repl) {
        for (let name in repl) {
            let val = repl[name];
            console.log(`\${${name}}`, val);
            text = text.replaceAll(`\${${name}}`, val);
        }
        return text;
    }
}