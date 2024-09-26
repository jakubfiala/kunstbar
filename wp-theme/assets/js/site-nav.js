const siteNavToggle = document.getElementById('site-nav-toggle');
const siteNav = document.getElementById('site-nav');

if (siteNav && siteNavToggle) {
  siteNavToggle.addEventListener('click', () => {
    siteNav.classList.toggle('site-nav--hidden');
    siteNav.ariaHidden = siteNav.classList.contains('site-nav--hidden');
    siteNavToggle.classList.toggle('site-nav-toggle--close', siteNav.ariaHidden !== 'true');
  });

  document.addEventListener('click', (event) => {
    if (!event.composedPath().includes(siteNavToggle) && event.target !== siteNavToggle) {
      siteNav.classList.toggle('site-nav--hidden', true);
      siteNav.ariaHidden = siteNav.classList.contains('site-nav--hidden');
      siteNavToggle.classList.toggle('site-nav-toggle--close', siteNav.ariaHidden !== 'true');
    }
  });
}
