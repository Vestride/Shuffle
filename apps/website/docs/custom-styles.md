---
sidebar_position: 11
---

# Custom styles

You can customize the default styles which are applied to Shuffle items upon initialization, before layout, after layout, before hiding, and after hidden.

Here are the defaults:

```js
ShuffleItem.Css = {
  INITIAL: {
    position: 'absolute',
    top: 0,
    visibility: 'visible',
    willChange: 'transform',
  },
  DIRECTION: {
    ltr: {
      left: 0,
    },
    rtl: {
      right: 0,
    },
  },
  VISIBLE: {
    before: {
      opacity: 1,
      visibility: 'visible',
    },
    after: {
      transitionDelay: '',
    },
  },
  HIDDEN: {
    before: {
      opacity: 0,
    },
    after: {
      visibility: 'hidden',
      transitionDelay: '',
    },
  },
};

ShuffleItem.Scale = {
  VISIBLE: 1,
  HIDDEN: 0.001,
};
```

If you wanted to add a 50% red background to every item when they initialize, you could do this:

```js
Shuffle.ShuffleItem.Css.INITIAL.backgroundColor = 'rgba(255, 0, 0, 0.5)';
```

To set the text color to `teal` after the item has finished moving:

```js
Shuffle.ShuffleItem.Css.VISIBLE.after.color = 'teal';
```

You can also customize the scaling effect with visible or hidden items.

```js
Shuffle.ShuffleItem.Scale.HIDDEN = 0.5;
```
