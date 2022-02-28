---
sidebar_position: 4
---

# Filters

## Filter by a group

Use the `filter()` method. If, for example, you wanted to show only items that match `"space"`, you would do this:

```js
shuffleInstance.filter('space');
```

## Filter by multiple groups

Show multiple groups at once by using an array.

```js
shuffleInstance.filter(['space', 'nature']);
```

By default, this will show items that match `space` _or_ `nature`. To show only groups that match `space` _and_ `nature`, set the `filterMode` option to `Shuffle.FilterMode.ALL`.

## Show all items

To go back to having no items filtered, you can call `filter()` without a parameter, or use `Shuffle.ALL_ITEMS` (which by default is the string `"all"`).

```js
shuffleInstance.filter(Shuffle.ALL_ITEMS); // or .filter()
```

## Overrides

You can override both `Shuffle.ALL_ITEMS` and `Shuffle.FILTER_ATTRIBUTE_KEY` if you want.

```js
// Defaults
Shuffle.ALL_ITEMS = 'all';
Shuffle.FILTER_ATTRIBUTE_KEY = 'groups';

// You can change them to something else.
Shuffle.ALL_ITEMS = 'any';
Shuffle.FILTER_ATTRIBUTE_KEY = 'categories';
```

Then you would have to use `data-categories` attribute on your items instead of `data-groups`.
