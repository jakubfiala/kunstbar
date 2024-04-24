import { MeshStandardMaterial, CanvasTexture } from 'three';

export default ({ hdri }) => {
  const map = new CanvasTexture(document.getElementById('drawing'));
  return new MeshStandardMaterial({
    map,
    roughness: 0.09,
    metalness: 1,
    envMap: hdri,
  });
}
