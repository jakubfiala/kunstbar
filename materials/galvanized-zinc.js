import { MeshStandardMaterial, TextureLoader, SRGBColorSpace, RepeatWrapping } from 'three';

export default ({ hdri }) => {
  const textureLoader = new TextureLoader();
  const map = textureLoader.load('./img/MetalZincGalvanized001/diffuse.png');
  const roughnessMap = textureLoader.load('./img/MetalZincGalvanized001/roughness.png');
  const normalMap = textureLoader.load('./img/MetalZincGalvanized001/normal.png');

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
