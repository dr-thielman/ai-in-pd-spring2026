// Cartesian-gantry gripper: translates in world X/Y/Z, parallel jaws open
// along world X. Motion uses a simple critically-damped 2nd-order controller
// (no IK). Jaws are kinematic position-based bodies — high friction lets
// them carry blocks via squeeze, no joints needed.
//
// Public API (also bound to window.gripper in main.js):
//   setTarget({ x, y, z })   — request a new world-space target
//   setJawOpening(0..1)      — 0 = closed, 1 = fully open

import * as THREE from 'three';
import { tagCollider } from './physics.js';

const NATURAL_FREQ = 6.0;   // rad/s — gantry motion (critically damped)
let JAW_RATE       = 1.5;   // 1/s — full open<->close in ~0.7 s; overridable per-op
const JAW_OPEN_M   = 0.12;  // separation when fully open (clears block_heavy)
let JAW_CLOSE_M    = 0.095; // default; overridden per-block by controller.setJawClosedM()
const JAW_SIZE     = { x: 0.005, y: 0.06, z: 0.04 }; // thin, tall, deep
const JAW_DROP     = 0.08;  // how far below the carriage center the jaws hang

export class Gripper {
  constructor(scene, physics) {
    this.physics = physics;
    const RAPIER = physics.rapier;
    const world  = physics.world;

    // state
    this.target   = { x: 0, y: 0.30, z: 0 };
    this.position = { x: 0, y: 0.30, z: 0 };
    this.velocity = { x: 0, y: 0,    z: 0 };
    this.targetOpening = 1.0;
    this.opening       = 1.0;
    this.jawMotionState = 'idle'; // 'idle' | 'opening' | 'closing'

    // ----- visuals --------------------------------------------------------
    this.group = new THREE.Group();
    scene.add(this.group);

    const metalMat = new THREE.MeshStandardMaterial({ color: 0x9aa0a6, roughness: 0.4, metalness: 0.65 });
    const jawMat   = new THREE.MeshStandardMaterial({ color: 0x303338, roughness: 0.35, metalness: 0.8 });

    this.carriage = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.04, 0.08), metalMat);
    this.carriage.castShadow = true;
    this.group.add(this.carriage);

    this.stem = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.06, 0.02), metalMat);
    this.stem.castShadow = true;
    this.group.add(this.stem);

    this.jawLeftMesh  = new THREE.Mesh(new THREE.BoxGeometry(JAW_SIZE.x, JAW_SIZE.y, JAW_SIZE.z), jawMat);
    this.jawRightMesh = new THREE.Mesh(new THREE.BoxGeometry(JAW_SIZE.x, JAW_SIZE.y, JAW_SIZE.z), jawMat);
    this.jawLeftMesh.castShadow  = true;
    this.jawRightMesh.castShadow = true;
    this.group.add(this.jawLeftMesh);
    this.group.add(this.jawRightMesh);

    // ----- physics bodies for jaws (kinematic, position-based) ------------
    console.log('[gripper:init] jaw mode: kinematicVelocityBased — contact forces enabled');

    const makeJaw = (label, x0) => {
      const body = world.createRigidBody(
        RAPIER.RigidBodyDesc.kinematicVelocityBased()
          .setTranslation(x0, this.position.y - JAW_DROP, 0)
      );
      const collider = world.createCollider(
        RAPIER.ColliderDesc.cuboid(JAW_SIZE.x / 2, JAW_SIZE.y / 2, JAW_SIZE.z / 2)
          .setFriction(1.0)             // avg with block (0.6) ≈ 0.8 target
          .setRestitution(0.05)
          .setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS),
        body
      );
      tagCollider(physics, collider, { kind: 'jaw', label });
      return body;
    };

    this.jawLeftBody  = makeJaw('jaw_left',  -JAW_OPEN_M / 2);
    this.jawRightBody = makeJaw('jaw_right',  JAW_OPEN_M / 2);
  }

  setJawClosedM(m) {
    JAW_CLOSE_M = m;
    console.log('[gripper:jawClosedM_set]', m);
  }

  setJawOpenRate(r) {
    JAW_RATE = r;
    console.log('[gripper:jawOpenRate_set]', r);
  }

  setTarget({ x, y, z }) {
    this.target = { x, y, z };
    console.log('[gripper:target_set]', { x, y, z });
  }

  setJawOpening(v) {
    v = Math.max(0, Math.min(1, v));
    if (v < this.opening - 1e-4 && this.jawMotionState !== 'closing') {
      this.jawMotionState = 'closing';
      console.log('[gripper:jaws_close_start]');
    } else if (v > this.opening + 1e-4 && this.jawMotionState !== 'opening') {
      this.jawMotionState = 'opening';
      console.log('[gripper:jaws_open_start]');
    }
    this.targetOpening = v;
  }

  update(dt) {
    // critically-damped 2nd-order step toward target on each axis
    const w = NATURAL_FREQ;
    for (const axis of ['x', 'y', 'z']) {
      const x = this.position[axis];
      const xt = this.target[axis];
      const v  = this.velocity[axis];
      const a  = w * w * (xt - x) - 2 * w * v;
      this.velocity[axis] = v + a * dt;
      this.position[axis] = x + this.velocity[axis] * dt;
    }

    // jaw opening — linear approach to target
    if (this.opening < this.targetOpening) {
      this.opening = Math.min(this.targetOpening, this.opening + JAW_RATE * dt);
    } else if (this.opening > this.targetOpening) {
      this.opening = Math.max(this.targetOpening, this.opening - JAW_RATE * dt);
    }
    if (Math.abs(this.opening - this.targetOpening) < 1e-4) {
      this.opening = this.targetOpening;
      if (this.jawMotionState === 'closing') {
        console.log('[gripper:jaws_close_done]');
        this.jawMotionState = 'idle';
      } else if (this.jawMotionState === 'opening') {
        console.log('[gripper:jaws_open_done]');
        this.jawMotionState = 'idle';
      }
    }

    // drive kinematic jaw bodies via velocity so Rapier generates contact forces
    const width        = JAW_CLOSE_M + (JAW_OPEN_M - JAW_CLOSE_M) * this.opening;
    const jawY         = this.position.y - JAW_DROP;
    const MAX_JAW_SPD  = 5.0; // m/s cap to avoid instability on large carriage jumps
    const cap = (v) => Math.max(-MAX_JAW_SPD, Math.min(MAX_JAW_SPD, v));

    const lt = this.jawLeftBody.translation();
    const rt = this.jawRightBody.translation();

    this.jawLeftBody.setLinvel({
      x: cap((this.position.x - width / 2 - lt.x) / dt),
      y: cap((jawY - lt.y) / dt),
      z: cap((this.position.z - lt.z) / dt),
    }, true);
    this.jawRightBody.setLinvel({
      x: cap((this.position.x + width / 2 - rt.x) / dt),
      y: cap((jawY - rt.y) / dt),
      z: cap((this.position.z - rt.z) / dt),
    }, true);
  }

  syncMeshes() {
    this.carriage.position.set(this.position.x, this.position.y, this.position.z);
    this.stem.position.set(this.position.x, this.position.y - 0.05, this.position.z);
    const lt = this.jawLeftBody.translation();
    const rt = this.jawRightBody.translation();
    this.jawLeftMesh.position.set(lt.x, lt.y, lt.z);
    this.jawRightMesh.position.set(rt.x, rt.y, rt.z);
  }
}
