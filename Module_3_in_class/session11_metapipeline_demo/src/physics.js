// Rapier world setup, fixed-step driver, and contact/resting event wiring.
//
// Events fire from this layer (not the controller), so they are visible in
// DevTools whether or not the stacking controller exists yet.

const VEL_LINEAR_THRESHOLD = 0.02;   // m/s
const VEL_ANGULAR_THRESHOLD = 0.10;  // rad/s
const RESTING_TICKS_REQUIRED = 30;   // 0.5 s at 60 Hz

export function initPhysics(RAPIER) {
  const gravity = { x: 0.0, y: -9.81, z: 0.0 };
  const world = new RAPIER.World(gravity);
  world.timestep = 1 / 60;

  const eventQueue = new RAPIER.EventQueue(true);

  return {
    rapier: RAPIER,
    world,
    eventQueue,
    colliderTags: new Map(),     // collider.handle -> { kind, label }
    trackedBodies: [],           // [{ body, label }]
    activeJawContacts: new Map(),// blockLabel -> Set<jawLabel>
    restingState: new Map(),     // blockLabel -> { resting, ticks }
  };
}

export function tagCollider(physics, collider, info) {
  physics.colliderTags.set(collider.handle, info);
}

export function trackBody(physics, body, label) {
  physics.trackedBodies.push({ body, label });
}

export function stepPhysics(physics) {
  physics.world.step(physics.eventQueue);

  physics.eventQueue.drainCollisionEvents((h1, h2, started) => {
    const t1 = physics.colliderTags.get(h1);
    const t2 = physics.colliderTags.get(h2);
    if (!t1 || !t2) return;

    const blockTag = t1.kind === 'block' ? t1 : (t2.kind === 'block' ? t2 : null);
    const jawTag   = t1.kind === 'jaw'   ? t1 : (t2.kind === 'jaw'   ? t2 : null);
    if (!blockTag || !jawTag) return;

    const blockLabel = blockTag.label;
    let jaws = physics.activeJawContacts.get(blockLabel);

    if (started) {
      const wasEmpty = !jaws || jaws.size === 0;
      if (!jaws) {
        jaws = new Set();
        physics.activeJawContacts.set(blockLabel, jaws);
      }
      jaws.add(jawTag.label);
      if (wasEmpty) {
        console.log('[block:contact_with_jaw]', { block: blockLabel, jaw: jawTag.label });
      }
    } else if (jaws) {
      jaws.delete(jawTag.label);
      if (jaws.size === 0) {
        physics.activeJawContacts.delete(blockLabel);
        console.log('[block:released]', { block: blockLabel });
      }
    }
  });

  // resting detection (low velocity sustained for N ticks)
  for (const { body, label } of physics.trackedBodies) {
    const lin = body.linvel();
    const ang = body.angvel();
    const linMag = Math.hypot(lin.x, lin.y, lin.z);
    const angMag = Math.hypot(ang.x, ang.y, ang.z);
    const calm = linMag < VEL_LINEAR_THRESHOLD && angMag < VEL_ANGULAR_THRESHOLD;

    let st = physics.restingState.get(label);
    if (!st) { st = { resting: false, ticks: 0 }; physics.restingState.set(label, st); }

    if (calm) {
      st.ticks++;
      if (!st.resting && st.ticks >= RESTING_TICKS_REQUIRED) {
        st.resting = true;
        console.log('[block:resting]', { block: label });
      }
    } else {
      st.resting = false;
      st.ticks = 0;
    }
  }
}
