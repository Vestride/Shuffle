let value = null;
export default () => {
  if (value !== null) {
    return value;
  }

  const element = document.body || document.documentElement;
  const e = document.createElement('div');
  e.style.cssText = 'width:10px;padding:2px;box-sizing:border-box;';
  element.appendChild(e);

  value = window.getComputedStyle(e, null).width === '10px';

  element.removeChild(e);

  return value;
};
