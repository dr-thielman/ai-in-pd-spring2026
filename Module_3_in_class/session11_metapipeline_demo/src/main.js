// Entry point: bootstraps Rapier, builds the Three.js scene, runs the
// fixed-step physics loop, and exposes the gripper/metrics handles on
// `window` so the Observer can drive them from DevTools during the demo.

import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { initPhysics, stepPhysics } from './physics.js';
import { buildScene } from './scene.js';
import { Gripper } from './gripper.js';
import { Metrics } from './metrics.js';
import { Overlay } from './overlay.js';
import { Controller } from './controller.js';

await RAPIER.init();

// ----- renderer -------------------------------------------------------------
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type    = THREE.PCFSoftShadowMap;
renderer.outputColorSpace  = THREE.SRGBColorSpace;
document.getElementById('app').appendChild(renderer.domElement);

// ----- scene + camera -------------------------------------------------------
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a1f);

const camera = new THREE.PerspectiveCamera(
  50, window.innerWidth / window.innerHeight, 0.01, 10
);
camera.position.set(0.7, 0.5, 0.7);
camera.lookAt(0, 0.1, 0);

const orbit = new OrbitControls(camera, renderer.domElement);
orbit.target.set(0, 0.1, 0);
orbit.enableDamping = true;
orbit.dampingFactor = 0.1;

// ----- physics + world objects ----------------------------------------------
const physics = initPhysics(RAPIER);
const world   = buildScene(scene, physics);
const gripper = new Gripper(scene, physics);
const metrics = new Metrics(world.blocks);
const overlay = new Overlay();
const controller = new Controller({ gripper, blocks: world.blocks, metrics });

// ----- console handles for the Observer / live demo -------------------------
window.gripper    = gripper;
window.metrics    = metrics;
window.controller = controller;
window.world      = world;
window.physics    = physics;

// ----- main loop with fixed physics step ------------------------------------
const FIXED_DT = 1 / 60;
const clock = new THREE.Clock();
let accumulator = 0;

function animate() {
  const frameDt = Math.min(clock.getDelta(), 0.1);
  accumulator += frameDt;

  while (accumulator >= FIXED_DT) {
    gripper.update(FIXED_DT);
    if (typeof controller.step === 'function') controller.step(FIXED_DT);
    stepPhysics(physics);
    accumulator -= FIXED_DT;
  }

  world.syncMeshes();
  gripper.syncMeshes();
  metrics.update();
  overlay.update(metrics.values, controller.status);
  orbit.update();

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

console.log('[demo] starting scene loaded — try window.gripper.setTarget({x:0,y:0.2,z:0})');
animate();
