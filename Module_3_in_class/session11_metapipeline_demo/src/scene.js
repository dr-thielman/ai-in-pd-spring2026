// Scene geometry: table, blocks, crown, target zone, lighting.
// Three.js meshes are paired with Rapier rigid bodies; syncMeshes() copies
// physics transforms onto the meshes each frame.

import * as THREE from 'three';
import { tagCollider, trackBody } from './physics.js';

const TABLE = { x: 1.0, y: 0.05, z: 0.6 };
const FRONT_Z = 0.22;     // front of table is +z; blocks sit here at start
const TARGET_Z = -0.20;   // rear-center, ~0.2 m back from front edge
const TARGET_SIZE = 0.15;

const BLOCK_SPECS = [
  { label: 'block_heavy',  size: 0.10, mass: 0.50, color: 0x228b22, x: -0.20 }, // forest green
  { label: 'block_medium', size: 0.08, mass: 0.25, color: 0x4169e1, x: -0.06 }, // royal blue
  { label: 'block_light',  size: 0.06, mass: 0.10, color: 0xdc143c, x:  0.06, friction: 2.5 }, // crimson red — high friction so crown doesn't roll off top face
];

const CROWN = { radius: 0.025, mass: 0.05, color: 0xffd700, x: 0.40, z: FRONT_Z };

export function buildScene(scene, physics) {
  const RAPIER = physics.rapier;
  const world = physics.world;

  // ----- lighting ---------------------------------------------------------
  scene.add(new THREE.HemisphereLight(0xffffff, 0x404040, 0.55));
  const dir = new THREE.DirectionalLight(0xffffff, 1.1);
  dir.position.set(0.5, 1.2, 0.7);
  dir.castShadow = true;
  dir.shadow.mapSize.set(2048, 2048);
  dir.shadow.camera.left = -0.8;
  dir.shadow.camera.right = 0.8;
  dir.shadow.camera.top = 0.8;
  dir.shadow.camera.bottom = -0.8;
  dir.shadow.camera.near = 0.1;
  dir.shadow.camera.far = 4;
  scene.add(dir);

  // ----- table ------------------------------------------------------------
  const tableMesh = new THREE.Mesh(
    new THREE.BoxGeometry(TABLE.x, TABLE.y, TABLE.z),
    new THREE.MeshStandardMaterial({ color: 0xc8c8c8, roughness: 0.7, metalness: 0.05 })
  );
  tableMesh.position.set(0, -TABLE.y / 2, 0); // top surface at y = 0
  tableMesh.receiveShadow = true;
  scene.add(tableMesh);

  const tableBody = world.createRigidBody(
    RAPIER.RigidBodyDesc.fixed().setTranslation(0, -TABLE.y / 2, 0)
  );
  const tableCollider = world.createCollider(
    RAPIER.ColliderDesc.cuboid(TABLE.x / 2, TABLE.y / 2, TABLE.z / 2)
      .setFriction(0.6)
      .setRestitution(0.05),
    tableBody
  );
  tagCollider(physics, tableCollider, { kind: 'table', label: 'table' });

  // ----- target zone (visual only, no collider) ---------------------------
  const targetGeom = new THREE.PlaneGeometry(TARGET_SIZE, TARGET_SIZE);
  const targetEdges = new THREE.LineSegments(
    new THREE.EdgesGeometry(targetGeom),
    new THREE.LineBasicMaterial({ color: 0x00ffff })
  );
  targetEdges.rotation.x = -Math.PI / 2;
  targetEdges.position.set(0, 0.0006, TARGET_Z);
  scene.add(targetEdges);

  // ----- blocks -----------------------------------------------------------
  const blocks = [];
  for (const spec of BLOCK_SPECS) {
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(spec.size, spec.size, spec.size),
      new THREE.MeshStandardMaterial({ color: spec.color, roughness: 0.55, metalness: 0.1 })
    );
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);

    const y0 = spec.size / 2 + 0.001;
    const body = world.createRigidBody(
      RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(spec.x, y0, FRONT_Z)
        .setCcdEnabled(true)
    );
    // density = mass / volume so the requested mass is realized
    const density = spec.mass / (spec.size ** 3);
    const collider = world.createCollider(
      RAPIER.ColliderDesc.cuboid(spec.size / 2, spec.size / 2, spec.size / 2)
        .setDensity(density)
        .setFriction(spec.friction ?? 0.6)
        .setRestitution(0.05)
        .setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS),
      body
    );
    tagCollider(physics, collider, { kind: 'block', label: spec.label });
    trackBody(physics, body, spec.label);

    blocks.push({ label: spec.label, kind: 'block', size: spec.size, mass: spec.mass, mesh, body });
  }

  // ----- crown ------------------------------------------------------------
  const crownMesh = new THREE.Mesh(
    new THREE.SphereGeometry(CROWN.radius, 28, 18),
    new THREE.MeshStandardMaterial({ color: CROWN.color, roughness: 0.25, metalness: 0.7 })
  );
  crownMesh.castShadow = true;
  crownMesh.receiveShadow = true;
  scene.add(crownMesh);

  const crownBody = world.createRigidBody(
    RAPIER.RigidBodyDesc.dynamic()
      .setTranslation(CROWN.x, CROWN.radius + 0.001, CROWN.z)
      .setCcdEnabled(true)
  );
  const crownVolume = (4 / 3) * Math.PI * CROWN.radius ** 3;
  const crownCollider = world.createCollider(
    RAPIER.ColliderDesc.ball(CROWN.radius)
      .setDensity(CROWN.mass / crownVolume)
      .setFriction(2.5)
      .setRestitution(0.0)
      .setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS),
    crownBody
  );
  tagCollider(physics, crownCollider, { kind: 'block', label: 'crown' });
  trackBody(physics, crownBody, 'crown');

  blocks.push({
    label: 'crown', kind: 'crown', size: CROWN.radius * 2, mass: CROWN.mass,
    mesh: crownMesh, body: crownBody,
  });

  // ----- transform sync ---------------------------------------------------
  function syncMeshes() {
    for (const b of blocks) {
      const t = b.body.translation();
      const r = b.body.rotation();
      b.mesh.position.set(t.x, t.y, t.z);
      b.mesh.quaternion.set(r.x, r.y, r.z, r.w);
    }
  }

  return {
    blocks,
    targetZone: { x: 0, z: TARGET_Z, size: TARGET_SIZE },
    syncMeshes,
  };
}
