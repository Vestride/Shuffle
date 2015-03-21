(function (factory) {
  if (typeof define === 'function' && define.amd) {
    define(['jquery', 'modernizr'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('jquery'), window.Modernizr);
  } else {
    window.Shuffle = factory(window.jQuery, window.Modernizr);
  }
})(function($, Modernizr, undefined) {

'use strict';
