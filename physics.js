import { Vector3, Quaternion, Matrix4 } from 'three';
import { World, RigidBodyDesc, ColliderDesc, init } from '@dimforge/rapier3d-compat';

const G = 9.81;
const FRAME_RATE = 50;
const _scale = new Vector3(1, 1, 1);

export default async function createPhysics() {
	await init();

	const gravity = new Vector3(0.0, - 9.81, 0.0);
	const world = new World(gravity);

	const meshes = [];
	const meshMap = new WeakMap();

	const _vector = new Vector3();
	const _quaternion = new Quaternion();
	const _matrix = new Matrix4();

	const instancedBodies = [];

	function addMesh(mesh, mass = 0) {
		const { geometry: { parameters } } = mesh;
		const sx = parameters.width !== undefined ? parameters.width / 2 : 0.5;
		const sy = parameters.height !== undefined ? parameters.height / 2 : 0.5;
		const sz = parameters.depth !== undefined ? parameters.depth / 2 : 0.5;

		const shape = ColliderDesc.cuboid(sx, sy, sz);
		shape.setMass(mass);

		const body = mesh.isInstancedMesh
			? createInstancedBody(mesh, mass, shape)
			: createBody(mesh.position, mesh.quaternion, mass, shape);

		if (mass > 0) {
			meshes.push(mesh);
			meshMap.set(mesh, body);
		}

	}

	function createInstancedBody(mesh, mass, shape) {
		const array = mesh.instanceMatrix.array;
		const bodies = [];

		for (let i = 0; i < mesh.count; i++) {
			const position = _vector.fromArray(array, i * 16 + 12);
			bodies.push(createBody(position, null, mass, shape));
		}

		instancedBodies.push(bodies);

		return bodies;
	}

	function createBody(position, quaternion, mass, shape) {
		const desc = mass > 0 ? RigidBodyDesc.dynamic() : RigidBodyDesc.fixed();
		desc.setTranslation(...position);
		if (quaternion !== null) desc.setRotation(quaternion);

		const body = world.createRigidBody(desc);
		world.createCollider(shape, body);

		return body;
	}

	function step() {
		if (document.visibilityState === 'hidden') {
			return;
		}

		world.step();

		for (let i = 0, l = meshes.length; i < l; i++) {
			const mesh = meshes[i];

			if (mesh.isInstancedMesh) {
				const array = mesh.instanceMatrix.array;
				const bodies = meshMap.get(mesh);

				for (let j = 0; j < bodies.length; j++) {
					const body = bodies[j];
					const position = body.translation();
					_quaternion.copy(body.rotation());
					_matrix.compose(position, _quaternion, _scale).toArray(array, j * 16);
				}

				mesh.instanceMatrix.needsUpdate = true;
				mesh.computeBoundingSphere();

			} else {
				const body = meshMap.get(mesh);
				mesh.position.copy(body.translation());
				mesh.quaternion.copy(body.rotation());
			}
		}
	}

	setInterval(step, 1000 / FRAME_RATE);

	const gUp = () => {
		// instancedBodies.forEach((bodies) => bodies.forEach((body) => {
		// 	if (Math.random() > 0.3) {
		// 		body.setGravityScale(0);
		// 		body.applyImpulse(new Vector3(0, 20, 0));
		// 	}
		// }));
		gravity.x = 0;
		gravity.y = G;
  };

	const gDown = () => {
		// instancedBodies.forEach((bodies) => bodies.forEach((body) => {
		// 	if (Math.random() > 0.3) {
		// 		body.setGravityScale(0);
		// 		body.applyImpulse(new Vector3(0, 20, 0));
		// 	}
		// }));
		gravity.x = 0;
		gravity.y = -G;
  };

	return { addMesh, gUp, gDown };
}
