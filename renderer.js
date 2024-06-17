import { PCFSoftShadowMap, WebGLRenderer, ACESFilmicToneMapping } from 'three';

const BOTTOM_MARGIN = 50;

export default () => {
  const renderer = new WebGLRenderer({ antialias: true, alpha: true, canvas: document.getElementById('bars') });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight + BOTTOM_MARGIN);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.5;

  return renderer;
}
