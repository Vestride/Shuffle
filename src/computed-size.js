
let element = document.body || document.documentElement;
let e = document.createElement('div');
e.style.cssText = 'width:10px;padding:2px;box-sizing:border-box;';
element.appendChild(e);

let width = window.getComputedStyle(e, null).width;
let ret = width === '10px';

element.removeChild(e);

export default ret;
