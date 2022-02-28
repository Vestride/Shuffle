---
sidebar_position: 3
---

# How column widths work

There are 4 options for defining the width of the columns:

1. Use a **sizer** element. This is the easiest way to specify column and gutter widths. Add the sizer element and make it 1 column wide. Shuffle will measure the `width` and `margin-left` of this `sizer` element each time the grid resizes. This is awesome for responsive or fluid grids where the width of a column is a percentage.

   ```js
   const shuffleInstance = new Shuffle(element, {
     itemSelector: '.picture-item',
     // highlight-next-line
     sizer: '.js-shuffle-sizer',
   });
   ```

1. Use a **function**. When a function is used, its first parameter will be the width of the shuffle element. You need to return the column width for shuffle to use (in pixels).

   ```js
   const shuffleInstance = new Shuffle(element, {
     itemSelector: '.picture-item',
     // highlight-next-line
     columnWidth: (containerWidth) => 0.18 * containerWidth,
   });
   ```

1. A **number**. This will explicitly set the column width to your number (in pixels).

   ```js
   const shuffleInstance = new Shuffle(element, {
     itemSelector: '.picture-item',
     // highlight-next-line
     columnWidth: 200,
   });
   ```

1. By default, shuffle will use the width of the first item to calculate the column width.

   ```js
   const shuffleInstance = new Shuffle(element, {
     itemSelector: '.picture-item',
   });
   ```
