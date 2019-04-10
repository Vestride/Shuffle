import sinon from 'sinon';

import Shuffle from '../src/shuffle';
import * as fixtures from './fixtures';

describe('shuffle', () => {
  let fixture = null;
  let instance = null;

  function appendFixture(id) {
    const content = fixtures[id].trim();
    const holder = document.createElement('div');
    holder.innerHTML = content;
    const element = holder.firstChild;
    document.body.appendChild(element);
    fixture = element;
  }

  function removeFixture() {
    if (instance && instance.element) {
      instance.destroy();
    }

    if (fixture) {
      fixture.parentNode.removeChild(fixture);
    }

    fixture = null;
    instance = null;
  }

  function id(id) {
    return document.getElementById(id);
  }

  function whenTransitionDoneStub(element, itemCallback, done) {
    setTimeout(done, 0);
  }

  describe('regular fixture', () => {

    beforeEach(() => {
      // Mock the transition end event wrapper.
      sinon.stub(Shuffle.prototype, '_whenTransitionDone').callsFake(whenTransitionDoneStub);

      appendFixture('regular');
    });

    afterEach(() => {
      Shuffle.prototype._whenTransitionDone.restore();
      removeFixture();
    });

    it('should have default options', () => {
      instance = new Shuffle(fixture);
      expect(instance.items.length).toBe(10);
      expect(instance.visibleItems).toBe(10);
      expect(instance.options.group).toBe('all');
      expect(instance.options.speed).toBe(250);
      expect(instance.options.itemSelector).toBe('*');
      expect(instance.options.sizer).toBeNull();
      expect(instance.options.columnWidth).toBe(0);
      expect(instance.options.gutterWidth).toBe(0);
      expect(instance.options.delimiter).toBeNull();
      expect(instance.options.initialSort).toBeNull();
      expect(instance.options.throttleTime).toBe(300);
      expect(instance.id).toBe('shuffle_0');

      expect(instance.isInitialized).toBe(true);
    });

    it('should add classes and default styles', () => {
      instance = new Shuffle(fixture);
      expect(instance.element.classList.contains('shuffle')).toBe(true);

      const styles = window.getComputedStyle(instance.element, null);
      // Will have `position:relative` in a real browser (not JSDom).
      expect(styles.overflow).toBe('hidden');
      // Will have a `containerWidth` > 0 in a real browser (not JSDom).

      instance.items.forEach(({ element, isVisible, scale, point }) => {
        expect(element.classList.contains('shuffle-item')).toBe(true);
        expect(element.classList.contains('shuffle-item--visible')).toBe(true);
        expect(element.style.opacity).toBeDefined();
        expect(element.style.position).toBe('absolute');
        expect(element.style.visibility).toBe('visible');
        expect(isVisible).toBe(true);
        expect(scale).toBe(Shuffle.ShuffleItem.Scale.VISIBLE);
        expect(point.x).toBeDefined();
        expect(point.y).toBeDefined();
      });
    });

    it('should be 3 columns with gutters', () => {
      fixture.style.width = '1000px';

      for (let i = 0; i < fixture.children.length; i++) {
        fixture.children[i].style.width = '300px';
        fixture.children[i].style.height = '150px';
      }

      instance = new Shuffle(fixture, {
        columnWidth: 300,
        gutterWidth: 50,
      });

      expect(instance.colWidth).toBe(350);
      expect(instance.cols).toBe(3);
      expect(instance.positions).toEqual([600, 450, 450]);
    });

    it('can have a function for columns and gutters', () => {
      fixture.style.width = '1000px';

      for (let i = 0; i < fixture.children.length; i++) {
        fixture.children[i].style.width = '300px';
        fixture.children[i].style.height = '150px';
      }

      instance = new Shuffle(fixture, {
        columnWidth(containerWidth) {
          expect(containerWidth).toBe(1000);
          return 300;
        },

        gutterWidth() {
          return 50;
        },
      });

      expect(instance._getGutterSize(1000)).toBe(50);
      expect(instance._getColumnSize(1000, 50)).toBe(350);
      expect(instance.colWidth).toBe(350);
      expect(instance.cols).toBe(3);
      expect(instance.positions).toEqual([600, 450, 450]);
    });

    it('can have a function for columns/gutters and span multiple columns', () => {
      fixture.style.width = '1200px';

      for (let i = 0; i < fixture.children.length; i++) {
        fixture.children[i].style.width = '300px';
        fixture.children[i].style.height = '10px';
      }

      fixture.children[1].style.width = '600px';
      fixture.children[5].style.width = '600px';
      fixture.children[6].style.width = '900px';

      instance = new Shuffle(fixture, {
        columnWidth(containerWidth) {
          expect(containerWidth).toBe(1200);
          return 300;
        },

        gutterWidth() {
          return 0;
        },
      });

      expect(instance._getGutterSize(1200)).toBe(0);
      expect(instance._getColumnSize(1200, 0)).toBe(300);
      expect(instance.colWidth).toBe(300);
      expect(instance.cols).toBe(4);
      expect(instance.positions).toEqual([40, 40, 30, 30]);
    });

    it('can filter by the data attribute', done => {
      instance = new Shuffle(fixture, {
        speed: 0,
      });

      function second() {
        expect(instance.visibleItems).toBe(3);
        const hidden = [3, 4, 5, 6, 7, 8, 10].map(num => id(`item${num}`));

        const visible = [1, 2, 9].map(num => id(`item${num}`));

        hidden.forEach(element => {
          expect(element.classList.contains(Shuffle.Classes.HIDDEN)).toBe(true);
          expect(element.style.visibility).toBe('hidden');
        });

        visible.forEach(element => {
          expect(element.classList.contains(Shuffle.Classes.VISIBLE)).toBe(true);
          expect(element.style.visibility).toBe('visible');
        });

        instance.once(Shuffle.EventType.LAYOUT, third);

        // Filter by green.
        instance.filter('green');
      }

      function third() {
        expect(instance.visibleItems).toBe(2);
        const hidden = [1, 2, 5, 6, 7, 8, 9, 10].map(num => id(`item${num}`));

        const visible = [3, 4].map(num => id(`item${num}`));

        hidden.forEach(element => {
          expect(element.classList.contains(Shuffle.Classes.HIDDEN)).toBe(true);
          expect(element.style.visibility).toBe('hidden');
        });

        visible.forEach(element => {
          expect(element.classList.contains(Shuffle.Classes.VISIBLE)).toBe(true);
          expect(element.style.visibility).toBe('visible');
        });

        done();
      }

      instance.once(Shuffle.EventType.LAYOUT, second);
      instance.filter('design');
    });

    it('can initialize filtered and the category parameter is optional', () => {
      instance = new Shuffle(fixture, {
        speed: 40,
        group: 'design',
      });

      expect(instance.visibleItems).toBe(3);
    });

    it('can initialize sorted', () => {
      const sortObj = {
        by(element) {
          return parseInt(element.getAttribute('data-age'), 10);
        },
      };

      instance = new Shuffle(fixture, {
        speed: 40,
        initialSort: sortObj,
      });

      expect(instance.lastSort).toEqual(sortObj);
    });

    it('can calculate column spans', () => {
      // itemWidth, columnWidth, columns, threshold
      expect(Shuffle.__getColumnSpan(50, 100, 3, 0)).toBe(1);
      expect(Shuffle.__getColumnSpan(200, 100, 3, 0)).toBe(2);
      expect(Shuffle.__getColumnSpan(200, 200, 3, 0)).toBe(1);
      expect(Shuffle.__getColumnSpan(300, 100, 3, 0)).toBe(3);

      // Column span should not be larger than the number of columns.
      expect(Shuffle.__getColumnSpan(300, 50, 3, 0)).toBe(3);

      // Fix for percentage values.
      expect(Shuffle.__getColumnSpan(100.02, 100, 4, 0)).toBe(2);
      expect(Shuffle.__getColumnSpan(100.02, 100, 4, 0.01)).toBe(1);
      expect(Shuffle.__getColumnSpan(99.98, 100, 4, 0.01)).toBe(1);
    });

    it('can calculate column sets', () => {
      // getAvailablePositions(positions, columnSpan, columns)
      const positions = [150, 0, 0, 0];
      expect(Shuffle.__getAvailablePositions(positions, 1, 4)).toEqual([150, 0, 0, 0]);
      expect(Shuffle.__getAvailablePositions(positions, 2, 4)).toEqual([150, 0, 0]);
    });

    it('can center already-positioned items', () => {
      // 4-2-1 even heights
      expect(Shuffle.__getCenteredPositions([
        new Shuffle.Rect(0, 0, 250, 100, 0),
        new Shuffle.Rect(250, 0, 250, 100, 1),
        new Shuffle.Rect(500, 0, 250, 100, 2),
        new Shuffle.Rect(750, 0, 250, 100, 3),
        new Shuffle.Rect(0, 100, 600, 100, 4),
        new Shuffle.Rect(600, 100, 300, 100, 5),
        new Shuffle.Rect(0, 200, 250, 100, 6),
      ], 1000)).toEqual([
        new Shuffle.Point(0, 0),
        new Shuffle.Point(250, 0),
        new Shuffle.Point(500, 0),
        new Shuffle.Point(750, 0),
        new Shuffle.Point(50, 100),
        new Shuffle.Point(650, 100),
        new Shuffle.Point(375, 200),
      ]);

      // 4 columns:
      // 2x2 1x1
      // 2x1
      // Centers the first row, but then finds that the 3rd item will overlap
      // the 2x2 and resets the first row.
      expect(Shuffle.__getCenteredPositions([
        new Shuffle.Rect(0, 0, 500, 200, 0),
        new Shuffle.Rect(500, 0, 250, 100, 1),
        new Shuffle.Rect(500, 100, 500, 100, 2),
      ], 1000)).toEqual([
        new Shuffle.Point(0, 0),
        new Shuffle.Point(500, 0),
        new Shuffle.Point(500, 100),
      ]);
    });

    it('can get an element option', () => {
      instance = new Shuffle(fixture);
      const first = fixture.firstElementChild;

      expect(instance._getElementOption(first)).toBe(first);
      expect(instance._getElementOption('#item1')).toBe(first);
      expect(instance._getElementOption('#hello-world')).toBeNull();
      expect(instance._getElementOption(null)).toBeNull();
      expect(instance._getElementOption(undefined)).toBeNull();
      expect(instance._getElementOption(() => first)).toBeNull();
    });

    it('can test elements against filters', () => {
      instance = new Shuffle(fixture);

      const first = fixture.firstElementChild;
      expect(instance._doesPassFilter('design', first)).toBe(true);
      expect(instance._doesPassFilter('black', first)).toBe(false);

      expect(instance._doesPassFilter(element => {
        expect(element).toBeDefined();
        return element.getAttribute('data-age') === '21';
      }, first)).toBe(true);

      expect(instance._doesPassFilter(element => element.getAttribute('data-age') === '22', first)).toBe(false);

      // Arrays.
      expect(instance._doesPassFilter(['design'], first)).toBe(true);
      expect(instance._doesPassFilter(['red'], first)).toBe(true);
      expect(instance._doesPassFilter(['design', 'black'], first)).toBe(true);

      // Change filter mode.
      instance.options.filterMode = Shuffle.FilterMode.ALL;
      expect(instance._doesPassFilter(['design'], first)).toBe(true);
      expect(instance._doesPassFilter(['design', 'red'], first)).toBe(true);
      expect(instance._doesPassFilter(['design', 'black'], first)).toBe(false);
    });

    it('will maintain the last sort object', () => {
      instance = new Shuffle(fixture);
      const initialSort = instance.lastSort;

      instance.sort();
      expect(instance.lastSort).toEqual(initialSort);

      instance.sort({ glen: true });
      expect(instance.lastSort).toEqual({ glen: true });

      instance.sort();
      expect(instance.lastSort).toEqual({ glen: true });

    });

    it('should reset columns', () => {
      instance = new Shuffle(fixture);

      // instance.cols will be > 0 in real browsers.
      instance._resetCols();

      const positions = new Array(instance.cols);
      for (let i = 0; i < instance.cols; i++) {
        positions[i] = 0;
      }

      expect(instance.positions).toEqual(positions);
    });

    it('should destroy properly', () => {
      instance = new Shuffle(fixture);
      instance.destroy();

      expect(instance.element).toBeNull();
      expect(instance.items).toHaveLength(0);
      expect(instance.options.sizer).toBeNull();
      expect(instance.isDestroyed).toBe(true);

      expect(fixture.classList.contains('shuffle')).toBe(false);

      Array.from(fixture.children).forEach(child => {
        expect(child.classList.contains('shuffle-item')).toBe(false);
        expect(child.classList.contains('shuffle-item--visible')).toBe(false);
        expect(child.classList.contains('shuffle-item--hidden')).toBe(false);
      });
    });

    it('should not update or shuffle when disabled or destroyed', () => {
      instance = new Shuffle(fixture);
      const update = sinon.spy(instance, 'update');
      const _filter = sinon.spy(instance, '_filter');

      instance.disable();

      instance.filter('design');

      expect(_filter.called).toBe(false);
      expect(update.called).toBe(false);

      instance.enable(false);

      instance.destroy();
      instance._onResize();
      expect(update.called).toBe(false);
    });

    it('should still update when the container is the same size', () => {
      instance = new Shuffle(fixture);
      const update = sinon.spy(instance, 'update');

      instance._onResize();

      expect(update.called).toBe(true);
    });

    describe('removing elements', () => {
      let children;

      beforeEach(() => {
        children = Array.from(fixture.children);
      });

      afterEach(() => {
        children = null;
      });

      it('can remove items', done => {
        instance = new Shuffle(fixture, {
          speed: 16,
        });

        instance.once(Shuffle.EventType.REMOVED, ({ shuffle, collection }) => {
          expect(shuffle.visibleItems).toBe(8);
          expect(collection[0].id).toBe('item1');
          expect(collection[1].id).toBe('item2');
          expect(shuffle.element.children).toHaveLength(8);
          expect(instance.isTransitioning).toBe(false);
          done();
        });

        const itemsToRemove = children.slice(0, 2);
        instance.remove(itemsToRemove);
      });

      it('can remove items without transforms', done => {
        instance = new Shuffle(fixture, {
          speed: 100,
          useTransforms: false,
        });

        instance.once(Shuffle.EventType.REMOVED, ({ shuffle, collection }) => {
          expect(shuffle.visibleItems).toBe(8);
          expect(collection[0].id).toBe('item2');
          expect(collection[1].id).toBe('item3');
          expect(shuffle.element.children).toHaveLength(8);
          expect(shuffle.isTransitioning).toBe(false);
          done();
        });

        const itemsToRemove = children.slice(1, 3);
        instance.remove(itemsToRemove);
      });
    });

    it('can get the real width of an element which is scaled', () => {
      const div = document.createElement('div');
      div.style.cssText = 'width:100px;height:100px;';
      div.style.transform = 'translate(0px,0px) scale(0.5)';

      document.body.appendChild(div);

      expect(Shuffle.getSize(div, false).width).toBe(100);
      expect(Shuffle.getSize(div, true).width).toBe(100);

      expect(Shuffle.getSize(div, false).height).toBe(100);
      expect(Shuffle.getSize(div, true).height).toBe(100);

      div.style.marginLeft = '10px';
      div.style.marginRight = '20px';
      div.style.marginTop = '30px';
      div.style.marginBottom = '40px';

      expect(Shuffle.getSize(div, false).width).toBe(100);
      expect(Shuffle.getSize(div, true).width).toBe(130);

      expect(Shuffle.getSize(div, false).height).toBe(100);
      expect(Shuffle.getSize(div, true).height).toBe(170);

      document.body.removeChild(div);
    });

    describe('inserting elements', () => {
      const items = [];

      beforeEach(() => {
        const eleven = document.createElement('div');
        eleven.className = 'item';
        eleven.setAttribute('data-age', 36);
        eleven.setAttribute('data-groups', '["ux", "black"]');
        eleven.id = 'item11';
        eleven.textContent = 'Person 11';

        const twelve = document.createElement('div');
        twelve.className = 'item';
        twelve.setAttribute('data-age', 37);
        twelve.setAttribute('data-groups', '["strategy", "blue"]');
        twelve.id = 'item12';
        twelve.textContent = 'Person 12';

        items.push(eleven, twelve);

        instance = new Shuffle(fixture, {
          speed: 100,
          group: 'black',
        });
      });

      afterEach(() => {
        items.length = 0;
      });

      it('can add items', done => {
        fixture.appendChild(items[0]);
        fixture.appendChild(items[1]);
        instance.add(items);

        // Already 2 in the items, plus number 11.
        expect(instance.visibleItems).toBe(3);
        expect(instance.items).toHaveLength(12);

        instance.once(Shuffle.EventType.LAYOUT, () => {
          done();
        });
      });

      it('can prepend items', done => {
        fixture.insertBefore(items[1], fixture.firstElementChild);
        fixture.insertBefore(items[0], fixture.firstElementChild);
        instance.add(items);

        expect(instance.items[0].element).toBe(items[0]);
        expect(instance.items[1].element).toBe(items[1]);
        expect(instance.items).toHaveLength(12);

        instance.once(Shuffle.EventType.LAYOUT, () => {
          done();
        });
      });

      it('can reset items', () => {
        fixture.textContent = '';
        fixture.appendChild(items[0]);
        fixture.appendChild(items[1]);

        instance.resetItems();

        expect(instance.isInitialized).toBe(true);
        expect(instance.items[0].element).toBe(items[0]);
        expect(instance.items[1].element).toBe(items[1]);
        expect(instance.items).toHaveLength(2);
      });

    });
  });

  describe('delimiter fixture', () => {
    beforeEach(() => {
      // Mock the transition end event wrapper.
      sinon.stub(Shuffle.prototype, '_whenTransitionDone').callsFake(whenTransitionDoneStub);

      appendFixture('delimiter');
    });

    afterEach(() => {
      Shuffle.prototype._whenTransitionDone.restore();
      removeFixture();
    });

    it('can have a custom delimiter', () => {
      instance = new Shuffle(fixture, {
        delimiter: ',',
        group: 'design',
      });

      expect(instance.visibleItems).toBe(3);
    });

    it('can use the old misspelled delimiter option', () => {
      instance = new Shuffle(fixture, {
        delimeter: ',',
        group: 'design',
      });

      expect(instance.visibleItems).toBe(3);
    });
  });

  describe('Custom shuffle item styles', () => {
    const original = Shuffle.ShuffleItem.Css;

    beforeEach(() => {
      appendFixture('regular');
    });

    afterEach(() => {
      Shuffle.ShuffleItem.Css = original;
      removeFixture();
    });

    it('will apply before and after styles even if the item will not move', () => {
      Shuffle.ShuffleItem.Css.INITIAL.opacity = 0;
      instance = new Shuffle(fixture, { speed: 0 });

      // The layout method will have already set styles to their 'after' states
      // upon initialization. Reset them here.
      instance.items.forEach(item => {
        item.applyCss(Shuffle.ShuffleItem.Css.INITIAL);
      });

      instance.items.forEach(({ element }) => {
        expect(element.style.opacity).toBe('0');
      });

      instance._layout(instance.items);
      instance._processQueue();

      instance.items.forEach(({ element }) => {
        expect(element.style.opacity).toBe('1');
      });
    });
  });

  describe('the sorter', () => {
    let items;
    let clone;

    beforeEach(() => {
      appendFixture('regular');

      items = Array.from(fixture.children).map(element => ({
        element
      }));

      clone = Array.from(items);
    });

    afterEach(() => {
      items.length = 0;
      clone.length = 0;
      removeFixture();
    });

    it('will catch empty objects', () => {
      expect(Shuffle.__sorter({})).toEqual([]);
    });

    it('can randomize the elements', () => {
      expect(items).toHaveLength(10);
      expect(Shuffle.__sorter(items)).toEqual(items);

      expect(Shuffle.__sorter(clone, { randomize: true })).not.toEqual(items);
    });

    it('can sort by a function', () => {
      clone.sort((a, b) => {
        const age1 = parseInt(a.element.getAttribute('data-age'), 10);
        const age2 = parseInt(b.element.getAttribute('data-age'), 10);
        return age1 - age2;
      });

      const result = Shuffle.__sorter(items, {
        by(element) {
          expect(element).toBeDefined();
          expect(element.nodeType).toBe(1);
          return parseInt(element.getAttribute('data-age'), 10);
        },
      });

      expect(result).toEqual(clone);
    });

    it('can sort by a function and reverse it', () => {
      clone.sort((a, b) => {
        const age1 = parseInt(a.element.getAttribute('data-age'), 10);
        const age2 = parseInt(b.element.getAttribute('data-age'), 10);
        return age1 - age2;
      }).reverse();

      const result = Shuffle.__sorter(items, {
        reverse: true,
        by(element) {
          return parseInt(element.getAttribute('data-age'), 10);
        },
      });

      expect(result).toEqual(clone);
    });

    it('will revert to DOM order if the `by` function returns undefined', () => {
      let count = 0;
      expect(Shuffle.__sorter(items, {
        by() {
          count++;
          return count < 5 ? Math.random() : undefined;
        },
      })).toEqual(clone);
    });

    it('can sort things to the top', () => {
      items = items.slice(0, 4);
      const final = [items[1], items[0], items[3], items[2]];
      expect(Shuffle.__sorter(items, {
        by(element) {
          const age = parseInt(element.getAttribute('data-age'), 10);
          if (age === 50) {
            return 'sortFirst';
          } else {
            return age;
          }
        },
      })).toEqual(final);
    });

    it('can sort things to the bottom', () => {
      items = items.slice(0, 4);
      const final = [items[0], items[2], items[1], items[3]];
      expect(Shuffle.__sorter(items, {
        by(element) {
          const age = parseInt(element.getAttribute('data-age'), 10);
          if (age === 27) {
            return 'sortLast';
          } else {
            return age;
          }
        },
      })).toEqual(final);
    });

    it('can have a custom sort comparator', () => {
      const final = [
        clone[0], // design, 21
        clone[8], // design, 28
        clone[1], // design, 50
        clone[6], // newbiz, 42
        clone[2], // strategy, 29
        clone[9], // technology, 25
        clone[7], // technology, 31
        clone[5], // ux, 23
        clone[3], // ux, 27
        clone[4], // ux, 35
      ];
      expect(Shuffle.__sorter(items, {
        compare(a, b) {
          // Sort by first group, then by age.
          const groupA = JSON.parse(a.element.getAttribute('data-groups'))[0];
          const groupB = JSON.parse(b.element.getAttribute('data-groups'))[0];
          if (groupA > groupB) {
            return 1;
          }
          if (groupA < groupB) {
            return -1;
          }

          // At this point, the group strings are the exact same. Test the age.
          const ageA = parseInt(a.element.getAttribute('data-age'), 10);
          const ageB = parseInt(b.element.getAttribute('data-age'), 10);
          return ageA - ageB;
        },
      })).toEqual(final);
    });

  });
});
