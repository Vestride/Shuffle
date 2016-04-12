/* globals describe, it, beforeEach, afterEach */
/* jshint expr: true */

'use strict';

var expect = window.chai.expect;
var sinon = window.sinon;

describe('shuffle', function () {

  var Shuffle = window.shuffle;
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

  function cleanup() {
    if (instance && instance.element) {
      instance.destroy();
    }

    if (fixture) {
      fixture.parentNode.removeChild(fixture);
    }

    instance = null;
    fixture = null;
  }

  function removeFixture(done) {
    if (!instance || instance.isInitialized) {
      cleanup();
      done();
    } else {
      instance.element.addEventListener(Shuffle.EventType.DONE, function onDone() {
        instance.element.removeEventListener(Shuffle.EventType.DONE, onDone);
        cleanup();
        done();
      });
    }
  }

  function once(element, eventType, fn) {
    var handler = function (e) {
      element.removeEventListener(eventType, handler);
      fn(e);
    };

    element.addEventListener(eventType, handler);
  }

  function toArray(thing) {
    return Array.prototype.slice.call(thing);
  }

  function id(id) {
    return document.getElementById(id);
  }

  describe('regular fixture', function () {

    beforeEach(function (done) {
      // Mock the transition end event wrapper to always resolve its promise.
      sinon.stub(Shuffle.prototype, '_whenTransitionDone', function () {
        return Promise.resolve();
      });

      appendFixture('regular').then(done);
    });

    afterEach(function (done) {
      removeFixture(done);
      Shuffle.prototype._whenTransitionDone.restore();
    });

    it('should have default options', function (done) {
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
      expect(instance.useSizer).to.equal(false);
      expect(instance.id).to.equal('shuffle_0');

      expect(instance.isInitialized).to.be.false;
      instance.element.addEventListener(Shuffle.EventType.DONE, function onDone() {
        instance.element.removeEventListener(Shuffle.EventType.DONE, onDone);
        expect(instance.isInitialized).to.be.true;
        done();
      });
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
        expect(item.element).to.have.class('filtered');
        expect(item.element.style.opacity).to.be.defined;
        expect(item.element.style.position).to.equal('absolute');
        expect(item.element.style.visibility).to.equal('visible');
        expect(item.isVisible).to.equal(true);
        expect(item.scale).to.equal(Shuffle.ShuffleItem.Scale.VISIBLE);
        expect(item.point.x).to.be.defined;
        expect(item.point.y).to.be.defined;
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

      function first() {
        once(fixture, Shuffle.EventType.LAYOUT, second);
        instance.filter('design');
      }

      function second() {
        expect(instance.visibleItems).to.equal(3);
        var concealed = [3, 4, 5, 6, 7, 8, 10].map(function (num) {
          return id('item' + num);
        });

        var filtered = [1, 2, 9].map(function (num) {
          return id('item' + num);
        });

        concealed.forEach(function (element) {
          expect(element).to.have.class(Shuffle.ClassName.CONCEALED);
          expect(element.style.visibility).to.equal('hidden');
        });

        filtered.forEach(function (element) {
          expect(element).to.have.class(Shuffle.ClassName.FILTERED);
          expect(element.style.visibility).to.equal('visible');
        });

        once(fixture, Shuffle.EventType.LAYOUT, third);

        // Filter by green.
        instance.filter('green');
      }

      function third() {
        expect(instance.visibleItems).to.equal(2);
        var concealed = [1, 2, 5, 6, 7, 8, 9, 10].map(function (num) {
          return id('item' + num);
        });

        var filtered = [3, 4].map(function (num) {
          return id('item' + num);
        });

        concealed.forEach(function (element) {
          expect(element).to.have.class(Shuffle.ClassName.CONCEALED);
          expect(element.style.visibility).to.equal('hidden');
        });

        filtered.forEach(function (element) {
          expect(element).to.have.class(Shuffle.ClassName.FILTERED);
          expect(element.style.visibility).to.equal('visible');
        });

        done();
      }

      once(fixture, Shuffle.EventType.DONE, first);
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

    describe('after initialized', function () {
      var clock;

      beforeEach(function () {
        clock = sinon.useFakeTimers();
        instance = new Shuffle(fixture);
        clock.tick(17);
        expect(instance.isInitialized).to.be.true;
      });

      afterEach(function () {
        clock.restore();
      });

      it('can calculate column spans', function () {
        expect(instance._getColumnSpan(50, 100, 3)).to.equal(1);
        expect(instance._getColumnSpan(200, 100, 3)).to.equal(2);
        expect(instance._getColumnSpan(200, 200, 3)).to.equal(1);
        expect(instance._getColumnSpan(300, 100, 3)).to.equal(3);

        // Column span should not be larger than the number of columns.
        expect(instance._getColumnSpan(300, 50, 3)).to.equal(3);

        // Fix for percentage values.
        expect(instance._getColumnSpan(100.02, 100, 4)).to.equal(1);
        expect(instance._getColumnSpan(99.98, 100, 4)).to.equal(1);
      });

      it('can calculate column sets', function () {
        // _getColumnSet(columnSpan, columns)
        instance.positions = [150, 0, 0, 0];
        expect(instance._getColumnSet(1, 4)).to.deep.equal([150, 0, 0, 0]);
        expect(instance._getColumnSet(2, 4)).to.deep.equal([150, 0, 0]);
      });

      it('can get an element option', function () {
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
      });

      it('will maintain the last sort object', function () {
        var initialSort = instance.lastSort;

        instance.sort();
        expect(instance.lastSort).to.deep.equal(initialSort);

        instance.sort({ glen: true });
        expect(instance.lastSort).to.deep.equal({ glen: true });

        instance.sort();
        expect(instance.lastSort).to.deep.equal({ glen: true });

      });

      it('should reset columns', function () {

        expect(instance.cols).to.be.above(0);
        instance._resetCols();

        var positions = new Array(instance.cols);
        for (var i = 0; i < instance.cols; i++) {
          positions[i] = 0;
        }

        expect(instance.positions).to.deep.equal(positions);
      });

      it('should destroy properly', function () {
        instance.destroy();

        expect(instance.element).to.be.null;
        expect(instance.items).to.be.null;
        expect(instance.options.sizer).to.be.null;
        expect(instance.isDestroyed).to.be.true;

        expect(fixture).to.not.have.class('shuffle');

        toArray(fixture.children).forEach(function (child) {
          expect(child).to.not.have.class('shuffle-item');
          expect(child).to.not.have.class('filtered');
          expect(child).to.not.have.class('concealed');
        });
      });

      it('should not update or shuffle when disabled or destroyed', function () {
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

      it('should not update when the container is the same size', function () {
        var update = sinon.spy(instance, 'update');

        instance._onResize();

        expect(update.called).to.be.false;
      });
    });

    describe('removing elements', function () {
      var itemsToRemove;
      var onDone;
      var onRemoved;

      beforeEach(function () {
        var children = toArray(fixture.children);
        itemsToRemove = children.slice(0, 2);
        onDone = function () {
          once(fixture, Shuffle.EventType.REMOVED, onRemoved);
          instance.remove(itemsToRemove);
        };
      });

      afterEach(function () {
        itemsToRemove = null;
        onDone = null;
        onRemoved = null;
      });

      it('can remove items', function (done) {
        instance = new Shuffle(fixture, {
          speed: 16,
        });

        onRemoved = function (evt) {
          var detail = evt.detail;
          expect(detail.shuffle.visibleItems).to.equal(8);
          expect(detail.collection[0].id).to.equal('item1');
          expect(detail.collection[1].id).to.equal('item2');
          expect(detail.shuffle.element.children).to.have.lengthOf(8);
          expect(instance.isTransitioning).to.equal(false);
          done();
        };

        once(fixture, Shuffle.EventType.DONE, onDone);
      });

      it('can remove items without transforms', function (done) {
        instance = new Shuffle(fixture, {
          speed: 100,
          useTransforms: false,
        });

        onRemoved = function (evt) {
          var detail = evt.detail;
          expect(detail.shuffle.visibleItems).to.equal(8);
          expect(detail.collection[0].id).to.equal('item1');
          expect(detail.collection[1].id).to.equal('item2');
          expect(detail.shuffle.element.children).to.have.lengthOf(8);
          expect(detail.shuffle.isTransitioning).to.equal(false);
          done();
        };

        once(fixture, Shuffle.EventType.DONE, onDone);
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
      var clock;
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

        clock = sinon.useFakeTimers();
        instance = new Shuffle(fixture, {
          speed: 100,
          group: 'black',
        });
        clock.tick(17);
        expect(instance.isInitialized).to.be.true;
      });

      afterEach(function (done) {
        once(fixture, Shuffle.EventType.LAYOUT, function () {
          clock.restore();
          items.length = 0;
          done();
        });
      });

      it('can add items', function () {
        fixture.appendChild(items[0]);
        fixture.appendChild(items[1]);
        instance.add(items);

        // Already 2 in the items, plus number 11.
        expect(instance.visibleItems).to.equal(3);
        expect(instance.items).to.have.lengthOf(12);
      });

      it('can prepend items', function () {
        fixture.insertBefore(items[1], fixture.firstElementChild);
        fixture.insertBefore(items[0], fixture.firstElementChild);
        instance.add(items);

        expect(instance.items[0].element).to.equal(items[0]);
        expect(instance.items[1].element).to.equal(items[1]);
        expect(instance.items).to.have.lengthOf(12);
      });

    });
  });

  describe('the sorter', function () {
    var items;
    var clone;

    beforeEach(function (done) {
      appendFixture('regular').then(function () {
        items = toArray(fixture.children).map(function (element) {
          return { element: element };
        });

        clone = toArray(items);

        done();
      });
    });

    afterEach(function (done) {
      items.length = 0;
      clone.length = 0;
      removeFixture(done);
    });

    it('will catch empty objects', function () {
      expect(Shuffle.sorter({})).to.deep.equal([]);
    });

    it('can randomize the elements', function () {
      expect(items).to.have.lengthOf(10);
      expect(Shuffle.sorter(items)).to.deep.equal(items);

      var clone = toArray(items);
      expect(Shuffle.sorter(clone, { randomize: true })).to.not.deep.equal(items);
    });

    it('can sort by a function', function () {
      clone.sort(function (a, b) {
        var age1 = parseInt(a.element.getAttribute('data-age'), 10);
        var age2 = parseInt(b.element.getAttribute('data-age'), 10);
        return age1 - age2;
      });

      var result = Shuffle.sorter(items, {
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

      var result = Shuffle.sorter(items, {
        reverse: true,
        by: function (element) {
          return parseInt(element.getAttribute('data-age'), 10);
        },
      });

      expect(result).to.deep.equal(clone);
    });

    it('will revert to DOM order if the `by` function returns undefined', function () {
      var count = 0;
      expect(Shuffle.sorter(items, {
        by: function () {
          count++;
          return count < 5 ? Math.random() : undefined;
        },
      })).to.deep.equal(clone);
    });

    it('can sort things to the top', function () {
      items = items.slice(0, 4);
      var final = [items[1], items[0], items[3], items[2]];
      expect(Shuffle.sorter(items, {
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
      expect(Shuffle.sorter(items, {
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

  });
});
