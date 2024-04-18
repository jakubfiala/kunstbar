import { Mesh, BoxGeometry, MeshStandardMaterial } from 'three';

import { rad } from './vercajch.js';

const material = new MeshStandardMaterial({ transparent: true, opacity: 0 });
// const material = new MeshStandardMaterial({ color: 'red' });

const makeMesh = (x = 10, y = 10, shadow = true) => {
  const geometry = new BoxGeometry(x, y, 0.01);
  const mesh = new Mesh(geometry, material);

  mesh.userData.physics = { mass: 0 };
  mesh.castShadow = false;
  mesh.receiveShadow = false;

  return mesh;
}

export default ({ width = 2 }) => {
  const bottom = makeMesh(width+1, 3);
  bottom.position.z = 0;
  bottom.rotation.x = rad(90);

  const left = makeMesh(2, 20);
  left.position.x = -(width/2);
  left.position.y = 10;
  left.position.z = 0;
  left.rotation.y = rad(90);
  left.rotation.x = rad(0);

  const right = makeMesh(2, 20);
  right.position.x = width/2;
  right.position.y = 10;
  right.position.z = 0;
  right.rotation.y = rad(-90);
  right.rotation.x = rad(0);

  const back = makeMesh(width, 20);
  back.position.y = 10;
  back.position.z = -1;
  back.rotation.x = rad(0);

  const front = makeMesh(width, 20, false);
  front.position.y = 10;
  front.position.z = 1;
  front.rotation.x = rad(0);

  return [
    bottom,
    left,
    right,
    back,
    front,
  ];
};
