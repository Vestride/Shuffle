(function () {
  var SiteNav = function (element) {
    this.element = element;
    var buttons = Array.from(document.querySelectorAll('.site-nav__link-toggle'));
    var dropdowns = buttons.map(function (button) {
      return button.parentNode.querySelector('.site-nav__dropdown');
    });

    var toggle = this.toggle.bind(this);
    buttons.forEach(function (button, i) {
      button.addEventListener('click', toggle);
      dropdowns[i].addEventListener('click', toggle);
    });

    this.handleResize = this.handleResize.bind(this);
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('load', this.handleResize);
  };

  SiteNav.prototype.toggle = function (event) {
    var button = event.currentTarget;
    var wrapper = button.parentNode;
    var willOpen = !wrapper.classList.contains('site-nav__link--dropdown-active');
    var otherOpenWrapper = this.element.querySelector('.site-nav__link--dropdown-active');

    button.setAttribute('aria-expanded', willOpen);
    button.classList.toggle('active');
    wrapper.classList.toggle('site-nav__link--dropdown-active');

    // Check if there is another dropdown that's open.
    if (otherOpenWrapper && otherOpenWrapper !== wrapper) {
      otherOpenWrapper.classList.remove('site-nav__link--dropdown-active');
      var otherButton = otherOpenWrapper.querySelector('.site-nav__link-toggle');
      otherButton.setAttribute('aria-expanded', false);
      otherButton.classList.remove('active');
    } else {
      document.body.classList.toggle('site-nav--open');
    }
  };

  SiteNav.prototype.handleResize = function () {
    var viewportHeight = window.innerHeight;
    var navHeight = this.element.offsetHeight;
    var dropdowns = Array.from(document.querySelectorAll('.site-nav__dropdown'));
    dropdowns.forEach(function (dropdown) {
      dropdown.style.maxHeight = (viewportHeight - navHeight) + 'px';
    });
  };

  new SiteNav(document.querySelector('.site-nav'));
})();
