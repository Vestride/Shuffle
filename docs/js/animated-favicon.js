'use strict';

var Sprite = function (context, img, size) {
  this.ctx = context;
  this.img = img;
  this.width = size;
  this.height = size;
  this.frameWidth = size;
  this.frameHeight = size;
};

// Assuming horizontal sprite
Sprite.prototype.getFrame = function (frame) {
  return {
    x: frame * this.frameWidth,
    y: 0,
  };
};

Sprite.prototype.clearCanvas = function () {
  this.ctx.clearRect(0, 0, this.width, this.height);
};

Sprite.prototype.drawFrame = function (frameNumber) {
  var frame = this.getFrame(frameNumber);

  // Clear out the last frame
  this.clearCanvas();

  // Draw to the context. This method is really confusing...
  this.ctx.drawImage(
    this.img,
    frame.x,
    frame.y,
    this.width,
    this.height,
    0,
    0,
    this.width,
    this.height
  );
};

var Favicon = function (src, numFrames, framesPerAnimation, animationDelay) {

  // Variables based on params
  this.src = src;
  this.numFrames = numFrames;
  this.framesPerAnimation = framesPerAnimation;
  this.animationDelay = animationDelay;

  // Elements
  this.canvas = document.createElement('canvas');
  this.img = document.createElement('img');
  this.html = document.documentElement;

  // Calculations
  this.size = window.devicePixelRatio > 1 ? 32 : 16;

  // If it's not a data url, pick apart the filename and add @2x for retina
  if (!this.src.match(/data:/) && window.devicePixelRatio > 1) {
    var dot = this.src.lastIndexOf('.');
    this.src = this.src.substring(0, dot) + '@2x' + this.src.substring(dot);
  }

  this.currentFrame = 0;

  // Chrome chokes on this. It looks like it can handle 4 frames per second
  this.fps = 24;

  // No #favicon element, stop
  if (!document.getElementById('favicon')) {
    return;
  }

  // Save context
  this.ctx = this.canvas.getContext('2d');

  // Set canvas dimensions based on device DPI
  this.canvas.height = this.canvas.width = this.size;

  // Create a new sprite 32x32 size with 32x32 sprites
  this.sprite = new Sprite(this.ctx, this.img, this.size);

  // Bind the image load handler
  this.img.onload = this.onSpriteLoaded.bind(this);

  // Trigger image to load
  this.img.src = this.src;
};

Favicon.prototype.getData = function () {
  return this.canvas.toDataURL('image/png');
};

// Clone the current #favicon and replace it with a new element
// which has the updated data URI href
Favicon.prototype.setFavicon = function () {
  var data = this.getData();
  var originalFavicon = document.getElementById('favicon');
  var clone = originalFavicon.cloneNode(true);

  clone.setAttribute('href', data);
  originalFavicon.parentNode.replaceChild(clone, originalFavicon);
};

// Request Animation Frame Loop
Favicon.prototype.loop = function (timestamp) {
  // If not enough time has elapse since the last call
  // immediately call the next rAF
  if (timestamp - this.lastExecuted < this.timeToElapse) {
    return requestAnimationFrame(this.loop.bind(this));
  }

  // Increment current frame
  this.currentFrame += 1;
  if (this.currentFrame === this.numFrames) {
    this.currentFrame = 0;
  }

  // Completed an animation state
  this.timeToElapse = this.currentFrame % this.framesPerAnimation === 0 ?
    this.animationDelay :
    1000 / this.fps;

  // Draw current frame from sprite
  this.sprite.drawFrame(this.currentFrame);

  // Swap <link>
  this.setFavicon();

  // Set a timeout to draw again
  this.lastExecuted = timestamp;

  // Continue loop
  return requestAnimationFrame(this.loop.bind(this));
};

// Sprite loaded
Favicon.prototype.onSpriteLoaded = function () {
  // Draw the first frame when the image loads
  this.sprite.drawFrame(this.currentFrame);

  // Swap <link>
  this.setFavicon();

  // Start loop
  requestAnimationFrame(this.loop.bind(this));
};

new Favicon(window.site_url + '/img/favicon-sprite.png', 21, 7, 3000 * 1);
