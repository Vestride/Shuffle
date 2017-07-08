(function () {
  var SiteNav = function (element) {
    this.element = element;
    var btn = document.querySelector('.site-nav__link-toggle');
    btn.addEventListener('click', this.toggle.bind(this));

    window.addEventListener('resize', this.handleResize.bind(this));
    this.handleResize();
  };

  SiteNav.prototype.toggle = function (event) {
    var linkWrapper = event.currentTarget.parentNode;
    var willOpen = !linkWrapper.classList.contains('site-nav__link--dropdown-active');
    event.currentTarget.setAttribute('aria-expanded', willOpen);
    linkWrapper.classList.toggle('site-nav__link--dropdown-active');
    document.body.classList.toggle('site-nav--open');
  };

  SiteNav.prototype.handleResize = function () {
    var viewportHeight = window.innerHeight;
    var navHeight = this.element.offsetHeight;
    var dropdown = document.querySelector('.site-nav__dropdown');
    dropdown.style.maxHeight = (viewportHeight - navHeight) + 'px';
  };

  new SiteNav(document.querySelector('.site-nav'));
})();
