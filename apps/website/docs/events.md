---
sidebar_position: 8
---

# Events

Shuffle is a subclass of [TinyEmitter](https://www.npmjs.com/package/tiny-emitter). It emits an event when a layout happens and when elements are removed. The event names are `Shuffle.EventType.LAYOUT` and `Shuffle.EventType.REMOVED`.

## Get notified when a layout happens

```js
shuffleInstance.on(Shuffle.EventType.LAYOUT, () => {
  console.log('Things finished moving!');
});
```

## Do something when an item is removed

```js
shuffleInstance.on(Shuffle.EventType.REMOVED, (data) => {
  console.log(this, data, data.collection, data.shuffle);
});
```

:::tip

Check out the homepage [demo](/). It adds these events and logs them to the console.

:::
