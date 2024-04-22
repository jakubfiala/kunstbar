import { MeshStandardMaterial, TextureLoader, SRGBColorSpace, RepeatWrapping } from 'three';

export default ({ hdri }) => {
  const textureLoader = new TextureLoader();
  const map = textureLoader.load('./img/zinc/diffuse.jpg');
  const roughnessMap = textureLoader.load('./img/zinc/roughness.jpg');
  const normalMap = textureLoader.load('./img/zinc/normal.jpg');

  [
    map,
    roughnessMap,
    normalMap,
  ].forEach((texture) => {
    texture.colorSpace = SRGBColorSpace;
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
  });

  return new MeshStandardMaterial({
    map,
    color: 0x555555,
    roughness: 0.75,
    metalness: 0.1,
    roughnessMap,
    normalMap,
    envMap: hdri,
  });
}
