# [Shuffle][homepage] [![Build Status][travis-img]][travis-url] [![Dependency Status][david-img]][david-url] [![Greenkeeper badge][greenkeeper-img]][greenkeeper-img] [![NPM version][npm-img]][npm-url]

Categorize, sort, and filter a responsive grid of items.

```bash
npm install shufflejs
```

## Docs and Demos

[All found here][homepage]

### Usage (with ES6)

```js
import Shuffle from 'shufflejs';

const shuffleInstance = new Shuffle(document.getElementById('grid'), {
  itemSelector: '.js-item',
  sizer: '.js-shuffle-sizer'
});
```

## Inspiration

This project was inspired by [Isotope](http://isotope.metafizzy.co/) and [Packery](http://packery.metafizzy.co/).

[homepage]: https://vestride.github.io/Shuffle/
[travis-url]: https://travis-ci.org/Vestride/Shuffle
[travis-img]: https://travis-ci.org/Vestride/Shuffle.svg?branch=master
[david-url]: https://david-dm.org/Vestride/Shuffle
[david-img]: https://david-dm.org/Vestride/Shuffle.svg
[npm-url]: https://www.npmjs.com/package/shufflejs
[npm-img]: https://img.shields.io/npm/v/shufflejs.svg
[greenkeeper-url]: https://greenkeeper.io/
[greenkeeper-img]: https://badges.greenkeeper.io/Vestride/Shuffle.svg
