(function () {
  'use strict';

  var Questions = function () {
    this.searchInput = document.querySelector('#search');
    this.questions = document.querySelectorAll('.js-question');

    if (!this.searchInput) {
      return;
    }

    var handler = this._handleInput.bind(this);
    this.searchInput.addEventListener('keyup', handler);
    this.searchInput.addEventListener('change', handler);
    window.addEventListener('resize', this.onWindowResize.bind(this));

    this.setHeights();
  };

  Questions.prototype._handleInput = function (evt) {
    var val = evt.target.value.toLowerCase();

    // Filter elements based on if their string exists in the product model
    for (var i = 0, len = this.questions.length; i < len; i++) {
      var el = this.questions[i];
      var title = el.querySelector('.question__title').textContent;
      var text = title.trim().toLowerCase();

      if (text.indexOf(val) === -1) {
        el.classList.add('question--collapsed');
      } else {
        el.classList.remove('question--collapsed');
      }
    }
  };

  Questions.prototype.setHeights = function () {
    var elements = Array.from(this.questions);

    elements.forEach(function (element) {
      element.style.height = '';
    });

    var heights = elements.map(function (element) {
      return element.firstElementChild.offsetHeight;
    });

    elements.forEach(function (element, i) {
      element.style.height = heights[i] + 'px';
    });
  };

  Questions.prototype.onWindowResize = function () {
    this.setHeights();
  };

  new Questions();
}());
