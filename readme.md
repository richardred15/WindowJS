## Window.js (alpha)
#### There's a lot coming with this code base, I just have to actually write it all.

###### WindowJS is a desktop style Window API
###### Generate classically designed window elements


https://richard.works/projects/Window.js/ - Testing Environment

- [ ] Remove example code
	- [ ] Create seperate demo website
- [ ] Individualize Events
- [x] Window resizing
- [ ] Window Element API (Custom handling and/or UI style)
    - [ ] Buttons
        - [ ] Form Compatibility
    - [ ] Checkboxes
        - [ ] Form Compatibility
    - [x] Select
        - [x] Form Compatibility
        - [x] Custom Select dropdowns
        - [x] Dropdown animations
    - [x] Text/Password
        - [x] Form Compatibility
    - [ ] Etc.
- [ ] GUI Editor
    - [ ] Click/Drag elements onto graphical preview
    - [ ] Complex griding system
    - [ ] Generate Javascript for copy/paste into project
- [ ] Remove calls to Global Code
	- [ ] Depend only on "window"
- [x] Window Movement
- [x] Maximize
- [x] Minimize


![Initial Screenshot](https://lh3.googleusercontent.com/v7BoUFXsUCu0gQdb3ckGhIlhReA0rBs_iAqP1neFJmFv6hpB3jJIigAD8JqF941ORnfUpN6eJoeRHb1xGOszxpKL1Pr2OBIttIWXdNyOZr2cKsJngYL9rD53zGOTBrFpvruUBBjVyw=w2400)

```javascript
let winjs = new WindowJS();
let windowOne = winjs.newWindow("Title", x, y, width, height);
windowOne.attach();
```