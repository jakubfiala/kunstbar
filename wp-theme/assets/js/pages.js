const exhibitionNavLinks = Array.from(document.querySelectorAll('.exhibition-nav a'));

const updateExhibitionNavLinks = () => {
  exhibitionNavLinks.forEach((link) => {
    link.classList.toggle('exhibition-nav-link--selected', link.getAttribute('href') === location.hash);
  });
};

updateExhibitionNavLinks();

window.addEventListener('hashchange', () => updateExhibitionNavLinks());
