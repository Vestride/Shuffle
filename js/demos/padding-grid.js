'use strict';

window.demo = new window.Shuffle(document.getElementById('grid'), {
  itemSelector: '.grid__brick',
  sizer: document.querySelector('#grid .my-sizer-element'),
});
