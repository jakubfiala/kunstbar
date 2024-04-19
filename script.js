import Atrament from 'atrament';
import * as THREE from 'three';
import { RapierPhysics } from 'three/addons/rapier.js';
import { RGBELoader } from 'three/addons/rgbe.js';

import walls from './walls.js';
import { rad } from './vercajch.js';

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

const colorPalette = {
  orange: 'f57e45',
  green: 'bfe407',
  yellow: 'f3f417',
  pink: 'e36db8',
  red: 'f54600',
}

async function init() {
  physics = await RapierPhysics();

  camera = new THREE.PerspectiveCamera(50, window.innerWidth / (window.innerHeight), 0.1, 100);

  const x = 0;
  const y = 2.5;
  camera.position.set(x,y,5);
  camera.lookAt(x,y,0);
  window.camera = camera;

  const textureLoader = new THREE.TextureLoader();
  const metalTexture = textureLoader.load('./img/steel/tall.MetalSteelBrushed001_COL_2K_METALNESS.png');
  const metalnessMap = textureLoader.load('./img/steel/tall.MetalSteelBrushed001_METALNESS_2K_METALNESS.png');
  const roughnessMap = textureLoader.load('./img/steel/tall.MetalSteelBrushed001_ROUGHNESS_2K_METALNESS.png');
  const bumpMap = textureLoader.load('./img/steel/tall.MetalSteelBrushed001_BUMP16_2K_METALNESS.png');
  const normalMap = textureLoader.load('./img/steel/tall.MetalSteelBrushed001_NRM_2K_METALNESS.png');

  [metalTexture, metalnessMap, roughnessMap, bumpMap, normalMap].forEach((texture) => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(0.75, 0.75);
    texture.rotation = rad(90);
  });

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xdddddd);

  const dirLight = new THREE.DirectionalLight(0xffffff, 40);
  dirLight.position.set(-3, 8, 3);
  dirLight.castShadow = true;
  dirLight.shadow.camera.zoom = 2;
  dirLight.shadow.radius = 3;
  scene.add(dirLight.target);
  scene.add(dirLight);
  dirLight.target.position.set(0,0,-2);

  for (const wall of walls({ width: aspect === PORTRAIT ? 2.2 : 8 })) {
    scene.add(wall);
  }

  const material = new THREE.MeshStandardMaterial({
    map: metalTexture,
    // metalness: 0.9,
    // roughness: 0.01,
    // aoMap: metalTexture,
    metalness: 0.2,
    metalnessMap,
    roughnessMap,
    // envMap: textureCube,
    normalMap,
    // normalScale: new THREE.Vector2(1.5, 1.5),
    bumpMap,
    // bumpScale: 1.5
  });
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
  scene.environment = environment;
  material.envMap = environment;

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
