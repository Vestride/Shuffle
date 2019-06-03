import Point from './point';
import Classes from './classes';

let id = 0;

class ShuffleItem {
  constructor(element) {
    id += 1;
    this.id = id;
    this.element = element;

    /**
     * Used to separate items for layout and shrink.
     */
    this.isVisible = true;

    /**
     * Used to determine if a transition will happen. By the time the _layout
     * and _shrink methods get the ShuffleItem instances, the `isVisible` value
     * has already been changed by the separation methods, so this property is
     * needed to know if the item was visible/hidden before the shrink/layout.
     */
    this.isHidden = false;
  }

  show() {
    this.isVisible = true;
    this.element.classList.remove(Classes.HIDDEN);
    this.element.classList.add(Classes.VISIBLE);
    this.element.removeAttribute('aria-hidden');
  }

  hide() {
    this.isVisible = false;
    this.element.classList.remove(Classes.VISIBLE);
    this.element.classList.add(Classes.HIDDEN);
    this.element.setAttribute('aria-hidden', true);
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
    Object.keys(obj).forEach((key) => {
      this.element.style[key] = obj[key];
    });
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
    willChange: 'transform',
  },
  VISIBLE: {
    before: {
      opacity: 1,
      visibility: 'visible',
    },
    after: {
      transitionDelay: '',
    },
  },
  HIDDEN: {
    before: {
      opacity: 0,
    },
    after: {
      visibility: 'hidden',
      transitionDelay: '',
    },
  },
};

ShuffleItem.Scale = {
  VISIBLE: 1,
  HIDDEN: 0.001,
};

export default ShuffleItem;
