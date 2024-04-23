import { MeshStandardMaterial } from 'three';

export default ({ hdri }) => {
  return new MeshStandardMaterial({
    roughness: 0.1,
    metalness: 1,
    envMap: hdri,
  });
}
