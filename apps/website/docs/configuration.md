---
sidebar_position: 4
---

# Configuring Shuffle

Here are the options you can change, as well as their defaults. The `Shuffle.options` property contains all the defaults.

No options _need_ to be specified, but `itemSelector` should be used. Other common options to change are `speed` and `sizer`.

## Options

### `buffer` [number]

Default: `0`

Useful for percentage based heights when they might not always be exactly the same (in pixels).

### `columnThreshold` [number]

Default: `0.01`

Reading the width of elements isn't precise enough and can cause columns to jump between values.

### `columnWidth` [number | (conatinerWidth: number) => number]

Default: `0`

A static number or function that returns a number which determines how wide the columns are (in pixels).

### `delimiter` [string | null]

Default: `null`

Set a delimiter to parse the `data-groups` attribute with using `String.prototype.split()`, instead of using `JSON.parse()`. For example, if your HTML was `data-groups="nature,city"`, you could set `delimiter: ','`.

### `easing` [string]

Default: `'cubic-bezier(0.4, 0.0, 0.2, 1)'`

CSS easing function to use.

### `filterMode` [Shuffle.FilterMode]

Default: `Shuffle.FilterMode.ANY`

Affects using an array with filter. e.g. `filter(['one', 'two'])`. With "any", the element passes the test if any of its groups are in the array. With "all", the element only passes if all groups are in the array.

### `group` [string]

Default: `Shuffle.ALL_ITEMS` (`"all"`)

Initial filter group.

### `gutterWidth` [number | (conatinerWidth: number) => number]

Default: `0`

A static number or function that determines how wide the gutters between columns are (in pixels).

### `initialSort` [SortOptions | null]

Default: `null`

Shuffle can be initialized with a sort object. It is the same object given to the sort method.

### `isCentered` [boolean]

Default: `false`

Whether to center grid items in the row with the leftover space.

### `isRTL` [boolean]

Default: `false`

Whether to align grid items to the right in the row.

### `itemSelector` [string]

Default: `'*'`

Query selector to find Shuffle items. e.g. '.picture-item'.

### `roundTransforms` [boolean]

Default: `true`

Whether to round pixel values used in translate(x, y). This usually avoids blurriness.

### `sizer` [HTMLElement | string | null]

Default: `null`

Element or selector string. Use an element to determine the size of columns and gutters.

### `speed` [number]

Default: `250`

Transition/animation speed (milliseconds).

### `staggerAmount` [number]

Default: `15`

Transition delay offset for each item in milliseconds.

### `staggerAmountMax` [number]

Default: `150`

Maximum stagger delay in milliseconds. This caps the stagger amount so that it does not exceed the given value. Since the transition delay is incremented for each item in the grid, this is useful for large grids of items.

### `useTransforms` [boolean]

Default: `false`

Whether to use absolute positioning instead of transforms.

## Sorting object

### `by` [(element: HTMLElement) => any]

Default: `null`

Sorting function which gives you the element each shuffle item is using by default.

Returning `undefined` from the `by` function will reset the order to DOM order.

### `compare` [(a: Shuffle.ShuffleItem, b: Shuffle.ShuffleItem) => number]

Default: `null`

Instead of using the simple `by` function, you can use the `compare` function provide a completely custom sorting function.

:::tip

See [Advanced sorting](./sorting.md#advanced-sorting) for usage.

:::

### `key` [keyof Shuffle.ShuffleItem]

Default: `'element'`

Determines which property of the `ShuffleItem` instance is passed to the `by` function.

### `randomize` [boolean]

Default: `false`

If true, this will skip the sorting and return a randomized order in the array.

### `reverse` [boolean]

Default: `false`

Use array.reverse() to reverse the results of your sort.
