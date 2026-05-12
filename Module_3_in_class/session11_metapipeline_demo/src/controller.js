// Stacking controller — Iteration 1
//
// State machine: APPROACH → DESCEND_GRIP → GRIP_WAIT → LIFT →
//                CARRY → DESCEND_PLACE → RELEASE_WAIT → RETREAT
// Repeats for each entry in SEQUENCE (heaviest block first), then done.

const JAW_DROP = 0.08; // carriage center → jaw center, from gripper.js

const PARAMS = {
  APPROACH_Y:  0.35,   // carriage y when hovering above any block (safe clearance)
  LIFT_Y:      0.40,   // carriage y during transit — must exceed all placeY values (crown placeY = 0.346)
  GRIP_WAIT:   1.0,    // seconds after jaw close before lifting
  SETTLE_WAIT: 1.2,    // seconds after release before next pick
  ARRIVE_TOL:  0.006,  // meters — "gripper arrived" threshold
};

// Block centers at scene start: size/2 + 0.001 (matches scene.js)
// gripY  = block_center_y + JAW_DROP  (jaw center aligned to block center)
// placeY = desired_block_center_y_at_rest + 0.010 + JAW_DROP  (1 cm drop buffer)
const SEQUENCE = [
  {
    label:  'block_heavy',
    pickX: -0.20, pickZ:  0.22,
    gripY:  0.051 + JAW_DROP,                        // 0.131
    closeM: 0.095,                                   // 0.95 × 0.10 m block width
    placeX:  0.00, placeZ: -0.20,
    placeY:  0.051 + 0.010 + JAW_DROP,               // 0.141  (1 cm above table rest)
  },
  {
    label:  'block_medium',
    pickX: -0.06, pickZ:  0.22,
    gripY:  0.041 + JAW_DROP,                        // 0.121
    closeM: 0.076,                                   // 0.95 × 0.08 m block width
    placeX:  0.00, placeZ: -0.20,
    placeY:  (0.101 + 0.040) + 0.010 + JAW_DROP,    // 0.231  (on heavy)
  },
  {
    label:  'block_light',
    pickX:  0.06, pickZ:  0.22,
    gripY:  0.031 + JAW_DROP,                        // 0.111
    closeM: 0.057,                                   // 0.95 × 0.06 m block width
    placeX:  0.00, placeZ: -0.20,
    placeY:  (0.101 + 0.080 + 0.030) + 0.010 + JAW_DROP, // 0.301  (on medium)
  },
  {
    label:  'crown',
    pickX:  0.40, pickZ:  0.22,
    gripY:  0.026 + JAW_DROP,                        // 0.106
    closeM:      0.0475,                             // 0.95 × 0.05 m crown diameter
    settleWait:  1.5,                                // extra time — sphere rolls off with any lateral velocity
    openRate:    0.3,                                // 5× slower open — lets crown settle before jaws depart contact
    dwell:       true,                               // wait for near-zero carriage velocity before opening jaws
    placeX:  0.00, placeZ: -0.20,
    placeY:  (0.101 + 0.080 + 0.060 + 0.025) + 0.000 + JAW_DROP, // 0.346  (no drop buffer — lower crown onto red block face)
  },
];

const INITIAL_POSITIONS = {
  'block_heavy':  { x: -0.20, y: 0.051, z: 0.22 },
  'block_medium': { x: -0.06, y: 0.041, z: 0.22 },
  'block_light':  { x:  0.06, y: 0.031, z: 0.22 },
  'crown':        { x:  0.40, y: 0.026, z: 0.22 },
};

export class Controller {
  constructor({ gripper, blocks, metrics }) {
    this.gripper = gripper;
    this.blocks  = blocks;
    this.metrics = metrics;
    this.status  = 'IDLE';

    this._opIdx      = 0;
    this._phase      = null;
    this._phaseTimer = 0;
    this._running    = false;
  }

  start() {
    if (this._running) return;
    console.log('[ctrl:start] PARAMS:', JSON.stringify(PARAMS));
    console.log('[ctrl:start] sequence:', SEQUENCE.map(s => s.label).join(' → '));
    this._opIdx   = 0;
    this._running = true;
    this.status   = 'RUNNING';
    this._enterPhase('APPROACH');
  }

  reset() {
    this._running    = false;
    this._opIdx      = 0;
    this._phase      = null;
    this._phaseTimer = 0;
    this.status      = 'IDLE';

    // Teleport gripper back to home
    const g = this.gripper;
    g.position       = { x: 0, y: 0.30, z: 0 };
    g.velocity       = { x: 0, y: 0,    z: 0 };
    g.target         = { x: 0, y: 0.30, z: 0 };
    g.opening        = 1.0;
    g.targetOpening  = 1.0;
    g.jawMotionState = 'idle';

    // Teleport blocks back to initial positions with zero velocity
    for (const b of this.blocks) {
      const init = INITIAL_POSITIONS[b.label];
      if (!init) continue;
      b.body.setTranslation(init, true);
      b.body.setRotation({ x: 0, y: 0, z: 0, w: 1 }, true);
      b.body.setLinvel({ x: 0, y: 0, z: 0 }, true);
      b.body.setAngvel({ x: 0, y: 0, z: 0 }, true);
    }

    // Reset metrics drift tracking
    this.metrics.placementCentroid = null;
    this.metrics.angHistory.length = 0;

    console.log('[ctrl:reset] scene and gripper restored to initial state');
  }

