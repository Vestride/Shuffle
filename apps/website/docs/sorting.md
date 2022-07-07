---
sidebar_position: 7
---

# Sorting

You can order the elements with a function you supply. In the demo above, each item has a `data-date-created` and `data-title` attribute which are used for sorting.

```html
<figure class="picture-item" data-groups='["city"]' data-date-created="2016-06-09" data-title="Crossroads">…</figure>

<select class="sort-options">
  <option value="">Default</option>
  <option value="title">Title</option>
  <option value="date-created">Date Created</option>
</select>
```

```js
addSorting() {
  document.querySelector('.sort-options').addEventListener('change', this._handleSortChange.bind(this));
}

_handleSortChange(event) {
  const value = event.target.value;

  function sortByDate(element) {
    return element.dataset.created;
  }

  function sortByTitle(element) {
    return element.dataset.title.toLowerCase();
  }

  let options;
  if (value === 'date-created') {
    options = {
      reverse: true,
      by: sortByDate,
    };
  } else if (value === 'title') {
    options = {
      by: sortByTitle,
    };
  } else {
    options = {};
  }

  this.shuffle.sort(options);
}
```

The `options` object can contain three properties:

- `reverse`: a boolean which will reverse the resulting order.
- `by`: a function with an element as the parameter. Above, we’re returning the value of the `data-date-created` or `data-title` attribute.
- `randomize`: Make the order random.

Returning `undefined` from the `by` function will reset the order to DOM order.

Calling sort with an empty object will reset the elements to DOM order.

:::tip

Check out the homepage [demo](/).

:::

## Filter and sort

You can filter and sort at the same time by passing a sort object, which has the same shape as the `sort` function above, as the second parameter.

```js
shuffleInstance.filter('space', {
  by: (element) => {
    return element.dataset.title.toLowerCase();
  },
});
```

## Advanced sorting

You can provide the entire sort compare function if you need more control.

The parameters (`a`, `b`) are `ShuffleItem` instances and you'll probably only use the `element` property. The `reverse` option still works with the `compare` function if you need it.

For example, if you wanted to sort by the first group in `data-groups`, then by `data-age`, you could do this:

```js
shuffleInstance.sort({
  compare: (a, b) => {
    // Sort by first group, then by age.
    const groupA = JSON.parse(a.element.dataset.groups)[0];
    const groupB = JSON.parse(b.element.dataset.groups)[0];
    if (groupA > groupB) {
      return 1;
    }
    if (groupA < groupB) {
      return -1;
    }

    // At this point, the group strings are the exact same. Test the age.
    const ageA = parseInt(a.element.dataset.age, 10);
    const ageB = parseInt(b.element.dataset.age, 10);
    return ageA - ageB;
  },
});
```
