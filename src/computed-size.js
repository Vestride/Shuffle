const element = document.body || document.documentElement;
const e = document.createElement('div');
e.style.cssText = 'width:10px;padding:2px;box-sizing:border-box;';
element.appendChild(e);

const { width } = window.getComputedStyle(e, null);
const ret = width === '10px';

element.removeChild(e);

export default ret;
