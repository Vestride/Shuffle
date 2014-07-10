(function (factory) {
  if (typeof define === 'function' && define.amd) {
    define(['jquery', 'modernizr'], factory);
  } else {
    window.Shuffle = factory(window.jQuery, window.Modernizr);
  }
})(function($, Modernizr, undefined) {

'use strict';
