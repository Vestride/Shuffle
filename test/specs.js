jasmine.getFixtures().fixturesPath = 'fixtures';

describe('Shuffle.js', function() {
  var $ = window.jQuery;
  var Modernizr = window.Modernizr;

  describe('regular markup', function() {

    beforeEach(function() {
      loadFixtures('regular.html');
    });

    afterEach(function(done) {
      // Shuffle init is async.
      setTimeout(function () {
        $('#regular-shuffle').shuffle('destroy');
        done();
      }, 32);
    });

    it('should get default options', function() {
      $('#regular-shuffle').shuffle();
      expect($('#regular-shuffle')).toHaveData('shuffle');
      var shuffle = $('#regular-shuffle').data('shuffle');
      expect(shuffle.$items.length).toBe(10);
      expect(shuffle.visibleItems).toBe(10);
      expect(shuffle.group).toBe('all');
      expect(shuffle.speed).toBe(250);
      expect(shuffle.itemSelector).toBe('');
      expect(shuffle.sizer).toBe(null);
      expect(shuffle.columnWidth).toBe(0);
      expect(shuffle.gutterWidth).toBe(0);
      expect(shuffle.delimeter).toBe(null);
      expect(shuffle.initialSort).toBe(null);
      expect(shuffle.throttleTime).toBe(300);
      expect(shuffle.sequentialFadeDelay).toBe(150);
      expect(shuffle.useSizer).toBe(false);
      expect(shuffle.supported).toBe(Modernizr.csstransforms && Modernizr.csstransitions);
      expect(shuffle.unique).toBe('shuffle_0');
    });

    it('should add classes and default styles', function() {
      $('#regular-shuffle').shuffle();
      var shuffle = $('#regular-shuffle').data('shuffle');
      expect(shuffle.$el).toHaveClass('shuffle');
      expect(shuffle.$items).toHaveClass('shuffle-item filtered');
      expect(shuffle.$el).toHaveCss({
        position: 'relative'
      });
      expect(shuffle.$items).toHaveCss({
        opacity: '1',
        position: 'absolute',
        visibility: 'visible'
      });
      expect(shuffle.containerWidth).not.toBe(0);
    });


    it('should be 3 columns with gutters', function() {
      var $shuffle = $('#regular-shuffle');
      $shuffle.css({
        width: '1000px'
      });
      $shuffle.children().css({
        width: '300px',
        height: '150px'
      });
      $shuffle.shuffle({
        columnWidth: 300,
        gutterWidth: 50
      });

      var shuffle = $shuffle.data('shuffle');

      expect(shuffle.colWidth).toBe(350);
      expect(shuffle.cols).toBe(3);
      expect(shuffle.colYs).toEqual([600, 450, 450]);
    });


    it('can have a function for columns and gutters', function() {
      var $shuffle = $('#regular-shuffle');
      $shuffle.css({
        width: '1000px'
      });
      $shuffle.children().css({
        width: '300px',
        height: '150px'
      });
      $shuffle.shuffle({
        columnWidth: function(containerWidth) {
          expect(containerWidth).toBe(1000);
          return 300;
        },
        gutterWidth: function() {
          return 50;
        }
      });

      var shuffle = $shuffle.data('shuffle');

      expect(shuffle._getGutterSize(1000)).toBe(50);
      expect(shuffle._getColumnSize(50, 1000)).toBe(350);
      expect(shuffle.colWidth).toBe(350);
      expect(shuffle.cols).toBe(3);
      expect(shuffle.colYs).toEqual([600, 450, 450]);
    });

    it('can filter by the data attribute', function(done) {
      var $shuffle = $('#regular-shuffle');
      var shuffle = $shuffle.shuffle({
        speed: 100
      }).data('shuffle');

      function first() {
        shuffle.shuffle('design');
        $shuffle.one('layout.shuffle', second);
      }

      function second() {
        expect(shuffle.visibleItems).toBe(3);
        var $concealedItems = $('#item3, #item4, #item5, #item6, #item7, #item8, #item10');
        var $filteredItems = $('#item1, #item2, #item9');
        expect($concealedItems).toHaveClass('concealed');
        expect($filteredItems).toHaveClass('filtered');
        expect($concealedItems).toHaveCss({
          visibility: 'hidden'
        });

        // Filter by green.
        shuffle.shuffle('green');
        $shuffle.one('layout.shuffle', third);
      }

      function third() {
        expect(shuffle.visibleItems).toBe(2);
        var $concealedItems = $('#item1, #item2, #item5, #item6, #item7, #item8, #item9, #item10');
        var $filteredItems = $('#item3, #item4');
        expect($concealedItems).toHaveClass('concealed');
        expect($filteredItems).toHaveClass('filtered');
        done();
      }

      setTimeout(first, 32);
    });

    it('can shuffle by function', function() {
      var $shuffle = $('#regular-shuffle');
      var shuffle = $shuffle.shuffle({
        speed: 100
      }).data('shuffle');

      function first() {
        shuffle.shuffle(function($el) {
          return parseInt($el.attr('id').substring(4), 10) <= 5;
        });
        $shuffle.one('layout.shuffle', second);
      }

      function second() {
        expect(shuffle.visibleItems).toBe(5);
        var $concealedItems = $('#item6, #item7, #item8, #item9, #item10');
        var $filteredItems = $('#item1, #item2, #item3, #item4, #item5');
        expect($concealedItems).toHaveClass('concealed');
        expect($filteredItems).toHaveClass('filtered');
      }

      // First shuffle is async.
      setTimeout(first, 32);
    });


  });


  describe('the sorted plugin', function() {

    beforeEach(function() {
      loadFixtures('regular.html');
    });

    afterEach(function() {
    });


    it('will catch empty jQuery objects', function() {
      var $items = $();
      expect($items.sorted()).toEqual([]);
    });

    it('can randomize the elements', function() {
      var $items = $('#regular-shuffle').children();
      var array = $items.toArray();
      expect($items.length).toBe(10);
      expect($items.sorted({
        randomize: true
      })).not.toEqual(array);
    });

    it('can sort by a function', function() {
      var $items = $('#regular-shuffle').children();
      var array = $items.toArray();
      array.sort(function(a, b) {
        var age1 = parseInt(a.getAttribute('data-age'), 10);
        var age2 = parseInt(b.getAttribute('data-age'), 10);
        return age1 - age2;
      });
      var result = $items.sorted({
        by: function($el) {
          expect($el).toExist();
          return parseInt($el.attr('data-age'), 10);
        }
      });
      expect(result).toEqual(array);
    });

    it('can sort by a function and reverse it', function() {
      var $items = $('#regular-shuffle').children();
      var array = $items.toArray();
      array.sort(function(a, b) {
        var age1 = parseInt(a.getAttribute('data-age'), 10);
        var age2 = parseInt(b.getAttribute('data-age'), 10);
        return age1 - age2;
      }).reverse();
      var result = $items.sorted({
        reverse: true,
        by: function($el) {
          expect($el).toExist();
          return parseInt($el.attr('data-age'), 10);
        }
      });
      expect(result).toEqual(array);
    });

    it('will not sort without a `by` function', function() {
      var $items = $('#regular-shuffle').children();
      var array = $items.toArray();
      expect($items.sorted()).toEqual(array);
      expect($items.sorted({})).toEqual(array);
      expect($items.sorted({
        reverse: true
      })).toEqual(array.reverse());
    });

    it('will revert to DOM order if the `by` function returns undefined', function() {
      var $items = $('#regular-shuffle').children();
      var array = $items.toArray();
      var count = 0;
      expect($items.sorted({
        by: function() {
          count++;
          return count < 5 ? Math.random() : undefined;
        }
      })).toEqual(array);
    });

    it('can sort elements first', function() {
      var $items = $('#regular-shuffle').children().slice(0, 4);
      var array = $items.toArray();
      array = [ array[1], array[0], array[3], array[2] ];
      expect($items.sorted({
        by: function($el) {
          var age = $el.data('age');
          if (age === 50) {
            return 'sortFirst';
          } else {
            return age;
          }
        }
      })).toEqual(array);
    });

    it('can sort elements last', function() {
      var $items = $('#regular-shuffle').children().slice(0, 4);
      var array = $items.toArray();
      array = [ array[0], array[2], array[1], array[3] ];
      expect($items.sorted({
        by: function($el) {
          var age = $el.data('age');
          if (age === 27) {
            return 'sortLast';
          } else {
            return age;
          }
        }
      })).toEqual(array);
    });

  });

});
