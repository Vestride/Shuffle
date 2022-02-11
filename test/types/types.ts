import Shuffle, { ShuffleOptions, SortOptions } from '../../';

Shuffle.ALL_ITEMS = 'item';
Shuffle.FILTER_ATTRIBUTE_KEY = 'categories';

const mainElement = document.getElementById('grid');

if (!mainElement) {
  throw new TypeError('oopsie');
}

console.log(Shuffle.EventType.LAYOUT, Shuffle.Classes.SHUFFLE_ITEM, Shuffle.FilterMode.ALL, Shuffle.ShuffleItem.Css);

const options: ShuffleOptions = {
  buffer: 0,
  columnThreshold: 0.01,
  easing: 'ease-in-out',
  itemSelector: '.picture-item',
  sizer: '.my-sizer',
  filterMode: Shuffle.FilterMode.ALL,
};
const shuffle = new Shuffle(mainElement, options);

shuffle.on(Shuffle.EventType.REMOVED, (data) => {
  console.log(data.shuffle);
  console.log(data.collection);
});

shuffle.off(Shuffle.EventType.REMOVED);

shuffle.filter('wallpaper');
shuffle.filter(function filterEachItem(element, shuffle) {
  console.log(`shuffle id: ${shuffle.id}, element id: ${element.id}`);
  const reviews = this.dataset.reviews;
  return !!reviews && parseInt(reviews, 10) > 2;
});

const sortOptions: SortOptions = {
  randomize: true,
  reverse: false,
  by: (element: Shuffle.ShuffleItem['element']) => element.dataset.reviews,
  compare(a: Shuffle.ShuffleItem, b: Shuffle.ShuffleItem) {
    return 0;
  },
};
shuffle.sort(sortOptions);
console.log(shuffle.sortedItems);

shuffle.update();
shuffle.update({
  recalculateSizes: true,
  force: true,
});
Shuffle.getSize(mainElement, true);

const rect1 = new Shuffle.Rect(0, 0, 20, 20);
const rect2 = new Shuffle.Rect(10, 10, 30, 30);
console.log(Shuffle.Rect.intersects(rect1, rect2));

export default shuffle;
