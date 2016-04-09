/* globals describe, it, beforeEach, afterEach */
/* jshint expr: true */

'use strict';

var expect = window.chai.expect;

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
    if (instance.element) {
      instance.destroy();
    }

    if (fixture) {
      fixture.parentNode.removeChild(fixture);
    }

    instance = null;
    fixture = null;
  }

  function removeFixture(done) {
    if (instance.isInitialized) {
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

  function id(id) {
    return document.getElementById(id);
  }

  describe('regular fixture', function () {

    beforeEach(function (done) {
      appendFixture('regular').then(done);
    });

    afterEach(removeFixture);

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
      expect(instance.options.sequentialFadeDelay).to.equal(150);
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

    /*
    it('can filter by the data attribute', function (done) {
      console.log('new');
      instance = new Shuffle(fixture, {
        speed: 0,
      });

      function first() {
        console.log('1');
        once(fixture, Shuffle.EventType.LAYOUT, second);
        console.log('filter. wait.');
        instance.filter('design');
      }

      function second() {
        console.log('2');
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
        console.log('3');
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
    */
  });
});
