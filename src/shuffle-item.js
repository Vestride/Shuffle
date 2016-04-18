import Point from './point';
import Classes from './classes';

class ShuffleItem {
  constructor(element) {
    this.element = element;
    this.isVisible = true;
  }

  reveal() {
    this.isVisible = true;
    this.element.classList.remove(Classes.CONCEALED);
    this.element.classList.add(Classes.FILTERED);
  }

  conceal() {
    this.isVisible = false;
    this.element.classList.remove(Classes.FILTERED);
    this.element.classList.add(Classes.CONCEALED);
  }

  init() {
    this.addClasses([Classes.SHUFFLE_ITEM, Classes.FILTERED]);
    this.applyCss(ShuffleItem.css);
    this.scale = ShuffleItem.Scale.VISIBLE;
    this.point = new Point();
  }

  addClasses(classes) {
    classes.forEach((className) => {
      this.element.classList.add(className);
    });
  }

  removeClasses(classes) {
    classes.forEach((className) => {
      this.element.classList.remove(className);
    });
  }

  applyCss(obj) {
    for (var key in obj) {
      this.element.style[key] = obj[key];
    }
  }

  dispose() {
    this.removeClasses([
      Classes.CONCEALED,
      Classes.FILTERED,
      Classes.SHUFFLE_ITEM,
    ]);

    this.element.removeAttribute('style');
    this.element = null;
  }
}

ShuffleItem.css = {
  position: 'absolute',
  top: 0,
  left: 0,
  visibility: 'visible',
  'will-change': 'transform',
};

ShuffleItem.Scale = {
  VISIBLE: 1,
  FILTERED: 0.001,
};

export default ShuffleItem;
