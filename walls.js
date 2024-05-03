import { Mesh, BoxGeometry, MeshBasicMaterial } from 'three';

import { rad, map } from './vercajch.js';

export const WALL_THICKNESS = 0.01;
export const WALL_HEIGHT = 20;
export const WALL_DEPTH = 2;

const material = new MeshBasicMaterial({ transparent: true, opacity: 0 });

const makeMesh = (x = 10, y = 10) => {
  const geometry = new BoxGeometry(x, y, WALL_THICKNESS);
  const mesh = new Mesh(geometry, material);
  mesh.castShadow = false;
  mesh.receiveShadow = false;

  return mesh;
}

export const getWidth = () => {
  if (window.innerWidth <= 1200) {
    return map(window.innerWidth, 320, 1200, 2.5, 7);
  }

  if (window.innerWidth <= 1440) {
    return map(window.innerWidth, 1200, 1440, 7, 7.5);
  }

  return map(window.innerWidth, 1440, 2560, 7.5, 8);
};

export default () => {
  const width = getWidth();
  // bit of overhang to avoid things falling thru the cracks
  const bottom = makeMesh(width + 1, WALL_DEPTH + 1);
  bottom.position.z = 0;
  bottom.rotation.x = rad(90);

  const top = makeMesh(width + 1, WALL_DEPTH + 1);
  top.position.z = 0;
  top.rotation.x = rad(90);
  top.position.y = 20;

  const left = makeMesh(WALL_DEPTH, WALL_HEIGHT);
  left.position.x = -(width/2);
  left.position.y = 10;
  left.position.z = 0;
  left.rotation.y = rad(90);
  left.rotation.x = rad(0);

  const right = makeMesh(WALL_DEPTH, WALL_HEIGHT);
  right.position.x = width/2;
  right.position.y = 10;
  right.position.z = 0;
  right.rotation.y = rad(-90);
  right.rotation.x = rad(0);

  const back = makeMesh(width, WALL_HEIGHT);
  back.position.y = 10;
  back.position.z = -1;
  back.rotation.x = rad(0);

  const front = makeMesh(width, WALL_HEIGHT);
  front.position.y = 10;
  front.position.z = 1;
  front.rotation.x = rad(0);

  return [
    top,
    bottom,
    left,
    right,
    back,
    front,
  ];
};
