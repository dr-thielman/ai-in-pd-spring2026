# Session 11 Meta-Pipeline Demo — Starting Scene

A 3D block-stacking starting scene used as the recorded artifact for Session 11
of ME 493B. The demo teaches the meta-pipeline pattern:

  Builder (Claude Code) → Observer (Claude in Chrome) → Reviewer (Claude Desktop) → Builder

This repository contains **only the starting scene**. The stacking controller
is intentionally absent — it emerges through iteration during the recorded
demo. See `src/controller.js` for the placeholder.

## Run

```
npm install
npm run dev
```

Open the localhost URL Vite prints (typically http://localhost:5173/).

## The goal (read aloud at the start of the recording)

> Pick up the three blocks in order — heaviest first, then medium, then
> lightest — and stack them in the cyan target zone with each block centered
> on the one below. Place the gold crown on top. The stack must remain stable
> for 5 seconds after the last placement.

## Manual smoke test in the browser console

```js
window.gripper.setTarget({ x: 0, y: 0.2, z: 0 });
window.gripper.setJawOpening(0);   // close
window.gripper.setJawOpening(1);   // open
window.metrics.markPlacement();    // sets the centroid-drift baseline
```

## Files

| File | Role |
|---|---|
| `src/main.js` | Entry point: renderer, scene, physics loop |
| `src/scene.js` | Table, blocks, crown, target zone, lighting, camera |
| `src/gripper.js` | Cartesian-gantry gripper geometry + control API |
| `src/physics.js` | Rapier world, fixed step, contact + resting events |
| `src/metrics.js` | Stack height, centroid drift, max angular velocity |
| `src/overlay.js` | HTML metrics overlay (top-right of canvas) |
| `src/controller.js` | **Empty stub.** The controller emerges on camera. |
| `skills/*.md` | The four pipeline skills (Builder, Observer, Reviewer, Scene) |
