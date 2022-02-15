const Shuffle = window.Shuffle;

class Demo {
  constructor(element) {
    this.element = element;
    this.initShuffle();
    this.setupEvents();
  }

  // Column width and gutter width options can be functions
  initShuffle() {
    this.shuffle = new Shuffle(this.element, {
      itemSelector: '.box',
      speed: 250,
      easing: 'ease',
      // .box's have a width of 18%
      columnWidth: (containerWidth) => 0.18 * containerWidth,
      // .box's have a margin-left of 2.5%
      gutterWidth: (containerWidth) => 0.025 * containerWidth,
    });
  }

  setupEvents() {
    document.querySelector('#append').addEventListener('click', this.onAppendBoxes.bind(this));
    document.querySelector('#prepend').addEventListener('click', this.onPrependBoxes.bind(this));
    document.querySelector('#randomize').addEventListener('click', this.onRandomize.bind(this));
    document.querySelector('#remove').addEventListener('click', this.onRemoveClick.bind(this));
    document.querySelector('#sorter').addEventListener('change', this.onSortChange.bind(this));
    document.querySelector('#filterer').addEventListener('change', this.onFilterChange.bind(this));
    this.shuffle.element.addEventListener('click', this.onContainerClick.bind(this));

    // Show off some shuffle events
    this.shuffle.on(Shuffle.EventType.REMOVED, (data) => {
      console.log(data);
    });
  }

  /**
   * Generate random DOM elements.
   * @param {number} itemsToCreate Number of items to create.
   * @return {Array.<Element>} Array of elements.
   */
  _generateBoxes(itemsToCreate) {
    // Creating random elements. You could use an ajax request or clone elements instead.
    const items = [];
    const modifierClasses = ['w2', 'h2', 'w3'];

    for (let i = 0; i < itemsToCreate; i++) {
      const random = Math.random();
      const box = document.createElement('div');
      box.className = 'box';
      box.style.backgroundColor = this.getRandomColor();
      box.setAttribute('data-reviews', this.getRandomInt(1, 150));

      // Randomly add a class
      if (random > 0.8) {
        const randomClass = Math.floor(Math.random() * 3);
        box.className = box.className + ' ' + modifierClasses[randomClass];
      }

      items.push(box);
    }

    return items;
  }

  /**
   * Return an array of elements which have already been added to the DOM.
   * @return {Array.<Element>}
   */
  _getArrayOfElementsToAdd() {
    return this._generateBoxes(5);
  }

  /**
   * Create an HTML string to insert. This could, for example, come from an XHR request.
   * @return {string} A mock HTML string.
   */
  _getHtmlMarkupToAdd() {
    const fragment = document.createDocumentFragment();
    this._generateBoxes(5).forEach((item) => {
      fragment.appendChild(item);
    });

    const dummy = document.createElement('div');
    dummy.appendChild(fragment);
    return dummy.innerHTML;
  }

  /**
   * Create some DOM elements, append them to the shuffle container, then notify
   * shuffle about the new items. You could also insert the HTML as a string.
   */
  onAppendBoxes() {
    const elements = this._getArrayOfElementsToAdd();

    elements.forEach((element) => {
      this.shuffle.element.appendChild(element);
    });

    // Tell shuffle items have been appended.
    // It expects an array of elements as the parameter.
    this.shuffle.add(elements);
  }

  /**
   * Show that you can prepend elements by inserting before other elements. You
   * can either insert a string like in this method or prepend real elements like
   * the `onAppendBoxes` method.
   */
  onPrependBoxes() {
    const markup = this._getHtmlMarkupToAdd();

    // Prepend HTML string.
    this.element.insertAdjacentHTML('afterbegin', markup);

    // Get the first 5 children of the container (we are inserting 5 items).
    const items = Array.prototype.slice.call(this.element.children, 0, 5);

    // Notify the instance.
    this.shuffle.add(items);
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getRandomColor() {
    return '#' + Math.random().toString(16).slice(2, 8);
  }

  // Randomly choose some elements to remove
  onRemoveClick() {
    const total = this.shuffle.visibleItems;

    // None left
    if (!total) {
      return;
    }

    const numberToRemove = Math.min(3, total);
    const indiciesToRemove = [];

    // This has the possibility to choose the same index for more than
    // one in the array, meaning sometimes less than 3 will be removed
    for (let i = 0; i < numberToRemove; i++) {
      indiciesToRemove.push(this.getRandomInt(0, total - 1));
    }

    // Make an array of elements to remove.
    const collection = indiciesToRemove.map((index) => {
      return this.shuffle.items[index].element;
    });

    // Tell shuffle to remove them
    this.shuffle.remove(collection);
  }

  onRandomize() {
    const label = document.getElementById('sorter').querySelector('label.btn.active');
    if (label) {
      const radio = label.querySelector('input');
      radio.checked = false;
      label.classList.remove('active');
    }

    this.sortBy('random');
  }

  toggleActiveClasses(event) {
    // Add and remove `active` class from buttons.
    const buttons = Array.from(event.currentTarget.children);
    buttons.forEach((button) => {
      if (button.querySelector('input').value === event.target.value) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });
  }

  onSortChange(evt) {
    this.toggleActiveClasses(evt);
    this.sortBy(evt.target.value);
  }

  sortBy(value) {
    let sortOptions;

    if (value === 'most-reviews') {
      sortOptions = {
        reverse: true,
        by: this.getReviews,
      };
    } else if (value === 'least-reviews') {
      sortOptions = {
        by: this.getReviews,
      };
    } else if (value === 'random') {
      sortOptions = { randomize: true };
    } else {
      sortOptions = {};
    }

    // Filter elements
    this.shuffle.sort(sortOptions);
  }

  getReviews(element) {
    return parseInt(element.dataset.reviews, 10);
  }

  onFilterChange(event) {
    this.toggleActiveClasses(event);
    this.filterBy(event.target.value);
  }

  filterBy(value) {
    let filterBy;

    if (value === 'none') {
      filterBy = Shuffle.ALL_ITEMS;
    } else if (value === 'odd-reviews') {
      filterBy = (element) => {
        return this.getReviews(element) % 2 === 1;
      };
    } else {
      filterBy = (element) => {
        return this.getReviews(element) % 2 === 0;
      };
    }

    this.shuffle.filter(filterBy);
  }

  /**
   * Remove a shuffle item when it's clicked.
   * @param {Object} event Event object.
   */
  onContainerClick(event) {
    // Bail in older browsers. https://caniuse.com/#feat=element-closest
    if (typeof event.target.closest !== 'function') {
      return;
    }

    const element = event.target.closest('.box');
    if (element !== null) {
      this.shuffle.remove([element]);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.demo = new Demo(document.getElementById('my-shuffle'));
});
