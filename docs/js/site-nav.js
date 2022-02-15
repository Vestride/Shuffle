class SiteNav {
  constructor(element) {
    this.element = element;
    const buttons = Array.from(document.querySelectorAll('.site-nav__link-toggle'));
    const dropdowns = buttons.map((button) => button.parentNode.querySelector('.site-nav__dropdown'));

    const toggle = this.toggle.bind(this);
    buttons.forEach((button, i) => {
      button.addEventListener('click', toggle);
      dropdowns[i].addEventListener('click', toggle);
    });

    this.handleResize = this.handleResize.bind(this);
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('load', this.handleResize);
  }

  toggle(event) {
    const button = event.currentTarget;
    const wrapper = button.parentNode;
    const willOpen = !wrapper.classList.contains('site-nav__link--dropdown-active');
    const otherOpenWrapper = this.element.querySelector('.site-nav__link--dropdown-active');

    button.setAttribute('aria-expanded', willOpen);
    button.classList.toggle('active');
    wrapper.classList.toggle('site-nav__link--dropdown-active');

    // Check if there is another dropdown that's open.
    if (otherOpenWrapper && otherOpenWrapper !== wrapper) {
      otherOpenWrapper.classList.remove('site-nav__link--dropdown-active');
      const otherButton = otherOpenWrapper.querySelector('.site-nav__link-toggle');
      otherButton.setAttribute('aria-expanded', false);
      otherButton.classList.remove('active');
    } else {
      document.body.classList.toggle('site-nav--open');
    }
  }

  handleResize() {
    const viewportHeight = window.innerHeight;
    const navHeight = this.element.offsetHeight;
    const dropdowns = Array.from(document.querySelectorAll('.site-nav__dropdown'));
    dropdowns.forEach((dropdown) => {
      dropdown.style.maxHeight = viewportHeight - navHeight + 'px';
    });
  }
}

new SiteNav(document.querySelector('.site-nav'));
