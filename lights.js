import { AmbientLight, DirectionalLight, RectAreaLight } from 'three';

const addDirectionalLight = (scene) => {
  const dirLight = new DirectionalLight(0xffffff, 1);
  dirLight.position.set(-5, 8, 3);
  dirLight.castShadow = true;
  dirLight.shadow.camera.zoom = 2;
  dirLight.shadow.radius = 3;
  scene.add(dirLight.target);
  scene.add(dirLight);
  dirLight.target.position.set(0,0,0);
}


const addRectAreaLight = (scene) => {
  const width = 2.2;
  const height = 2.2;
  const intensity = 500;
  const rectLight = new RectAreaLight( 0xffffff, intensity,  width, height );
  rectLight.position.set( 0, 5, 5 );
  rectLight.lookAt( 0, 1, 0 );
  scene.add(rectLight);
}

const addAmbientLight = (scene) => {
  const ambLight = new AmbientLight(0xffffff, 0.35);
  scene.add(ambLight);
}

export default {
  addScene: (scene) => {
    addDirectionalLight(scene);
    addAmbientLight(scene);
    // addRectAreaLight(scene);
  },
};
