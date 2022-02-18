## Window.js
----
There's a lot coming with this code base, I just have to actually write it all.
----

- Window resizing
- Window Element API
    - Buttons
    - Select
    - Text/Password
    - Etc.
- GUI Editor

![Initial Screenshot][https://photos.app.goo.gl/z7HxhSnPBCjoHRxW9]

```javascript
let winjs = new WindowJS();
let windowOne = winjs.newWindow("Title", x, y, width, height);
document.body.appendChild(windowOne.windowElement);
```