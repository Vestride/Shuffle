# [Shuffle](http://vestride.github.io/Shuffle)
Categorize, sort, and filter a responsive grid of items

## Docs and Demos
[All found here](http://vestride.github.io/Shuffle)

## Shuffle 2.0
This is a large improvement to shuffle. Most notably, the ability for [masonry](http://masonry.desandro.com) layouts. Other additions include adding/removing items, enabling/disabling, multiple instances on a page, and more!

## Running locally
This project uses [Jekyll](http://jekyllrb.com/), so:
* head over to [their quickstart guide](http://jekyllrb.com/docs/quickstart/) to setup jekyll.
* run `jekyll serve --watch --config _config.yml,_config_dev.yml` in your console
* go to `http://localhost:4000` to see it.

The `--config` option can take multiple config files. In this case, the `_config_dev.yml` file overrides options set in `_config.yml`.

## Improvements still to make
* Use Deferred objects for callbacks
* Horizontal layout

Inspired by [Isotope](http://isotope.metafizzy.co/) and [Packery](http://packery.metafizzy.co/).
