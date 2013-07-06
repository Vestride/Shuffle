window.Manipulator = (function($) {
  'use strict';

  var hasConsole = window.console && typeof window.console.log === 'function';

  var Manipulator = function( element ) {
    var self = this;

    self.$el = $( element );
    self.init();
  };

  Manipulator.prototype.init = function() {
    var self = this;

    self.initShuffle();
    self.setupEvents();
  };

  // Column width and gutter width options can be functions
  Manipulator.prototype.initShuffle = function() {
    this.$el.shuffle({
      itemSelector: '.box',
      speed: 250,
      easing: 'ease',
      columnWidth: function( containerWidth ) {
        // .box's have a width of 18%
        return 0.18 * containerWidth;
      },
      gutterWidth: function( containerWidth ) {
        // .box's have a margin-left of 2.5%
        return 0.025 * containerWidth;
      }
    });

    // Shuffle is stored in the elements data with jQuery.
    // You can access the class instance here
    this.shuffle = this.$el.data('shuffle');
  };

  Manipulator.prototype.setupEvents = function() {
    var self = this;

    $('#add').on('click', $.proxy( self.onAddClick, self ));
    $('#randomize').on('click', $.proxy( self.onRandomize, self ));
    $('#remove').on('click', $.proxy( self.onRemoveClick, self ));

    // Show off some shuffle events
    self.$el.on('removed.shuffle', function( evt, $collection, shuffle ) {

      // Make sure logs work
      if ( !hasConsole ) {
        return;
      }

      console.log( this, evt, $collection, shuffle );
    });
  };

  Manipulator.prototype.onAddClick = function() {

    // Creating random elements. You could use an
    // ajax request or clone elements instead
    var self = this,
        itemsToCreate = 5,
        frag = document.createDocumentFragment(),
        grid = self.$el[0],
        items = [],
        $items,
        classes = ['w2', 'h2', 'w3'],
        box, i, random, randomClass;

    for (i = 0; i < itemsToCreate; i++) {
      random = Math.random();
      box = document.createElement('div');
      box.className = 'box';

      // Randomly add a class
      if ( random > 0.8 ) {
        randomClass = Math.floor( Math.random() * 3 );
        box.className = box.className + ' ' + classes[ randomClass ];
      }
      items.push( box );
      frag.appendChild( box );
    }

    grid.appendChild( frag );
    $items = $(items);


    // Tell shuffle items have been appended.
    // It expects a jQuery object as the parameter.
    self.shuffle.appended( $items );
    // or
    // self.$el.shuffle('appended', $items );
  };

  Manipulator.prototype.getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // Randomly choose some elements to remove
  Manipulator.prototype.onRemoveClick = function() {
    var self = this,
        total = self.shuffle.visibleItems,
        numberToRemove = Math.min( 3, total ),
        indexesToRemove = [],
        i = 0,
        $collection = $();

    // None left
    if ( !total ) {
      return;
    }

    // This has the possibility to choose the same index for more than
    // one in the array, meaning sometimes less than 3 will be removed
    for ( ; i < numberToRemove; i++ ) {
      indexesToRemove.push( self.getRandomInt( 0, total - 1 ) );
    }

    // Make a jQuery collection out of the index selections
    $.each(indexesToRemove, function(i, index) {
      $collection = $collection.add( self.shuffle.$items.eq( index ) );
    });

    // Tell shuffle to remove them
    self.shuffle.remove( $collection );
    // or
    // self.$el.shuffle('remove', $collection);
  };

  Manipulator.prototype.onRandomize = function() {
    var self = this,
        sortObj = {
          randomize: true
        };

    self.shuffle.sort( sortObj );
    // or
    // self.$el.shuffle('sort', sortObj);
  };

  return Manipulator;

}(jQuery));

$(document).ready(function() {
  new window.Manipulator( document.getElementById('my-shuffle') );
});