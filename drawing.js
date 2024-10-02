import Atrament from 'atrament';

export default (canvas) => {
  const atrament = new Atrament(canvas, {
    width: canvas.offsetWidth,
    height: canvas.offsetHeight,
  });

  atrament.color = '#DD01A3';
  atrament.weight = 20;

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
  }));

  const weights = Array.from(document.getElementsByClassName('weight'));

  weights.forEach((weight) => weight.addEventListener('click', () => {
    weights
      .find((s) => s.classList.contains('weight--selected'))
      ?.classList.remove('weight--selected');

    atrament.weight = parseInt(weight.getAttribute('data-weight'), 10);
    weight.classList.toggle('weight--selected');
  }));

  const saveLink = document.getElementById('save-drawing');
  saveLink.addEventListener('click', () => {
    saveLink.href = canvas.toDataURL();
  });

  return atrament;
};
