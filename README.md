# [Shuffle](https://vestride.github.io/Shuffle) [![Build Status](https://travis-ci.org/Vestride/Shuffle.svg?branch=master)](https://travis-ci.org/Vestride/Shuffle)
Categorize, sort, and filter a responsive grid of items.

```bash
npm install shufflejs
```

Shuffle is also available on bower as `shufflejs`.

## Docs and Demos
[All found here](https://vestride.github.io/Shuffle)

### Usage (with CommonJS)

```js
var Shuffle = require('shuffle');

var myShuffle = new Shuffle(document.getElementById('grid'), {
  itemSelector: '.js-item',
  sizer: '.js-shuffle-sizer'
});
```

## Shuffle 4.0
Shuffle 4 removes jQuery as a dependency and is written in ES6.

## Inspiration
This project was inspired by [Isotope](http://isotope.metafizzy.co/) and [Packery](http://packery.metafizzy.co/).
