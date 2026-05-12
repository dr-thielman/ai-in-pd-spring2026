---
name: scene_setup
description: Frozen scene parameters for the Session 11 block-stacking demo. Do not change these between iterations — comparison across iterations relies on a stable substrate.
---

# Scene setup — fixed parameters

These are the demo's invariants. The controller changes; the scene does not.
If you find yourself wanting to tweak any of these mid-iteration, stop and
log the urge instead — that's a sign the controller is asking the wrong
question of the scene.

## World

| Parameter | Value |
|---|---|
| Gravity | (0, −9.81, 0) m/s² |
| Physics step | 1/60 s, fixed |
| Restitution (all bodies) | 0.05 |
| CCD | enabled on blocks and crown |

## Table

| Parameter | Value |
|---|---|
| Size | 1.00 × 0.05 × 0.60 m |
| Top surface | y = 0 |
| Friction | 0.6 |
| Color | light gray |

## Blocks (mass-coded by color)

| Label | Size (m) | Mass (kg) | Color | Initial x |
|---|---|---|---|---|
| `block_heavy`  | 0.10 cube | 0.50 | forest green (#228b22) | −0.20 |
| `block_medium` | 0.08 cube | 0.25 | royal blue (#4169e1)   | −0.06 |
| `block_light`  | 0.06 cube | 0.10 | crimson red (#dc143c)  | +0.06 |

Initial z for all three: **0.22 m** (front edge of table).
Block-block and block-table friction: **0.6**.

## Crown

| Parameter | Value |
|---|---|
| Geometry | sphere, radius 0.025 m |
| Mass | 0.05 kg |
| Color | gold (#ffd700) |
| Initial position | (0.40, 0.026, 0.22) — front-right |

## Target zone

| Parameter | Value |
|---|---|
| Shape | square outline on table surface |
| Size | 0.15 × 0.15 m |
| Position | (0, 0, −0.20) — rear-center, ~0.20 m from front edge |
| Render | thin cyan wireframe, no collider |

## Gripper

Cartesian gantry — translates X/Y/Z, no IK. Parallel jaws open along world X.

| Parameter | Value |
|---|---|
| Jaw geometry | 0.005 × 0.06 × 0.04 m each |
| Jaw separation when open | 0.12 m (clears block_heavy) |
| Jaw separation when closed | 0.005 m |
| Jaw friction | 1.0 (avg with block 0.6 → ~0.8 contact) |
| Initial position | (0, 0.30, 0), jaws open |
| Motion controller | critically damped, ω = 6 rad/s |
| Jaw rate | 1.5 / s (~0.7 s full open↔close) |

## Camera + lighting

| Parameter | Value |
|---|---|
| Camera | perspective, fov 50, near 0.01, far 10 |
| Camera position | (0.7, 0.5, 0.7) |
| Look-at | (0, 0.1, 0) |
| OrbitControls | enabled with damping |
| Lighting | hemisphere + one directional from upper-front-right, shadows on |
| Shadow map | 2048 × 2048 |
