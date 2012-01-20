# [jQuery Shuffle Plugin] (http://vestride.github.com/Shuffle)

## Features

* Uses CSS transitions!
* Filter items by categories
* Items can have multiple categories

## How to Use

```js
var options = {
    'itemWidth' : 230, // Width of the grid item
    'margins' : 20, // right and bottom margins
    'key' : 'all' // Which category to show
};
$('#grid').shuffle(options);
```

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
    <li class="active" data-key="all">Most Recent</li>
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
    $('.filter-options li').click(function() {
        var $this = $(this),
            $grid = $('#grid');

        // Hide current label, show current label in title
        $('.filter-options .active').removeClass('active');
        $this.addClass('active');

        // Filter elements
        $grid.shuffle('shuffle', $this.attr('data-key'));
    });

    var options = {
        'itemWidth' : 230, // Width of the grid item
        'margins' : 20, // right and bottom margins
        'key' : 'all' // Which category to show
    };
    // instantiate the plugin
    $('#grid').shuffle(options);
});
```

## The CSS
This is all that's in `shuffle.css`.

```css
#grid {
    position: relative;

     -moz-transition: height 0.8s ease-out;
       -o-transition: height 0.8s ease-out;
  -webkit-transition: height 0.8s ease-out;
      -ms-transition: height 0.8s ease-out;
          transition: height 0.8s ease-out;
}

#grid .item {
    position: relative;

     -moz-transition: -moz-transform 0.8s ease-out, opacity 0.8s ease-out;
       -o-transition: -o-transform 0.8s ease-out, opacity 0.8s ease-out;
  -webkit-transition: -webkit-transform 0.8s ease-out, opacity 0.8s ease-out;
      -ms-transition: -ms-transform 0.8s ease-out, opacity 0.8s ease-out;
          transition: transform 0.8s ease-out, opacity 0.8s ease-out;
}

#grid .item.filtered {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 1;
}

#grid .item.concealed {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
}

#grid .item:nth-child(4n) {
    margin-right: 0;
}
```

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

## Links
                
* [Github repo] (https://github.com/Vestride/Shuffle)
* [Inspired by Isotope](http://isotope.metafizzy.co/)
* [Me] (http://glencheney.com)