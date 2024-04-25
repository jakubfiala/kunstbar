
import { LinearToneMapping, Color, EquirectangularReflectionMapping, Scene } from 'three';
import { HDRJPGLoader } from '@monogrid/gainmap-js';

import createRectAreaUniforms from './rect-area-uniforms.js';
import createPhysics from './physics.js';

import walls from './walls.js';
// import lights from './lights.js';
import createBars from './bars.js';
import createCamera from './camera.js';
import createRenderer from './renderer.js';
import createDrawing from './drawing.js';

setTimeout(init, 500);

async function init() {
  const renderer = createRenderer();
  renderer.toneMapping = LinearToneMapping;

  const hdrLoader = new HDRJPGLoader(renderer);
  const hdrResult = await hdrLoader.loadAsync('hdri/GSG_HC015_A021_Showroom_01_2k.jpg');
  const hdri = hdrResult.renderTarget.texture;
  hdri.mapping = EquirectangularReflectionMapping;

  createRectAreaUniforms();

  const physics = await createPhysics();
  const camera = createCamera();
  const scene = new Scene();
  scene.environment = hdri;

  for (const wall of walls()) {
    scene.add(wall);
    physics.addMesh(wall);
  }

  const bars = createBars({ hdri });
  scene.add(bars);
  physics.addMesh(bars, 1, 0);
  // lights.addScene(scene);

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

  const gUp = () => {
    console.log('gup');
    physics.gUp();
    document.getElementById('bars').classList.add('bars--hidden');
    document.getElementById('header').classList.add('header--collapsed');
    document.getElementById('main').classList.add('main--visible');
  }

  document.addEventListener('scroll', gUp, { once: true });
	document.getElementById('bars').addEventListener('click', gUp);

  const drawing = createDrawing(document.getElementById('drawing'));

  const drawingIO = new IntersectionObserver((entries) => {
    if (entries.some(({ isIntersecting }) => isIntersecting)) {
      console.log('gdown', entries);
      physics.gDown();
      document.getElementById('bars').classList.add('bars--behind');
    }
  }, { threshold: 0.75 });

  drawingIO.observe(document.getElementById('drawing-section'));

  // const blueIO = new IntersectionObserver((entries) => {
  //   const entry = entries.find(({ isIntersecting }) => isIntersecting);
  //   if (entry) {
  //     document.getElementById('header').classList.add('header--inverse');
  //   } else if (entry) {
  //     document.getElementById('header').classList.remove('header--inverse');
  //   }
  // }, { threshold: 0.9 });

  // blueIO.observe(document.getElementById('blue-section'));

  drawing.addEventListener('strokeend', () => bars.material.map.needsUpdate = true);
};
