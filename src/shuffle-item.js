import Point from './point';
import Classes from './classes';

let id = 0;

class ShuffleItem {
  constructor(element) {
    this.id = id++;
    this.element = element;
    this.isVisible = true;
  }

  show() {
    this.isVisible = true;
    this.element.classList.remove(Classes.HIDDEN);
    this.element.classList.add(Classes.VISIBLE);
  }

  hide() {
    this.isVisible = false;
    this.element.classList.remove(Classes.VISIBLE);
    this.element.classList.add(Classes.HIDDEN);
  }

  init() {
    this.addClasses([Classes.SHUFFLE_ITEM, Classes.VISIBLE]);
    this.applyCss(ShuffleItem.Css.INITIAL);
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
      Classes.HIDDEN,
      Classes.VISIBLE,
      Classes.SHUFFLE_ITEM,
    ]);

    this.element.removeAttribute('style');
    this.element = null;
  }
}

ShuffleItem.Css = {
  INITIAL: {
    position: 'absolute',
    top: 0,
    left: 0,
    visibility: 'visible',
    'will-change': 'transform',
  },
  VISIBLE: {
    before: {
      opacity: 1,
      visibility: 'visible',
    },
    after: {},
  },
  HIDDEN: {
    before: {
      opacity: 0,
    },
    after: {
      visibility: 'hidden',
    },
  },
};

ShuffleItem.Scale = {
  VISIBLE: 1,
  HIDDEN: 0.001,
};

export default ShuffleItem;
