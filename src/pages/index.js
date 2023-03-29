import pages from './pages.json';

document.addEventListener('DOMContentLoaded', () => {
  const linksContainer = document.querySelector('#links-list');
  pages?.links.length &&
    pages.links.forEach((page) => {
      const container = document.createElement('li');
      const link = document.createElement('a');
      link.setAttribute('href', page.src);
      link.innerText = page.name;
      container.appendChild(link);
      linksContainer.appendChild(container);
    });
});
