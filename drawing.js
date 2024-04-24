import Atrament from 'atrament';

export default (canvas) => {
  canvas.width = 500;
  canvas.height = 200;

  const atrament = new Atrament(canvas);
  atrament.color = '#F3F417';
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
