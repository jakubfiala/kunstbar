import { Vector3, Quaternion, Matrix4 } from 'three';
import { World } from 'oimo';

const G = 9.81;
const FRAME_RATE = 30;
const _scale = new Vector3(1, 1, 1);

export default async function createPhysics() {
	const gravity = new Vector3(0.0, - 9.81, 0.0);
	const world = new World({
    timestep: 1/FRAME_RATE,
    iterations: 8,
    broadphase: 2, // 1 brute force, 2 sweep and prune, 3 volume tree
    worldscale: 1, // scale full world
    random: true,  // randomize sample
    info: false,   // calculate statistic or not
    gravity: [0,-9.81,0]
  });

	const meshes = [];
	const meshMap = new WeakMap();

	const _vector = new Vector3();
	const _quaternion = new Quaternion();
	const _matrix = new Matrix4();

	function addMesh(mesh, mass = 0) {
		const body = mesh.isInstancedMesh
			? createInstancedBody(mesh, mass)
			: createBody(mesh, mass);

		if (mass > 0) {
			meshes.push(mesh);
			meshMap.set(mesh, body);
		}

	}

	function createInstancedBody(mesh, mass) {
		const array = mesh.instanceMatrix.array;
		const bodies = [];

		for (let i = 0; i < mesh.count; i++) {
			const position = _vector.fromArray(array, i * 16 + 12);
			bodies.push(createBody(mesh, mass, position));
		}

		return bodies;
	}

	function createBody(mesh, mass, overridePosition) {
    const position = overridePosition || mesh.position;
    const { geometry: { parameters } } = mesh;
    const sx = parameters.width;
		const sy = parameters.height;
		const sz = parameters.depth;

		const body = world.add({
      type: 'box',
      size: [sx, sy, sz],
      pos: [position.x, position.y, position.z],
      rotation: [0, 0, 0],
      move: mass > 0,
      density: 1,
      friction: 0,
      restitution: 0,
    });

		return body;
	}

	function step() {
		world.step();

		for (let i = 0, l = meshes.length; i < l; i++) {
			const mesh = meshes[i];

			if (mesh.isInstancedMesh) {
				const array = mesh.instanceMatrix.array;
				const bodies = meshMap.get(mesh);

				for (let j = 0; j < bodies.length; j++) {
					const body = bodies[j];
					const position = body.getPosition();
					_quaternion.copy(body.getQuaternion());
					_matrix.compose(position, _quaternion, _scale).toArray(array, j * 16);
				}

				mesh.instanceMatrix.needsUpdate = true;
				mesh.computeBoundingSphere();

			} else {
				const body = meshMap.get(mesh);
				mesh.position.copy(body.getPosition());
				mesh.quaternion.copy(body.getQuaternion());
			}
		}
	}

	setInterval(step, 1000 / FRAME_RATE);

	// const gUp = () => {
	// 	document.getElementById('bars').classList.add('bars--hidden');
  //   gravity.x = 0;
  //   gravity.y = G/2;
  // };

	// document.addEventListener('scroll', gUp, { once: true });
	// document.getElementById('bars').addEventListener('click', gUp);

	return { addMesh };
}
