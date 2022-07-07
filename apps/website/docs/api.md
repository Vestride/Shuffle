---
sidebar_position: 10
---

# API

A list of the methods available to you and what they do.

## `filter(category?, sortObject?)`

Filters all the shuffle items and then sorts them.

- `category` can be a string, array of strings, or a function. Learn more in [filters](./filters.md).
- The `sortObject` is optional, defaulting to the last-used sort object.

## `sort(sortObject?)`

Sorts the currently filtered shuffle items.

Calling sort with an empty object will reset the elements to DOM order.

See the [SortOptions](./configuration.md#sorting-object) for the available properties.

## `update(options?)`

Repositions everything. Useful for when dimensions (like the window size) change.

You may provide an options object containing the following properties:

- `recalculateSizes`: Whether to recalculate column, gutter, and container widths again. Defaults to `true`.
- `force`: By default, `update` does nothing if the instance is disabled. Setting this to true forces the update to happen regardless.

## `layout()`

Use this instead of `update()` if you don't need the columns and gutters updated. Maybe an image inside `shuffle` loaded (and now has a height), which means calculations could be off.

## `add(newItems)`

New items have been appended to the shuffle container. `newItems` is an array of elements.

## `disable()`

Disables Shuffle from updating dimensions and layout on resize.

## `enable(isUpdateLayout?)`

Enables Shuffle again. If you pass `false` as the first parameter, you can tell Shuffle to skip the layout recalculation.

## `remove(elements)`

Remove one or more shuffle items. `elements` is an array containing one or more elements.

## `getItemByElement(element)`

Retrieve a `ShuffleItem` by its element.

## `destroy()`

Destroys Shuffle, removes events, styles, classes, and references.