  step(dt) {
    if (!this._running) return;
    this._phaseTimer += dt;
    this._tick();
  }

  // ---- internals -----------------------------------------------------------

  _op() { return SEQUENCE[this._opIdx]; }

  _arrived() {
    const g   = this.gripper;
    const tol = PARAMS.ARRIVE_TOL;
    return (
      Math.abs(g.position.x - g.target.x) < tol &&
      Math.abs(g.position.y - g.target.y) < tol &&
      Math.abs(g.position.z - g.target.z) < tol
    );
  }

  _enterPhase(phase) {
    this._phase      = phase;
    this._phaseTimer = 0;
    const op = this._op();
    const g  = this.gripper;

    switch (phase) {
      case 'APPROACH':
        g.setJawOpening(1.0);
        g.setTarget({ x: op.pickX, y: PARAMS.APPROACH_Y, z: op.pickZ });
        this.status = `APPROACH → ${op.label}`;
        console.log('[ctrl:APPROACH]', op.label,
          '| target:', op.pickX, PARAMS.APPROACH_Y, op.pickZ);
        break;

      case 'DESCEND_GRIP':
        g.setTarget({ x: op.pickX, y: op.gripY, z: op.pickZ });
        this.status = `DESCEND_GRIP → ${op.label}`;
        console.log('[ctrl:DESCEND_GRIP]', op.label, '| gripY:', op.gripY);
        break;

      case 'GRIP_WAIT':
        g.setJawClosedM(op.closeM);
        g.setJawOpening(0);
        this.status = `GRIPPING ${op.label}`;
        console.log('[ctrl:GRIP_WAIT]', op.label, '— closeM:', op.closeM, '— jaws closing');
        break;

      case 'LIFT':
        g.setTarget({ x: op.pickX, y: PARAMS.LIFT_Y, z: op.pickZ });
        this.status = `LIFT ${op.label}`;
        console.log('[ctrl:LIFT]', op.label, '| liftY:', PARAMS.LIFT_Y);
        break;

      case 'CARRY':
        g.setTarget({ x: op.placeX, y: PARAMS.LIFT_Y, z: op.placeZ });
        this.status = `CARRY ${op.label}`;
        console.log('[ctrl:CARRY]', op.label,
          '| target:', op.placeX, PARAMS.LIFT_Y, op.placeZ);
        break;

      case 'DESCEND_PLACE':
        g.setTarget({ x: op.placeX, y: op.placeY, z: op.placeZ });
        this.status = `LOWER ${op.label}`;
        console.log('[ctrl:DESCEND_PLACE]', op.label, '| placeY:', op.placeY);
        break;

      case 'DWELL':
        // hold target — no new setTarget call; wait for velocity to decay
        this.status = `DWELL ${op.label}`;
        console.log('[ctrl:DWELL]', op.label, '— holding position until velocity < 0.005 m/s');
        break;

      case 'RELEASE_WAIT':
        g.setJawOpenRate(op.openRate ?? 1.5);
        g.setJawOpening(1.0);
        this.metrics.markPlacement();
        this.status = `PLACED ${op.label} — settling`;
        console.log('[ctrl:RELEASE_WAIT]', op.label, '— openRate:', op.openRate ?? 1.5, '— jaws open, placement marked');
        break;

      case 'RETREAT':
        if (op.label === 'crown') g.setJawOpenRate(1.5); // restore default before next run
        g.setTarget({ x: op.placeX, y: PARAMS.LIFT_Y, z: op.placeZ });
        this.status = `RETREAT after ${op.label}`;
        console.log('[ctrl:RETREAT]', op.label);
        break;
    }
  }

  _tick() {
    switch (this._phase) {
      case 'APPROACH':
        if (this._arrived()) this._enterPhase('DESCEND_GRIP');
        break;

      case 'DESCEND_GRIP':
        if (this._arrived()) this._enterPhase('GRIP_WAIT');
        break;

      case 'GRIP_WAIT':
        if (this._phaseTimer >= PARAMS.GRIP_WAIT) this._enterPhase('LIFT');
        break;

      case 'LIFT':
        if (this._arrived()) this._enterPhase('CARRY');
        break;

      case 'CARRY':
        if (this._arrived()) this._enterPhase('DESCEND_PLACE');
        break;

      case 'DESCEND_PLACE':
        if (this._arrived()) {
          this._enterPhase(this._op().dwell ? 'DWELL' : 'RELEASE_WAIT');
        }
        break;

      case 'DWELL': {
        const g = this.gripper;
        const speed = Math.hypot(g.velocity.x, g.velocity.y, g.velocity.z);
        if (speed < 0.005) this._enterPhase('RELEASE_WAIT');
        break;
      }

      case 'RELEASE_WAIT': {
        const wait = this._op().settleWait ?? PARAMS.SETTLE_WAIT;
        if (this._phaseTimer >= wait) this._enterPhase('RETREAT');
        break;
      }

      case 'RETREAT':
        if (this._arrived()) {
          this._opIdx++;
          if (this._opIdx >= SEQUENCE.length) {
            this._running = false;
            this.status   = 'DONE — monitoring stability';
            console.log('[ctrl:done] all blocks placed — watching centroid drift and ω');
          } else {
            this._enterPhase('APPROACH');
          }
        }
        break;
    }
  }
}
