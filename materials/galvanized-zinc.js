import { MeshStandardMaterial, TextureLoader, SRGBColorSpace, RepeatWrapping } from 'three';

import { rad } from '../vercajch.js';

export default () => {
  const textureLoader = new TextureLoader();
  const map = textureLoader.load('./img/MetalZincGalvanized001/MetalZincGalvanized001_COL_1K_METALNESS.png');
  const roughnessMap = textureLoader.load('./img/MetalZincGalvanized001/MetalZincGalvanized001_ROUGHNESS_1K_METALNESS.png');
  const normalMap = textureLoader.load('./img/MetalZincGalvanized001/MetalZincGalvanized001_NRM_1K_METALNESS.png');

  [
    // aoMap,
    map,
    // metalnessMap,
    roughnessMap,
    // bumpMap,
    normalMap,
  ].forEach((texture) => {
    texture.colorSpace = SRGBColorSpace;
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    texture.repeat.set(0.25, 0.25);
    texture.rotation = rad(90);
  });

  return new MeshStandardMaterial({
    map,
    color: 0x555555,
    // aoMap,
    roughness: 0.75,
    metalness: 0.1,
    roughnessMap,
    normalMap,
    // bumpMap,
  });
}
