import { PerspectiveCamera } from 'three';

export default () => {
  const camera = new PerspectiveCamera(50, window.innerWidth / (window.innerHeight), 0.1, 100);
  const x = 0;
  const y = 2.5;
  camera.position.set(x,y,5);
  camera.lookAt(x,y,0);

  return camera;
}
