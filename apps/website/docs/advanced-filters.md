---
sidebar_position: 5
---

# Advanced filters

By passing a function to `filter`, you can fully customize filtering items. Shuffle will iterate over each item and give your function the element and the shuffle instance. Return `true` to keep the element or `false` to hide it.

## Example

```js
// Filters elements with a data-title attribute with less than 10 characters
shuffleInstance.filter((element) => element.dataset.title.length < 10);
```

## Searching

```js
// Add an event listener for key presses.
document.querySelector('.js-shuffle-search').addEventListener('keyup', handleSearchKeyup);

// Filter the shuffle instance by items with a title that matches the search input.
function handleSearchKeyup(event) {
  const searchText = event.target.value.toLowerCase();

  shuffleInstance.filter((element, shuffle) => {
    const titleElement = element.querySelector('.picture-item__title');
    const titleText = titleElement.textContent.toLowerCase().trim();

    return titleText.includes(searchText);
  });
}
```

In this example, when the user presses a key in the input, we call `filter` on shuffle with a callback function. Inside the callback function, we return whether the current shuffle item contains the search text.

:::tip

Check out the [compounded filters demo](https://codepen.io/Vestride/details/qBVRKvx).

:::
