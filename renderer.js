import { PCFSoftShadowMap, WebGLRenderer, ACESFilmicToneMapping } from 'three';

export default () => {
  const renderer = new WebGLRenderer({ antialias: true, alpha: true, canvas: document.getElementById('bars') });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.5;

  return renderer;
}
