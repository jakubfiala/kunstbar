import * as THREE from 'three';
import { RapierPhysics } from 'three/addons/rapier.js';
import Atrament from 'atrament';

let camera, scene, renderer;
let physics;

let boxes;

const choose = list => list[Math.floor(Math.random() * list.length)];

init();

const colorPalette = {
  orange: 'f57e45',
  green: 'bfe407',
  yellow: 'f3f417',
  pink: 'e36db8',
  red: 'f54600',
}

async function init() {
  physics = await RapierPhysics();

  camera = new THREE.PerspectiveCamera(50, window.innerWidth / (window.innerHeight * 2), 0.1, 100);
  camera.position.set(1, -0.15, 0.5);
  camera.lookAt(-1, -0.9, -0.25);
  window.camera = camera;

  const textureLoader = new THREE.TextureLoader();
  const metalTexture = textureLoader.load('./texture.png');
  const metalnessMap = textureLoader.load('./texture_r.png');
  const roughnessMap = textureLoader.load('./texture_m.png');
  const bumpMap = textureLoader.load('./texture_h.png');
  const normalMap = textureLoader.load('./texture_n.png');
  const aoMap = textureLoader.load('./texture_o.png');

  const cubeLoader = new THREE.CubeTextureLoader();
  cubeLoader.setPath('./textures/bridge/');

  const textureCube = cubeLoader.load(['posx.jpg', 'negx.jpg', 'posy.jpg', 'negy.jpg', 'posz.jpg', 'negz.jpg']);

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xdddddd);
  const light = new THREE.AmbientLight(0x404040); // soft white light
  scene.add(light);

  const dirLight = new THREE.DirectionalLight(0xffffff, 30);
  dirLight.position.set(5, 10, 3);
  dirLight.castShadow = true;
  dirLight.shadow.camera.zoom = 2;
  dirLight.shadow.radius = 3;
  scene.add(dirLight.target);
  scene.add(dirLight);
  dirLight.target.position.set(-1, -0.9, -0.25);

  const floor = new THREE.Mesh(
    new THREE.BoxGeometry(100, 5, 100),
    new THREE.ShadowMaterial({ color: 0x333333 }),
  );

  floor.position.y = -3;
  floor.receiveShadow = true;
  floor.userData.physics = { mass: 0 };
  scene.add(floor);

  const wall = new THREE.Mesh(
    new THREE.BoxGeometry(100, 100, 1),
    new THREE.MeshBasicMaterial({ color: 0xdddddd }),
  );

  wall.position.z = -2;
  wall.receiveShadow = false;
  wall.userData.physics = { mass: 0 };
  scene.add(wall);



  const material = new THREE.MeshStandardMaterial({
    map: metalTexture,
    color: 0x111111,
    aoMap,
    metalnessMap,
    roughnessMap,
    envMap: textureCube,
    normalMap,
    normalScale: new THREE.Vector2(1.5, 1.5),
    bumpMap,
    bumpScale: 1.5
  });
  const matrix = new THREE.Matrix4();

  const geometryBox = new THREE.BoxGeometry(0.1, 0.25, 0.045);
  boxes = new THREE.InstancedMesh(geometryBox, material, 60);
  boxes.instanceMatrix.setUsage(THREE.DynamicDrawUsage); // will be updated every frame
  boxes.castShadow = true;
  boxes.receiveShadow = true;
  boxes.userData.physics = { mass: 0.2 };
  scene.add(boxes);

  for (let i = 0; i < boxes.count; i++) {
    matrix.setPosition(Math.random() * 0.95 - 1, Math.random() * 1.2 + 0.5, Math.random() * 0.95 - 1);
    boxes.setMatrixAt(i, matrix);
  }

  physics.addScene(scene);

  //

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight * 2);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const drawingCanvas = document.getElementById('drawing');
  drawingCanvas.width = window.innerWidth;
  drawingCanvas.height = window.innerHeight * 2;

  const atrament = new Atrament(drawingCanvas);
  atrament.color = `#${choose(Object.values(colorPalette))}`;
  atrament.weight = 10;

  document.body.insertBefore(renderer.domElement, drawingCanvas);

  animate();
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

window.onresize = function () {
  camera.aspect = window.innerWidth / (window.innerHeight * 2);
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight * 2);
};
