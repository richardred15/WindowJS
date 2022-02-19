let potatoSelectOptions = {
    "potato": "Potato",
    "noPotato": "Non-Potato"
}

function buildSelect(name = "testing", opts) {
    let container = document.createElement("div");
    container.className = "windowJSSelectContainer";
    let select = document.createElement("div");
    select.className = "windowJSSelect";
    select.setAttribute('value', '');
    let title = document.createElement("div");
    title.className = "windowJSSelectTitle";
    title.onclick = function () {
        this.parentElement.setAttribute('value', '');
        this.parentElement.parentElement.toggleClass('open');
    };
    title.innerHTML = "Select...";
    let inputElement = document.createElement("select");
    inputElement.setAttribute("name", name);
    inputElement.className = "windowJSSelectInput";

    let options = [];
    for (let opt in opts) {
        let text = opts[opt];
        let option = document.createElement("div");
        option.className = "windowJSSelectOption";
        option.setAttribute("value", opt);
        option.onclick = function () {
            select.querySelector('.windowJSSelectTitle').innerHTML = this.innerHTML;
            select.parentElement.toggleClass('open');
            select.setAttribute('value', opt);
            inputElement.setAttribute("value", opt);
        }
        option.innerHTML = text;
        options.push(option);
    }
    select.appendChild(title);
    for (let option of options) {
        select.appendChild(option);
    }
    container.appendChild(select);
    container.appendChild(inputElement);

    return container;
}