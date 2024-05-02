import { Matrix4, DynamicDrawUsage, BoxGeometry, InstancedMesh, BufferAttribute } from 'three';
import mirror from './materials/mirror.js';

const PORTRAIT = 0;
const LANDSCAPE = 1;
const aspect = window.innerWidth >= window.innerHeight ? LANDSCAPE : PORTRAIT;

const boxCount = aspect === PORTRAIT ? 70 : 100;
const boxScale = aspect === PORTRAIT ? 2.5 : 3.3;
const boxSizeX = boxScale * 0.2;
const boxSizeY = boxScale * 0.5;
const boxSizeZ = boxScale * 0.09;

const boxDistWidthX = aspect === PORTRAIT ? 1 : 3;
const boxDistOffsetX = boxDistWidthX / 2;
const boxDistWidthY = 22;
const boxDistOffsetY = 2;

const uv = [
  0,0,0,1,1,0,1,1, // lr
  0,0,0,1,1,0,1,1, // lr
  0,0,1,0,0,1,1,1, // tb
  0,0,1,0,0,1,1,1, // tb
  0,0,0,1,1,0,1,1, // front
  0,0,0,1,1,0,1,1, // back
];

const randomDist = (width, offset) => Math.random() * width - offset;

export default ({ hdri }) => {
  const material = mirror({ hdri });
  const matrix = new Matrix4();

  const geometryBox = new BoxGeometry(boxSizeX, boxSizeY, boxSizeZ);
  geometryBox.setAttribute('uv', new BufferAttribute(Float32Array.from(uv), 2));

  const bars = new InstancedMesh(geometryBox, material, boxCount);
  bars.instanceMatrix.setUsage(DynamicDrawUsage);
  bars.castShadow = true;
  bars.receiveShadow = true;

  for (let i = 0; i < bars.count; i++) {
    matrix.setPosition(
      randomDist(boxDistWidthX, boxDistOffsetX),
      randomDist(boxDistWidthY + boxDistOffsetY),
      0,
    );
    bars.setMatrixAt(i, matrix);
  }

  return bars;
}
