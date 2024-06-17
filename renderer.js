import { PCFSoftShadowMap, WebGLRenderer, ACESFilmicToneMapping } from 'three';

const BOTTOM_MARGIN = 50;

export default () => {
  const canvas = document.getElementById('bars');
  const renderer = new WebGLRenderer({ antialias: true, alpha: true, canvas });
  renderer.setPixelRatio(window.devicePixelRatio);

  const canvasBBox = canvas.getBoundingClientRect();
  renderer.setSize(canvasBBox.width, canvasBBox.height);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.5;

  return renderer;
}
