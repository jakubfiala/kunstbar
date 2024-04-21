
import { Color, EquirectangularReflectionMapping, Scene } from 'three';
import { RapierPhysics } from 'three/addons/rapier.js';
import { RGBELoader } from 'three/addons/rgbe.js';

import { RectAreaLightUniformsLib } from './libs/RectAreaUniformsLib.js';

import walls from './walls.js';
import { rad } from './vercajch.js';
import lights from './lights.js';
import bars from './bars.js';
import createCamera from './camera.js';
import createRenderer from './renderer.js';
import createDrawing from './drawing.js';
import gravityChange from './gravity-change.js';

new RGBELoader()
  .setPath( 'hdri/' )
  .load( 'unfinished_office_1k.hdr', (hdri) => init({ hdri }));

createDrawing(document.getElementById('drawing'));

async function init({ hdri }) {
  hdri.mapping = EquirectangularReflectionMapping;
  hdri.rotation = rad(90);

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

  const renderer = createRenderer();

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
};
