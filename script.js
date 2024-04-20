import Atrament from 'atrament';
import * as THREE from 'three';
import { RapierPhysics } from 'three/addons/rapier.js';
import { RGBELoader } from 'three/addons/rgbe.js';
// import { EXRLoader } from './addons/exr.js';

import { RectAreaLightUniformsLib } from './libs/RectAreaUniformsLib.js';

import walls from './walls.js';
import { rad } from './vercajch.js';
import galvanizedZinc from './materials/galvanized-zinc.js';
// import brushedSteel from './materials/brushed-steel.js';
// import dude from './materials/dude.js';

let camera, scene, renderer;
let physics;

let boxes;
let environment;

const choose = list => list[Math.floor(Math.random() * list.length)];

const PORTRAIT = 0;
const LANDSCAPE = 1;

const aspect = window.innerWidth >= window.innerHeight ? LANDSCAPE : PORTRAIT;

new RGBELoader()
  .setPath( 'hdri/' )
  .load( 'unfinished_office_1k.hdr', function ( texture ) {
    environment = texture;
    init();
  });

// new EXRLoader()
//   .setPath( 'exr/' )
//   .load( 'GSG_HC015_A021_Showroom_01.exr', function (texture) {
//     environment = texture;
//     init();
//   });

const colorPalette = {
  orange: 'f57e45',
  green: 'bfe407',
  yellow: 'f3f417',
  pink: 'e36db8',
  red: 'f54600',
}

async function init() {
  RectAreaLightUniformsLib.init();
  physics = await RapierPhysics();

  camera = new THREE.PerspectiveCamera(50, window.innerWidth / (window.innerHeight), 0.1, 100);

  const x = 0;
  const y = 2.5;
  camera.position.set(x,y,5);
  camera.lookAt(x,y,0);
  window.camera = camera;

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xdddddd);

  const dirLight = new THREE.DirectionalLight(0xffffff, 50);
  dirLight.position.set(-3, 8, 3);
  dirLight.castShadow = true;
  dirLight.shadow.camera.zoom = 2;
  dirLight.shadow.radius = 3;
  scene.add(dirLight.target);
  scene.add(dirLight);
  dirLight.target.position.set(0,0,0);


  // const dirLight2 = new THREE.DirectionalLight(0xffffff, 1);
  // dirLight2.position.set(0, 1, 5);
  // dirLight2.castShadow = true;
  // dirLight2.shadow.camera.zoom = 2;
  // dirLight2.shadow.radius = 3;
  // scene.add(dirLight2.target);
  // scene.add(dirLight2);
  // dirLight2.target.position.set(0,0,0);

  // const pointLight = new THREE.PointLight(0xffffff, 100);
  // pointLight.position.set(0, 5, 5);
  // pointLight.castShadow = true;
  // scene.add(pointLight);


  const width = 2.2;
  const height = 2.2;
  const intensity = 500;
  const rectLight = new THREE.RectAreaLight( 0xffffff, intensity,  width, height );
  rectLight.castShadow = true;
  rectLight.position.set( 0, 5, 5 );
  rectLight.lookAt( 0, 1, 0 );
  scene.add(rectLight);

  for (const wall of walls()) {
    scene.add(wall);
  }

  // const material = brushedSteel();
  const material = galvanizedZinc();
  // const material = dude();

  const matrix = new THREE.Matrix4();

  const boxScale = aspect === PORTRAIT ? 2.5 : 3.5;
  const geometryBox = new THREE.BoxGeometry(boxScale * 0.2, boxScale * 0.5, boxScale * 0.09);
  boxes = new THREE.InstancedMesh(geometryBox, material, 100);
  boxes.instanceMatrix.setUsage(THREE.DynamicDrawUsage); // will be updated every frame
  boxes.castShadow = true;
  boxes.receiveShadow = true;
  boxes.userData.physics = { mass: 0.2, restitution: 0.1 };
  scene.add(boxes);

  for (let i = 0; i < boxes.count; i++) {
    const boxX = aspect === PORTRAIT
      ? Math.random() * 1 - 0.5
      : Math.random() * 3 - 1.5;
    matrix.setPosition(boxX, Math.random() * 22 + 2, 0);
    // matrix.setPosition(Math.random() * 0.95 - 0.5, Math.random() * 10 + 5, Math.random() * 0.05 - 0.0025);
    boxes.setMatrixAt(i, matrix);
  }

  physics.addScene(scene);

  //

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const drawingCanvas = document.getElementById('drawing');
  drawingCanvas.width = window.innerWidth;
  drawingCanvas.height = window.innerHeight;

  const atrament = new Atrament(drawingCanvas);
  atrament.color = `#${choose(Object.values(colorPalette))}`;
  atrament.weight = 10;

  document.body.insertBefore(renderer.domElement, drawingCanvas);

  environment.mapping = THREE.EquirectangularReflectionMapping;
  environment.rotation = rad(90);
  scene.environment = environment;
  material.envMap = environment;

  document.getElementById('g-change-left').addEventListener('click', () => {
    physics.gravity.x = -9.81;
    physics.gravity.y = 0;
    // document.getElementById('debugger').innerText = JSON.stringify(physics.gravity);
  });

  document.getElementById('g-change-right').addEventListener('click', () => {
    physics.gravity.x = 9.81;
    physics.gravity.y = 0;
    // document.getElementById('debugger').innerText = JSON.stringify(physics.gravity);
  });

  document.getElementById('g-change-top').addEventListener('click', () => {
    physics.gravity.x = 0;
    physics.gravity.y = 9.81;
    // document.getElementById('debugger').innerText = JSON.stringify(physics.gravity);
  });

  // window.addEventListener('deviceorientation', ({ alpha }) => {
  //   try {
  //     const angle = rad(alpha);
  //     physics.gravity.x = Math.sin(angle) * 9.81;
  //     physics.gravity.y = Math.cos(angle) * 9.81;
  //     document.getElementById('debugger').innerText = JSON.stringify(physics.gravity);
  //   } catch (err) {
  //     document.getElementById('debugger').innerText = `${err}`;
  //   }
  // });

  animate();
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

window.onresize = function () {
  camera.aspect = window.innerWidth / (window.innerHeight);
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};
