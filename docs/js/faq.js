class Questions {
  constructor() {
    this.searchInput = document.querySelector('#search');
    this.questions = document.querySelectorAll('.js-question');

    if (!this.searchInput) {
      return;
    }

    const handler = this._handleInput.bind(this);
    this.searchInput.addEventListener('keyup', handler);
    this.searchInput.addEventListener('change', handler);
    window.addEventListener('resize', this.onWindowResize.bind(this));

    this.setHeights();
  }

  _handleInput(evt) {
    const val = evt.target.value.toLowerCase();

    // Filter elements based on if their string exists in the product model
    for (let i = 0, len = this.questions.length; i < len; i++) {
      const el = this.questions[i];
      const title = el.querySelector('.question__title').textContent;
      const text = title.trim().toLowerCase();

      if (text.indexOf(val) === -1) {
        el.classList.add('question--collapsed');
      } else {
        el.classList.remove('question--collapsed');
      }
    }
  }

  setHeights() {
    const elements = Array.from(this.questions);

    elements.forEach((element) => {
      element.style.height = '';
    });

    const heights = elements.map((element) => element.firstElementChild.offsetHeight);

    elements.forEach((element, i) => {
      element.style.height = heights[i] + 'px';
    });
  }
  onWindowResize() {
    this.setHeights();
  }
}

new Questions();
