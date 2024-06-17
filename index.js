
import { LinearToneMapping, Color, EquirectangularReflectionMapping, Scene } from 'three';
import { HDRJPGLoader } from '@monogrid/gainmap-js';

import createRectAreaUniforms from './rect-area-uniforms.js';
import createPhysics from './physics.js';

import walls from './walls.js';
import lights from './lights.js';
import createBars from './bars.js';
import createCamera from './camera.js';
import createRenderer from './renderer.js';
import createDrawing from './drawing.js';

async function init() {
  const renderer = createRenderer();
  renderer.toneMapping = LinearToneMapping;

  const hdrLoader = new HDRJPGLoader(renderer);
  const hdrResult = await hdrLoader.loadAsync('img/hdri.jpg');
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

  lights.addScene(scene);

  const enterWebsite = () => {
    physics.gUp();
    document.getElementById('bars').classList.add('bars--hidden');
    document.getElementById('header').classList.add('header--collapsed');
    document.getElementById('main').classList.add('main--visible');

    const introIO = new IntersectionObserver((entries) => {
      if (entries.some(({ isIntersecting }) => isIntersecting)) {
        physics.gUp();
      }
    }, { threshold: 0.75 });

    introIO.observe(document.getElementById('intro'));

    const scrollyHighlightIO = new IntersectionObserver(
      (entries) => entries
        .forEach((entry) => entry.target.classList.toggle('scrolly-highlight--highlighted', entry.isIntersecting)),
      { rootMargin: '-45% 0px -45% 0px' },
    );

    Array
      .from(document.getElementsByClassName('scrolly-highlight'))
      .forEach((span, index) => {
        scrollyHighlightIO.observe(span);
      });
  }

  document.addEventListener('scroll', enterWebsite, { once: true });
	document.getElementById('bars').addEventListener('click', enterWebsite, { once: true });

  const drawing = createDrawing(document.getElementById('drawing'));

  const drawingIO = new IntersectionObserver((entries) => {
    if (entries.some(({ isIntersecting }) => isIntersecting)) {
      physics.gDown();
      document.getElementById('bars').classList.add('bars--behind');
    }
  }, { threshold: 0.75 });

  drawingIO.observe(document.getElementById('drawing-section'));

  drawing.addEventListener('strokeend', () => bars.material.map.needsUpdate = true);

  const blueSection = document.getElementById('blue-section')
  const blueIO = new IntersectionObserver((entries) => {
    const entry = entries.find(({ isIntersecting }) => isIntersecting);
    if (entry) {
      physics.gUp();
    } else {
      physics.gDown();
    }
  }, { threshold: 0.25 });

  blueIO.observe(blueSection);
};

init();
