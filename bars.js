import { Matrix4, DynamicDrawUsage, BoxGeometry, InstancedMesh } from 'three';
import galvanizedZinc from './materials/galvanized-zinc.js';

const PORTRAIT = 0;
const LANDSCAPE = 1;
const aspect = window.innerWidth >= window.innerHeight ? LANDSCAPE : PORTRAIT;

export default ({ hdri }) => {
  const material = galvanizedZinc({ hdri });
  const matrix = new Matrix4();
  const boxScale = aspect === PORTRAIT ? 2.5 : 3.3;
  const boxCount = aspect === PORTRAIT ? 60 : 80;
  const geometryBox = new BoxGeometry(boxScale * 0.2, boxScale * 0.5, boxScale * 0.09);
  const bars = new InstancedMesh(geometryBox, material, boxCount);
  bars.instanceMatrix.setUsage(DynamicDrawUsage);
  bars.castShadow = true;
  bars.receiveShadow = true;

  for (let i = 0; i < bars.count; i++) {
    const boxX = aspect === PORTRAIT
      ? Math.random() * 1 - 0.5
      : Math.random() * 3 - 1.5;
    matrix.setPosition(boxX, Math.random() * 22 + 2, 0);
    bars.setMatrixAt(i, matrix);
  }

  return bars;
}
