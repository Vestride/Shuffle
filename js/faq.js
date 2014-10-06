
// Requires jQuery and jQuery.debounce

(function( $ ) {

  var collapsedClass = 'collapsed',
      $searchInput = $('#search'),
      $questions = $('.js-question'),
      $questionInners = $questions.find('.question__inner'),
      $questionTitles = $questions.find('.question__title'),

  keyup = function() {
    // Value they've entered
    var val = this.value.toLowerCase();

    // Filter elements based on if their string exists in the product model
    $questions.each(function( i, el ) {
      var $el = $( el ),
          text = $.trim( $questionTitles.eq( i ).text() ).toLowerCase(),
          passes = text.indexOf( val ) !== -1;

      if ( passes ) {
        if ( $el.hasClass( collapsedClass ) ) {
          $el.removeClass( collapsedClass );
        }
      } else {
        if ( !$el.hasClass( collapsedClass ) ) {
          $el.addClass( collapsedClass );
        }
      }

    });
  },

  debouncedKeyup = $.debounce( 100, keyup ),

  // Height cannot be transitioned from auto to zero, so it must be set.
  setHeights = function() {
    var heights = [];

    // Remove current hegith
    $questions.css( 'height', '' );

    // Get new heights
    // Inner div needed because setting a height on the elements
    // self doesn't get the correct new height :\
    $questionInners.each(function() {
      heights.push( $( this ).css( 'height' ) );
    });

    // Set new heights
    $questions.each(function( i ) {
      $( this ).css( 'height', heights[ i ] );
    });
  },

  onWindowResize = function() {
    setHeights();
  };

  if ( !$searchInput.length ) {
    return;
  }

  $searchInput.on( 'keyup change', debouncedKeyup );
  $( window ).on( 'resize', $.debounce( 250, onWindowResize ) );
  onWindowResize();

}( jQuery ));
