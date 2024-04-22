
import { LinearToneMapping, Color, EquirectangularReflectionMapping, Scene } from 'three';
import { HDRJPGLoader } from '@monogrid/gainmap-js';

import { RapierPhysics } from './addons/rapier.js';

import { RectAreaLightUniformsLib } from './libs/RectAreaUniformsLib.js';

import walls from './walls.js';
import lights from './lights.js';
import bars from './bars.js';
import createCamera from './camera.js';
import createRenderer from './renderer.js';
import createDrawing from './drawing.js';
import gravityChange from './gravity-change.js';

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

  const physics = await RapierPhysics();
  gravityChange(physics);

  const camera = createCamera();
  const scene = new Scene();
  scene.background = new Color(0xdddddd);
  scene.environment = hdri;

  for (const wall of walls()) {
    scene.add(wall);
  }

  scene.add(bars({ hdri }));
  physics.addScene(scene);
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
