/**
 * A simple class for generating DOM elements
 * @typedef {Builder}
 */
class Builder {
    constructor() {

    }

    buildContainer(winjs, name, data) {
        let container = document.createElement("div");
        container.className = `windowJSContainer ${name}`;
        for (let piece of data) {
            let type = piece[0];
            piece.splice(0, 1);
            container.appendChild(winjs.buildElement(type, piece));
        }
        return container;
    }

    buildForm(winjs, action, data) {
        let form = document.createElement("form");
        form.className = 'windowJSForm';
        //form.setAttribute('submit', action);
        if (typeof action == "string") {
            form.setAttribute("action", action);
        } else {
            form.onsubmit = function (e) {
                return action(form);
            };
        }
        for (let piece of data) {
            let type = piece[0];
            piece.splice(0, 1);
            form.appendChild(winjs.buildElement(type, piece));
        }
        return form;
    }

    buildButton(text = "Button", onclick = () => {}) {
        let btn = document.createElement("div");
        btn.className = "windowJSButton";
        btn.innerHTML = text;
        btn.onclick = function () {
            onclick(btn);
        };
        return btn;
    }

    buildInput(type, name, placeholder = "") {
        let input = document.createElement("input");
        input.setAttribute("type", type);
        input.setAttribute("name", name);
        input.setAttribute("placeholder", placeholder);
        return input;
    }

    buildParagraph(text) {
        let para = document.createElement("div");
        para.className = "windowJSTextParagraph";
        para.innerHTML = text;
        return para;
    }

    buildSelect(name = "testing", opts) {
        let container = document.createElement("div");
        container.className = "windowJSSelectContainer";
        let select = document.createElement("div");
        select.className = "windowJSSelect";
        select.setAttribute('value', '');
        let title = document.createElement("div");
        title.className = "windowJSSelectTitle";
        title.onclick = function (e) {
            let state = this.parentElement.parentElement.hasClass('open');
            document.querySelectorAll(".windowJSSelectContainer.open").forEach((elm) => {
                elm.removeClass("open");
            });
            if (!state) this.parentElement.parentElement.toggleClass('open');
        };
        title.innerHTML = "Select...";
        let inputElement = document.createElement("select");
        inputElement.setAttribute("name", name);
        inputElement.className = "windowJSSelectInput";

        let options = [];
        let inputOptions = [];
        for (let opt in opts) {
            let text = opts[opt];
            let option = document.createElement("div");
            let inputOption = document.createElement("option");
            //inputOption.setAttribute("name", opt);
            inputOption.setAttribute("value", opt);
            option.className = "windowJSSelectOption";
            inputOptions.push(inputOption);
            option.setAttribute("value", opt);
            option.onclick = function () {
                select.querySelector('.windowJSSelectTitle').innerHTML = this.innerHTML;
                select.parentElement.toggleClass('open');
                select.setAttribute('value', opt);
                inputElement.value = opt;
                //console.log(opt);
                inputElement.setAttribute("value", opt);
            }
            option.innerHTML = text;
            options.push(option);
        }
        select.appendChild(title);
        for (let option of options) {
            select.appendChild(option);
        }
        for (let inputOption of inputOptions) {
            inputElement.appendChild(inputOption);
        }
        container.appendChild(select);
        container.appendChild(inputElement);

        return container;
    }
}