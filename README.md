# [jQuery Shuffle Plugin](http://vestride.github.com/Shuffle)

## Features

* Uses CSS transitions!
* Filter items by categories
* Items can have multiple categories

## How to Use

Settings you can change (these are the defaults)

```js
var options = {
    itemWidth : 230, // Width of the grid item
    marginTop : 20, // Top margin
    marginRight: 20, // Right margin
    key : 'all' // Which category to show
    speed : 800, // Speed of the transition (in milliseconds). 800 = .8 seconds
    easing : 'ease-out' // css easing function to use
};
$('#grid').shuffle(options);
```

The easing function is one of `default`, `linear`, `ease-in`, `ease-out`, `ease-in-out`, or `cubic-bezier`.

### The HTML
The html structure. The only real important thing here is the 'data-key' attribute. It has to be a [valid JSON](http://jsonlint.com/) array of strings.

```html
<div id="grid">
    <div class="item" data-key='["photography"]'>
        <img src="img/baseball.png" alt="" height="145" width="230" />
        <div class="item-details">
            <a href="#">Photography</a>
        </div>
    </div>
    <div class="item" data-key='["wallpaper", "3d"]'>
        <img src="img/tennis-ball.png" alt="" height="145" width="230"  />
        <div class="item-details">
            <a href="#">3D Render, Wallpaper</a>
        </div>
    </div>
    <div class="item" data-key='["3d", "wallpaper"]'>
        <img src="img/imac.png" alt="" height="145" width="230"  />
        <div class="item-details">
            <a href="#">3D Render, Wallpaper</a>
        </div>
    </div>
    <div class="item" data-key='["graphics"]'>
        <img src="img/master-chief.png" alt="" height="145" width="230"  />
        <div class="item-details">
            <a href="#">Graphic Design</a>
        </div>
    </div>
</div>
```

## How to "Shuffle"
Say you have this markup

```html
<ul class="filter-options">
    <li data-key="all" class="active">Most Recent</li>
    <li data-key="wallpaper">Wallpapers</li>
    <li data-key="graphics">Graphic Design</li>
    <li data-key="photography">Photography</li>
    <li data-key="3d">3D Renders</li>
    <li data-key="motion">Motion Graphics</li>
</ul>
```
And when you click on a li, you want the plugin to shuffle (you need to call the 'shuffle' method). Here's an example:

```js
$(document).ready(function(){

    // Set up button clicks
    $('.filter-options li').on('click', function() {
        var $this = $(this),
            $grid = $('#grid');

        // Hide current label, show current label in title
        $('.filter-options .active').removeClass('active');
        $this.addClass('active');

        // Filter elements
        $grid.shuffle($this.attr('data-key'));
    });

    // instantiate the plugin
    $('#grid').shuffle({
        itemWidth : 230,
        marginTop : 20,
        marginRight: 20,
        key : 'all',
        speed : 800,
        easing : 'ease-out'
    });
});
```
Events that get triggered: `shrink.shuffle`, `shrunk.shuffle`, `filter.shuffle`, and `filtered.shuffle`.

## Dependencies

* jQuery
* Modernizr
** A custom Modernizr build has been included with the plugin.
** If you already have Modernizr on your site, you may delete it.
** If you don't know what Modernizr is, leave it!

## Supported Browsers

* Chrome
* Firefox
* IE 7+
* Opera
* Safari

_Browsers that don't support CSS transitions and transforms *cough* IE <= 9 *cough* will see a less cool, javascript based version of the effect._

## Changes

* 7.21.12 - Rewrote plugin in more object oriented structure. Added custom events. Updated to Modernizr 2.6.1.
* 7.3.12 - Removed dependency on the css file and now apply the css with javascript. Updated Modernizr to 2.5.3.

## Links
                
* [Github repo](https://github.com/Vestride/Shuffle)
* [Inspired by Isotope](http://isotope.metafizzy.co/)
* [Me](http://glencheney.com)