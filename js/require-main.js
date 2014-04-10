requirejs.config({
  baseUrl: '/js',
  paths: {
    jquery: '//ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min',
    shuffle: '../dist/jquery.shuffle',
    modernizr: '../dist/modernizr.custom.min'
  },


  // Shimming other page javascript.
  shim: {
    evenheights: {
      deps: ['jquery'],
      exports: 'jQuery.fn.evenHeights'
    },
    page: {
      deps: ['jquery', 'evenheights'],
      exports: 'Modules'
    }
  }
});

// A hack for Modernizr and AMD. This lets Modernizr be in the <head> and also
// compatible with other modules.
define('modernizr', [], window.Modernizr);


define(function(require) {
  // Get jQuery.
  var $ = require('jquery');

  // Get Shuffle.
  var Shuffle = require('shuffle');

  // Page-level JavaScript used for the demo pages.
  var jqEvenHeights = require('evenheights');
  var Page = require('page');

  // Create a new shuffle instance.
  var shuffle = new Shuffle($('#grid'), {
    itemSelector: '.js-item',
    sizer: $('#js-sizer')
  });

  // DO NOT use this for determining when images load.
  // See http://vestride.github.io/Shuffle/images/
  // Use something like imagesLoaded.
  $('#grid img').on('load', function() {
    shuffle.layout();
  });
});
