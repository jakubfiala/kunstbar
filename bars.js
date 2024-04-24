import { Matrix4, DynamicDrawUsage, BoxGeometry, InstancedMesh, BufferAttribute } from 'three';
import mirror from './materials/mirror.js';

const PORTRAIT = 0;
const LANDSCAPE = 1;
const aspect = window.innerWidth >= window.innerHeight ? LANDSCAPE : PORTRAIT;

const uv = [
  0,0,0,1,1,0,1,1, // lr
  0,0,0,1,1,0,1,1, // lr
  0,0,1,0,0,1,1,1, // tb
  0,0,1,0,0,1,1,1, // tb
  0,0,0,1,1,0,1,1, // front
  0,0,0,1,1,0,1,1, // back
];

export default ({ hdri }) => {
  const material = mirror({ hdri });
  const matrix = new Matrix4();
  const boxScale = aspect === PORTRAIT ? 2.5 : 3.3;
  const boxCount = aspect === PORTRAIT ? 60 : 80;
  const geometryBox = new BoxGeometry(boxScale * 0.2, boxScale * 0.5, boxScale * 0.09);
  console.log(BufferAttribute);
  console.log(geometryBox);
  geometryBox.setAttribute('uv', new BufferAttribute(Float32Array.from(uv), 2));

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
