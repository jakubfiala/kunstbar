import Atrament from 'atrament';

import { choose } from './vercajch.js';

const colorPalette = {
  orange: 'f57e45',
  green: 'bfe407',
  yellow: 'f3f417',
  pink: 'e36db8',
  red: 'f54600',
};

export default (canvas) => {
  canvas.width = 2 * 500;
  canvas.height = 2 * 200;

  const atrament = new Atrament(canvas);
  atrament.color = `#${colorPalette.orange}`;
  atrament.weight = 10;

  const context = canvas.getContext('2d');
  context.fillStyle = 'white';
  context.fillRect(0, 0, canvas.width, canvas.height);

  const swatches = Array.from(document.getElementsByClassName('swatch'));

  swatches.forEach((swatch) => swatch.addEventListener('click', () => {
    swatches
      .find((s) => s.classList.contains('swatch--selected'))
      ?.classList.remove('swatch--selected');

    atrament.color = swatch.getAttribute('data-color');
    swatch.classList.toggle('swatch--selected');
  }))

  return atrament;
};
