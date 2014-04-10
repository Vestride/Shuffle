(function (factory) {
  if (typeof define === 'function' && define.amd) {
    define(['jquery', 'modernizr'], factory);
  } else {
    factory(window.$, window.Modernizr);
  }
})(function($, Modernizr, undefined) {

'use strict';
