# [jQuery Shuffle Plugin](http://vestride.github.com/Shuffle)

## Features

* Uses CSS transitions!
* Filter items by categories
* Items can have multiple categories

## How to Use

Settings you can change (these are the defaults)

```js
var options = {
    group : 'all' // Which category to show
    speed : 800, // Speed of the transition (in milliseconds). 800 = .8 seconds
    easing : 'ease-out' // css easing function to use
};
$('#grid').shuffle(options);
```

The easing function is one of `default`, `linear`, `ease-in`, `ease-out`, `ease-in-out`, or `cubic-bezier`.

### The HTML
The html structure. The only real important thing here is the 'data-groups' attribute. It has to be a [valid JSON](http://jsonlint.com/) array of strings.

```html
<div id="grid">
    <div class="item" data-groups='["photography"]' data-date-created="2010-09-14" data-title="Baseball">
        <img src="img/baseball.png" />
        <div class="item-details">
            <a href="#">Photography</a>
        </div>
    </div>
    <div class="item" data-groups='["wallpaper", "3d"]' data-date-created="2011-08-14" data-title="Tennis">
        <img src="img/tennis-ball.png" />
        <div class="item-details">
            <a href="#">3D Render, Wallpaper</a>
        </div>
    </div>
    <div class="item" data-groups='["3d", "wallpaper"]' data-date-created="2009-05-27" data-title="iMac">
        <img src="img/imac.png" />
        <div class="item-details">
            <a href="#">3D Render, Wallpaper</a>
        </div>
    </div>
    <div class="item" data-groups='["graphics"]' data-date-created="2012-05-14" data-title="Master Chief">
        <img src="img/master-chief.png" />
        <div class="item-details">
            <a href="#">Graphic Design</a>
        </div>
    </div>
</div>
```

Shuffle takes the width, margin-top, and marigin-right from the `.item`.
```css
#grid .item {
    width: 230px;
    margin-top: 20px;
    margin-right: 20px;
}
```


## How to "Shuffle"
Say you have this markup for your options

```html
<ul class="filter-options">
    <li data-group="all" class="active">Most Recent</li>
    <li data-group="wallpaper">Wallpapers</li>
    <li data-group="graphics">Graphic Design</li>
    <li data-group="photography">Photography</li>
    <li data-group="3d">3D Renders</li>
</ul>
```
And when you click on a li, you want the plugin to shuffle. Here's an example:

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
        $grid.shuffle($this.data('group'));
    });

    // instantiate the plugin
    $('#grid').shuffle({
        group : 'all',
        speed : 800,
        easing : 'ease-out'
    });
});
```
These events will be triggered at their respective times: `shrink.shuffle`, `shrunk.shuffle`, `filter.shuffle`, `filtered.shuffle`, and `sorted.shuffle`.

## Sorting

You can order the elements based off a function you supply. In the example above, each item has a `data-date-created` and `data-title` attribute. The filter buttons have a `data-sort` attribute with the value of the item&rsquo;s attribute. Then, with some JavaScript, we can get the correct attribute and provide a function to sort by.

```html
<li data-sort="title">Title</li>
```

```html
<div class="item" data-title="Baseball">…</div>
```

```javascript
// Sorting options
$('.sort-options li').on('click', function() {
    var $this = $(this),
        $grid = $('#grid'),
        sort = $this.data('sort'),
        opts = {};

    // Hide current label, show current label in title
    $('.sort-options .active').removeClass('active');
    $this.addClass('active');

    // We're given the element wrapped in jQuery
    if (sort === 'date-created') {
        opts = {
            by: function($el) {
                return $el.data('date-created');
            }
        }
    } else if (sort === 'title') {
        opts = {
            by: function($el) {
                return $el.data('title').toLowerCase();
            }
        }
    }


    // Filter elements
    $grid.shuffle('sort', opts);
});
```

The `opts` parameter can contain two properties. `reverse`, a boolean which will reverse the array. `by` is a function that is passed the element wrapped in jQuery. In the case above, we&rsquo;re returning the value of the data-date-created or data-title attributes.

Calling sort with an empty object will reset the elements to DOM order.

## Advanced Filtering

By passing a function to shuffle, you can customize the filtering to your hearts content. Shuffle will iterate over each item in the container and give your function the element wrapped in jQuery and the shuffle instance. Return `true` to keep the element or `false` to hide it.

### Example

```javascript
// Filters elements with a data-title attribute with less than 10 characters
$('#grid').shuffle(function($el, shuffle) {
    return $el.data('title').length < 10;
});
```

### Searching

```javascript
// Advanced filtering
$('.filter .search').on('keyup change', function() {
    var val = this.value.toLowerCase();
    $('#grid').shuffle(function($el, shuffle) {

        // Only search elements in the current group
        if (shuffle.group !== 'all' && $.inArray(shuffle.group, $el.data('groups')) === -1) {
            return false;
        }

        // Get the text inside our element and search for the value in the input
        var text = $.trim($el.text()).toLowerCase();
        return text.indexOf(val) != -1;
    });
});
```

## Dependencies

* jQuery
* Modernizr

A custom Modernizr build has been included with the plugin. If you already have Modernizr on your site, you may delete it. If you don't know what Modernizr is, leave it!

## Supported Browsers

* Chrome
* Firefox
* IE 7+
* Opera
* Safari

_Browsers that don't support CSS transitions and transforms *cough* IE <= 9 *cough* will see a less cool, javascript based version of the effect._

## Changes

* 9.17.12 - Added sorting ability, made plugin responsive, added advanced filtering method. Updated to Modernizr 2.6.2
* 7.21.12 - Rewrote plugin in more object oriented structure. Added custom events. Updated to Modernizr 2.6.1.
* 7.3.12 - Removed dependency on the css file and now apply the css with javascript. Updated Modernizr to 2.5.3.

## Links
                
* [Github repo](https://github.com/Vestride/Shuffle)
* [Inspired by Isotope](http://isotope.metafizzy.co/)
* [Me](http://glencheney.com)