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

  });

});
