var DEMO = (function( $ ) {
  'use strict';

  var init = function() {
    var $grid = $('#grid'),
        $sizer = $grid.find('.shuffle__sizer');

    $grid.shuffle({
      itemSelector: '.grid__brick',
      sizer: $sizer
    });
  };

  return {
    init: init
  };
}( jQuery ));


$(document).ready(function() {
  DEMO.init();
});
