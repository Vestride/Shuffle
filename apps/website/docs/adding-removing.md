---
sidebar_position: 9
---

# Adding and removing items

You can add and remove elements from shuffle after it has been created. This also works for infinite scrolling.

## Adding elements

Wherever you add the element in the DOM is where it will show up in the grid (assuming you’re using the default sort-by-dom-order). With this in mind, you can append, prepend, or insert elements wherever you need to get them to show up in the right order.

```js
/**
 * Create some DOM elements, append them to the shuffle container, then notify
 * shuffle about the new items. You could also insert the HTML as a string.
 */
onAppendBoxes() {
  const elements = this._getArrayOfElementsToAdd();

  elements.forEach((element) => {
    this.shuffle.element.appendChild(element);
  });

  // Tell shuffle elements have been appended.
  // It expects an array of elements as the parameter.
  this.shuffle.add(elements);
}
```

## Removing elements

Shuffle will animate the element away and then remove it from the DOM once it's finished. It will then emit the `Shuffle.EventType.REMOVED` event with the array of elements in `event.collection`.

```js
this.shuffle.remove([element1, element2]);
```

:::tip

Check out the [adding and removing demo](https://codepen.io/Vestride/details/yLParZL).

:::
