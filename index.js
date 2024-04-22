
import { LinearToneMapping, Color, EquirectangularReflectionMapping, Scene } from 'three';
import { HDRJPGLoader } from '@monogrid/gainmap-js';

import { RectAreaLightUniformsLib } from './rect-area-uniforms.js';
import createPhysics from './physics.js';

import walls from './walls.js';
import lights from './lights.js';
import createBars from './bars.js';
import createCamera from './camera.js';
import createRenderer from './renderer.js';
import createDrawing from './drawing.js';

createDrawing(document.getElementById('drawing'));
init();

async function init() {
  const renderer = createRenderer();
  renderer.toneMapping = LinearToneMapping;

  const hdrLoader = new HDRJPGLoader(renderer);
  const hdrResult = await hdrLoader.loadAsync('hdri/unfinished_office_1k.jpg');
  const hdri = hdrResult.renderTarget.texture;

  hdri.mapping = EquirectangularReflectionMapping;

  RectAreaLightUniformsLib.init();

  const physics = await createPhysics();
  const camera = createCamera();
  const scene = new Scene();
  scene.background = new Color(0xdddddd);
  scene.environment = hdri;

  for (const wall of walls()) {
    scene.add(wall);
    physics.addMesh(wall);
  }

  const bars = createBars({ hdri });
  scene.add(bars);
  physics.addMesh(bars, 0.2, 0.1);
  lights.addScene(scene);

  const animate = () => {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  };

  requestAnimationFrame(animate);

  window.onresize = function () {
    camera.aspect = window.innerWidth / (window.innerHeight);
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  hdrResult.dispose();
};
