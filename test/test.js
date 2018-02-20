/* globals describe, it, beforeEach, afterEach */
/* jshint expr: true */

'use strict';

var expect = window.chai.expect;
var sinon = window.sinon;

describe('shuffle', function () {

  var Shuffle = window.Shuffle;
  var fixtures = {};
  var fixture;
  var instance;

  function getFixture(id) {
    return new Promise(function (resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.responseText);
      };

      xhr.onerror = reject;

      xhr.open('GET', 'fixtures/' + id + '.html');
      xhr.send();
    });
  }

  function appendFixture(id) {

    function insert(content) {
      content = content.trim();
      var holder = document.createElement('div');
      holder.innerHTML = content;
      var element = holder.firstChild;
      document.body.appendChild(element);
      fixture = element;
    }

    if (fixtures[id]) {
      insert(fixtures[id]);
      return Promise.resolve();
    } else {
      return getFixture(id).then(function (html) {
        fixtures[id] = html;
        insert(html);
      });
    }
  }

  function removeFixture() {
    if (instance && instance.element) {
      instance.destroy();
    }

    if (fixture) {
      fixture.parentNode.removeChild(fixture);
    }

    instance = null;
    fixture = null;
  }

  function id(id) {
    return document.getElementById(id);
  }

  function whenTransitionDoneStub(element, itemCallback, done) {
    setTimeout(done, 0);
  }

  describe('regular fixture', function () {

    beforeEach(function (done) {
      // Mock the transition end event wrapper.
      sinon.stub(Shuffle.prototype, '_whenTransitionDone').callsFake(whenTransitionDoneStub);

      appendFixture('regular').then(done);
    });

    afterEach(function () {
      Shuffle.prototype._whenTransitionDone.restore();
      removeFixture();
    });

    it('should have default options', function () {
      instance = new Shuffle(fixture);
      expect(instance.items.length).to.equal(10);
      expect(instance.visibleItems).to.equal(10);
      expect(instance.options.group).to.equal('all');
      expect(instance.options.speed).to.equal(250);
      expect(instance.options.itemSelector).to.equal('*');
      expect(instance.options.sizer).to.equal(null);
      expect(instance.options.columnWidth).to.equal(0);
      expect(instance.options.gutterWidth).to.equal(0);
      expect(instance.options.delimeter).to.equal(null);
      expect(instance.options.initialSort).to.equal(null);
      expect(instance.options.throttleTime).to.equal(300);
      expect(instance.id).to.equal('shuffle_0');

      expect(instance.isInitialized).to.be.true;
    });

    it('should add classes and default styles', function () {
      instance = new Shuffle(fixture);
      expect(instance.element).to.have.class('shuffle');

      var styles = window.getComputedStyle(instance.element, null);
      expect(styles.position).to.equal('relative');
      expect(styles.overflow).to.equal('hidden');
      expect(instance.containerWidth).not.to.equal(0);

      instance.items.forEach(function (item) {
        expect(item.element).to.have.class('shuffle-item');
        expect(item.element).to.have.class('shuffle-item--visible');
        expect(item.element.style.opacity).to.be.exist;
        expect(item.element.style.position).to.equal('absolute');
        expect(item.element.style.visibility).to.equal('visible');
        expect(item.isVisible).to.equal(true);
        expect(item.scale).to.equal(Shuffle.ShuffleItem.Scale.VISIBLE);
        expect(item.point.x).to.be.exist;
        expect(item.point.y).to.be.exist;
      });
    });

    it('should be 3 columns with gutters', function () {
      fixture.style.width = '1000px';

      for (var i = 0; i < fixture.children.length; i++) {
        fixture.children[i].style.width = '300px';
        fixture.children[i].style.height = '150px';
      }

      instance = new Shuffle(fixture, {
        columnWidth: 300,
        gutterWidth: 50,
      });

      expect(instance.colWidth).to.equal(350);
      expect(instance.cols).to.equal(3);
      expect(instance.positions).to.deep.equal([600, 450, 450]);
    });

    it('can have a function for columns and gutters', function () {
      fixture.style.width = '1000px';

      for (var i = 0; i < fixture.children.length; i++) {
        fixture.children[i].style.width = '300px';
        fixture.children[i].style.height = '150px';
      }

      instance = new Shuffle(fixture, {
        columnWidth: function (containerWidth) {
          expect(containerWidth).to.equal(1000);
          return 300;
        },

        gutterWidth: function () {
          return 50;
        },
      });

      expect(instance._getGutterSize(1000)).to.equal(50);
      expect(instance._getColumnSize(1000, 50)).to.equal(350);
      expect(instance.colWidth).to.equal(350);
      expect(instance.cols).to.equal(3);
      expect(instance.positions).to.deep.equal([600, 450, 450]);
    });

    it('can have a function for columns/gutters and span multiple columns', function () {
      fixture.style.width = '1200px';

      for (var i = 0; i < fixture.children.length; i++) {
        fixture.children[i].style.width = '300px';
        fixture.children[i].style.height = '10px';
      }

      fixture.children[1].style.width = '600px';
      fixture.children[5].style.width = '600px';
      fixture.children[6].style.width = '900px';

      instance = new Shuffle(fixture, {
        columnWidth: function (containerWidth) {
          expect(containerWidth).to.equal(1200);
          return 300;
        },

        gutterWidth: function () {
          return 0;
        },
      });

      expect(instance._getGutterSize(1200)).to.equal(0);
      expect(instance._getColumnSize(1200, 0)).to.equal(300);
      expect(instance.colWidth).to.equal(300);
      expect(instance.cols).to.equal(4);
      expect(instance.positions).to.deep.equal([40, 40, 30, 30]);
    });

    it('can filter by the data attribute', function (done) {
      instance = new Shuffle(fixture, {
        speed: 0,
      });

      function second() {
        expect(instance.visibleItems).to.equal(3);
        var hidden = [3, 4, 5, 6, 7, 8, 10].map(function (num) {
          return id('item' + num);
        });

        var visible = [1, 2, 9].map(function (num) {
          return id('item' + num);
        });

        hidden.forEach(function (element) {
          expect(element).to.have.class(Shuffle.Classes.HIDDEN);
          expect(element.style.visibility).to.equal('hidden');
        });

        visible.forEach(function (element) {
          expect(element).to.have.class(Shuffle.Classes.VISIBLE);
          expect(element.style.visibility).to.equal('visible');
        });

        instance.once(Shuffle.EventType.LAYOUT, third);

        // Filter by green.
        instance.filter('green');
      }

      function third() {
        expect(instance.visibleItems).to.equal(2);
        var hidden = [1, 2, 5, 6, 7, 8, 9, 10].map(function (num) {
          return id('item' + num);
        });

        var visible = [3, 4].map(function (num) {
          return id('item' + num);
        });

        hidden.forEach(function (element) {
          expect(element).to.have.class(Shuffle.Classes.HIDDEN);
          expect(element.style.visibility).to.equal('hidden');
        });

        visible.forEach(function (element) {
          expect(element).to.have.class(Shuffle.Classes.VISIBLE);
          expect(element.style.visibility).to.equal('visible');
        });

        done();
      }

      instance.once(Shuffle.EventType.LAYOUT, second);
      instance.filter('design');
    });

    it('can initialize filtered and the category parameter is optional', function () {
      instance = new Shuffle(fixture, {
        speed: 40,
        group: 'design',
      });

      expect(instance.visibleItems).to.equal(3);
    });

    it('can initialize sorted', function () {
      var sortObj = {
        by: function (element) {
          return parseInt(element.getAttribute('data-age'), 10);
        },
      };

      instance = new Shuffle(fixture, {
        speed: 40,
        initialSort: sortObj,
      });

      expect(instance.lastSort).to.deep.equal(sortObj);
    });

    it('can calculate column spans', function () {
      // itemWidth, columnWidth, columns, threshold
      expect(Shuffle.__getColumnSpan(50, 100, 3, 0)).to.equal(1);
      expect(Shuffle.__getColumnSpan(200, 100, 3, 0)).to.equal(2);
      expect(Shuffle.__getColumnSpan(200, 200, 3, 0)).to.equal(1);
      expect(Shuffle.__getColumnSpan(300, 100, 3, 0)).to.equal(3);

      // Column span should not be larger than the number of columns.
      expect(Shuffle.__getColumnSpan(300, 50, 3, 0)).to.equal(3);

      // Fix for percentage values.
      expect(Shuffle.__getColumnSpan(100.02, 100, 4, 0)).to.equal(2);
      expect(Shuffle.__getColumnSpan(100.02, 100, 4, 0.01)).to.equal(1);
      expect(Shuffle.__getColumnSpan(99.98, 100, 4, 0.01)).to.equal(1);
    });

    it('can calculate column sets', function () {
      // getAvailablePositions(positions, columnSpan, columns)
      var positions = [150, 0, 0, 0];
      expect(Shuffle.__getAvailablePositions(positions, 1, 4)).to.deep.equal([150, 0, 0, 0]);
      expect(Shuffle.__getAvailablePositions(positions, 2, 4)).to.deep.equal([150, 0, 0]);
    });

    it('can center already-positioned items', function() {
      // 4-2-1 even heights
      expect(Shuffle.__getCenteredPositions([
        new Shuffle.Rect(0, 0, 250, 100, 0),
        new Shuffle.Rect(250, 0, 250, 100, 1),
        new Shuffle.Rect(500, 0, 250, 100, 2),
        new Shuffle.Rect(750, 0, 250, 100, 3),
        new Shuffle.Rect(0, 100, 600, 100, 4),
        new Shuffle.Rect(600, 100, 300, 100, 5),
        new Shuffle.Rect(0, 200, 250, 100, 6),
      ], 1000)).to.deep.equal([
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
      ], 1000)).to.deep.equal([
        new Shuffle.Point(0, 0),
        new Shuffle.Point(500, 0),
        new Shuffle.Point(500, 100),
      ]);
    });

    it('can get an element option', function () {
      instance = new Shuffle(fixture);
      var first = fixture.firstElementChild;

      expect(instance._getElementOption(first)).to.equal(first);
      expect(instance._getElementOption('#item1')).to.equal(first);
      expect(instance._getElementOption('#hello-world')).to.be.null;
      expect(instance._getElementOption(null)).to.be.null;
      expect(instance._getElementOption(undefined)).to.be.null;
      expect(instance._getElementOption(function () {
        return first;
      })).to.be.null;
    });

    it('can test elements against filters', function () {
      instance = new Shuffle(fixture);

      var first = fixture.firstElementChild;
      expect(instance._doesPassFilter('design', first)).to.be.true;
      expect(instance._doesPassFilter('black', first)).to.be.false;

      expect(instance._doesPassFilter(function (element) {
        expect(element).to.exist;
        return element.getAttribute('data-age') === '21';
      }, first)).to.equal(true);

      expect(instance._doesPassFilter(function (element) {
        return element.getAttribute('data-age') === '22';
      }, first)).to.equal(false);

      // Arrays.
      expect(instance._doesPassFilter(['design'], first)).to.be.true;
      expect(instance._doesPassFilter(['red'], first)).to.be.true;
      expect(instance._doesPassFilter(['design', 'black'], first)).to.be.true;

      // Change filter mode.
      instance.options.filterMode = Shuffle.FilterMode.ALL;
      expect(instance._doesPassFilter(['design'], first)).to.be.true;
      expect(instance._doesPassFilter(['design', 'red'], first)).to.be.true;
      expect(instance._doesPassFilter(['design', 'black'], first)).to.be.false;
    });

    it('will maintain the last sort object', function () {
      instance = new Shuffle(fixture);
      var initialSort = instance.lastSort;

      instance.sort();
      expect(instance.lastSort).to.deep.equal(initialSort);

      instance.sort({ glen: true });
      expect(instance.lastSort).to.deep.equal({ glen: true });

      instance.sort();
      expect(instance.lastSort).to.deep.equal({ glen: true });

    });

    it('should reset columns', function () {
      instance = new Shuffle(fixture);

      expect(instance.cols).to.be.above(0);
      instance._resetCols();

      var positions = new Array(instance.cols);
      for (var i = 0; i < instance.cols; i++) {
        positions[i] = 0;
      }

      expect(instance.positions).to.deep.equal(positions);
    });

    it('should destroy properly', function () {
      instance = new Shuffle(fixture);
      instance.destroy();

      expect(instance.element).to.be.null;
      expect(instance.items).to.have.lengthOf(0);
      expect(instance.options.sizer).to.be.null;
      expect(instance.isDestroyed).to.be.true;

      expect(fixture).to.not.have.class('shuffle');

      Array.from(fixture.children).forEach(function (child) {
        expect(child).to.not.have.class('shuffle-item');
        expect(child).to.not.have.class('shuffle-item--visible');
        expect(child).to.not.have.class('shuffle-item--hidden');
      });
    });

    it('should not update or shuffle when disabled or destroyed', function () {
      instance = new Shuffle(fixture);
      var update = sinon.spy(instance, 'update');
      var _filter = sinon.spy(instance, '_filter');

      instance.disable();

      instance.filter('design');

      expect(_filter.called).to.be.false;
      expect(update.called).to.be.false;

      instance.enable(false);

      instance.destroy();
      instance._onResize();
      expect(update.called).to.be.false;
    });

    it('should still update when the container is the same size', function () {
      instance = new Shuffle(fixture);
      var update = sinon.spy(instance, 'update');

      instance._onResize();

      expect(update.called).to.be.true;
    });

    describe('removing elements', function () {
      var children;

      beforeEach(function () {
        children = Array.from(fixture.children);
      });

      afterEach(function () {
        children = null;
      });

      it('can remove items', function (done) {
        instance = new Shuffle(fixture, {
          speed: 16,
        });

        instance.once(Shuffle.EventType.REMOVED, function (data) {
          expect(data.shuffle.visibleItems).to.equal(8);
          expect(data.collection[0].id).to.equal('item1');
          expect(data.collection[1].id).to.equal('item2');
          expect(data.shuffle.element.children).to.have.lengthOf(8);
          expect(instance.isTransitioning).to.be.false;
          done();
        });

        var itemsToRemove = children.slice(0, 2);
        instance.remove(itemsToRemove);
      });

      it('can remove items without transforms', function (done) {
        instance = new Shuffle(fixture, {
          speed: 100,
          useTransforms: false,
        });

        instance.once(Shuffle.EventType.REMOVED, function (data) {
          expect(data.shuffle.visibleItems).to.equal(8);
          expect(data.collection[0].id).to.equal('item2');
          expect(data.collection[1].id).to.equal('item3');
          expect(data.shuffle.element.children).to.have.lengthOf(8);
          expect(data.shuffle.isTransitioning).to.be.false;
          done();
        });

        var itemsToRemove = children.slice(1, 3);
        instance.remove(itemsToRemove);
      });
    });

    it('can get the real width of an element which is scaled', function () {
      var div = document.createElement('div');
      div.style.cssText = 'width:100px;height:100px;';
      div.style.transform = 'translate(0px,0px) scale(0.5)';

      document.body.appendChild(div);

      expect(Shuffle.getSize(div, false).width).to.equal(100);
      expect(Shuffle.getSize(div, true).width).to.equal(100);

      expect(Shuffle.getSize(div, false).height).to.equal(100);
      expect(Shuffle.getSize(div, true).height).to.equal(100);

      div.style.marginLeft = '10px';
      div.style.marginRight = '20px';
      div.style.marginTop = '30px';
      div.style.marginBottom = '40px';

      expect(Shuffle.getSize(div, false).width).to.equal(100);
      expect(Shuffle.getSize(div, true).width).to.equal(130);

      expect(Shuffle.getSize(div, false).height).to.equal(100);
      expect(Shuffle.getSize(div, true).height).to.equal(170);

      document.body.removeChild(div);
    });

    describe('inserting elements', function () {
      var items = [];

      beforeEach(function () {
        var eleven = document.createElement('div');
        eleven.className = 'item';
        eleven.setAttribute('data-age', 36);
        eleven.setAttribute('data-groups', '["ux", "black"]');
        eleven.id = 'item11';
        eleven.textContent = 'Person 11';

        var twelve = document.createElement('div');
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

      afterEach(function () {
        items.length = 0;
      });

      it('can add items', function (done) {
        fixture.appendChild(items[0]);
        fixture.appendChild(items[1]);
        instance.add(items);

        // Already 2 in the items, plus number 11.
        expect(instance.visibleItems).to.equal(3);
        expect(instance.items).to.have.lengthOf(12);

        instance.once(Shuffle.EventType.LAYOUT, function () {
          done();
        });
      });

      it('can prepend items', function (done) {
        fixture.insertBefore(items[1], fixture.firstElementChild);
        fixture.insertBefore(items[0], fixture.firstElementChild);
        instance.add(items);

        expect(instance.items[0].element).to.equal(items[0]);
        expect(instance.items[1].element).to.equal(items[1]);
        expect(instance.items).to.have.lengthOf(12);

        instance.once(Shuffle.EventType.LAYOUT, function () {
          done();
        });
      });

      it('can reset items', function () {
        fixture.textContent = '';
        fixture.appendChild(items[0]);
        fixture.appendChild(items[1]);

        instance.resetItems();

        expect(instance.isInitialized).to.be.true;
        expect(instance.items[0].element).to.equal(items[0]);
        expect(instance.items[1].element).to.equal(items[1]);
        expect(instance.items).to.have.lengthOf(2);
      });

    });
  });

  describe('delimeter fixture', function () {
    beforeEach(function (done) {
      // Mock the transition end event wrapper.
      sinon.stub(Shuffle.prototype, '_whenTransitionDone').callsFake(whenTransitionDoneStub);

      appendFixture('delimeter').then(done);
    });

    afterEach(function () {
      Shuffle.prototype._whenTransitionDone.restore();
      removeFixture();
    });

    it('can have a custom delimeter', function () {
      instance = new Shuffle(fixture, {
        delimeter: ',',
        group: 'design',
      });

      expect(instance.visibleItems).to.equal(3);
    });
  });

  describe('Custom shuffle item styles', function () {
    var original = Shuffle.ShuffleItem.Css;

    beforeEach(function (done) {
      appendFixture('regular').then(done);
    });

    afterEach(function () {
      Shuffle.ShuffleItem.Css = original;
      removeFixture();
    });

    it('will apply before and after styles even if the item will not move', function () {
      Shuffle.ShuffleItem.Css.INITIAL.opacity = 0;
      instance = new Shuffle(fixture, { speed: 0 });

      // The layout method will have already set styles to their 'after' states
      // upon initialization. Reset them here.
      instance.items.forEach(function (item) {
        item.applyCss(Shuffle.ShuffleItem.Css.INITIAL);
      });

      instance.items.forEach(function (item) {
        expect(item.element.style.opacity).to.equal('0');
      });

      instance._layout(instance.items);
      instance._processQueue();

      instance.items.forEach(function (item) {
        expect(item.element.style.opacity).to.equal('1');
      });
    });
  });

  describe('the sorter', function () {
    var items;
    var clone;

    beforeEach(function (done) {
      appendFixture('regular').then(function () {
        items = Array.from(fixture.children).map(function (element) {
          return { element: element };
        });

        clone = Array.from(items);

        done();
      });
    });

    afterEach(function () {
      items.length = 0;
      clone.length = 0;
      removeFixture();
    });

    it('will catch empty objects', function () {
      expect(Shuffle.__sorter({})).to.deep.equal([]);
    });

    it('can randomize the elements', function () {
      expect(items).to.have.lengthOf(10);
      expect(Shuffle.__sorter(items)).to.deep.equal(items);

      expect(Shuffle.__sorter(clone, { randomize: true })).to.not.deep.equal(items);
    });

    it('can sort by a function', function () {
      clone.sort(function (a, b) {
        var age1 = parseInt(a.element.getAttribute('data-age'), 10);
        var age2 = parseInt(b.element.getAttribute('data-age'), 10);
        return age1 - age2;
      });

      var result = Shuffle.__sorter(items, {
        by: function (element) {
          expect(element).to.exist;
          expect(element.nodeType).to.equal(1);
          return parseInt(element.getAttribute('data-age'), 10);
        },
      });

      expect(result).to.deep.equal(clone);
    });

    it('can sort by a function and reverse it', function () {
      clone.sort(function (a, b) {
        var age1 = parseInt(a.element.getAttribute('data-age'), 10);
        var age2 = parseInt(b.element.getAttribute('data-age'), 10);
        return age1 - age2;
      }).reverse();

      var result = Shuffle.__sorter(items, {
        reverse: true,
        by: function (element) {
          return parseInt(element.getAttribute('data-age'), 10);
        },
      });

      expect(result).to.deep.equal(clone);
    });

    it('will revert to DOM order if the `by` function returns undefined', function () {
      var count = 0;
      expect(Shuffle.__sorter(items, {
        by: function () {
          count++;
          return count < 5 ? Math.random() : undefined;
        },
      })).to.deep.equal(clone);
    });

    it('can sort things to the top', function () {
      items = items.slice(0, 4);
      var final = [items[1], items[0], items[3], items[2]];
      expect(Shuffle.__sorter(items, {
        by: function (element) {
          var age = parseInt(element.getAttribute('data-age'), 10);
          if (age === 50) {
            return 'sortFirst';
          } else {
            return age;
          }
        },
      })).to.deep.equal(final);
    });

    it('can sort things to the bottom', function () {
      items = items.slice(0, 4);
      var final = [items[0], items[2], items[1], items[3]];
      expect(Shuffle.__sorter(items, {
        by: function (element) {
          var age = parseInt(element.getAttribute('data-age'), 10);
          if (age === 27) {
            return 'sortLast';
          } else {
            return age;
          }
        },
      })).to.deep.equal(final);
    });

    it('can have a custom sort comparator', function () {
      var final = [
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
        compare: function (a, b) {
          // Sort by first group, then by age.
          var groupA = JSON.parse(a.element.getAttribute('data-groups'))[0];
          var groupB = JSON.parse(b.element.getAttribute('data-groups'))[0];
          if (groupA > groupB) {
            return 1;
          }
          if (groupA < groupB) {
            return -1;
          }

          // At this point, the group strings are the exact same. Test the age.
          var ageA = parseInt(a.element.getAttribute('data-age'), 10);
          var ageB = parseInt(b.element.getAttribute('data-age'), 10);
          return ageA - ageB;
        },
      })).to.deep.equal(final);
    });

  });
});
