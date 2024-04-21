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
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const atrament = new Atrament(canvas);
  atrament.color = `#${choose(Object.values(colorPalette))}`;
  atrament.weight = 10;
};
