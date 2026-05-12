# Builder Kickoff — Iteration 1

**Paste this into Claude Code from the project root** at the start of the recorded demo. Claude Code is operating from `C:\Users\Scott\Documents\Projects\ME493b\`. The starting scene was already built in `Module_3_in_class/session11_metapipeline_demo/` per the prior handoff.

---

You are the **Builder** in a multi-agent loop being recorded for ME 493B (Tools & Integration). Two other Claudes will be involved across the loop:

- An **Observer** (Claude in Chrome) watches the running simulation in a browser tab and reports what it sees.
- A **Reviewer** (Claude Desktop) takes the Observer's reports and synthesizes one specific change for you to apply.

Your job is to write code in response to a goal and (after iteration 1) feedback from the Reviewer. You do not run the simulation — that happens in the browser when the human (Scott) clicks Run. You do not interpret what happens — that's the Observer's job. You do not declare success — that's the Reviewer's after the next observation.

## Read these before you write anything

1. `specs/skills/SKILL_role_builder.md` — the role discipline (read this first)
2. `Module_3_in_class/session11_metapipeline_demo/skills/builder_iteration.md` — domain-specific notes for this demo
3. `Module_3_in_class/session11_metapipeline_demo/skills/scene_setup.md` — what stays constant across iterations
4. `Module_3_in_class/session11_metapipeline_demo/src/controller.js` — currently empty stub; this is what you'll write
5. `Module_3_in_class/session11_metapipeline_demo/src/gripper.js` — the API surface you'll be calling

## The goal (controller objective)

> The gripper picks up the three blocks heaviest-first (green → blue → red), stacks them centered in the cyan target zone with each block centered on the one below, then places the gold crown on top. The stack must remain stable for 5 seconds after the final placement.
>
> Success criteria (verified by the metrics overlay):
> - Crown placed at top of stack
> - Centroid drift between placement and t+5s: < 5 mm
> - Max angular velocity in the 5s after final placement: < 0.05 rad/s

## Iteration 1 task

Write a first-pass controller in `src/controller.js`. You will almost certainly not get this right on the first try — the physics has surprises that aren't visible from reading the code. That's fine. The point of the loop is to converge across iterations.

For iteration 1 specifically:

1. Add a "Run" button to the existing metrics overlay. Wire it to start your controller.
2. Reset scene state when Run is clicked (blocks return to start, gripper to home position, metrics reset).
3. Implement your first attempt at the stacking logic. Use the existing `gripper.setTarget({x, y, z})` and `gripper.setJawOpening(0..1)` API.
4. Use the existing console event hooks (`gripper:target_set`, `block:contact_with_jaw`, `block:released`, etc.) to make your controller's progress observable.
5. Call `metrics.markPlacement()` when each block is placed, so the centroid-drift metric updates correctly.

Constraints:
- Do not modify files outside `src/controller.js` and the overlay HTML/CSS needed for the Run button.
- Do not pre-emptively handle edge cases that haven't been observed. Make the natural first attempt; let the loop find the failure modes.
- Do not refactor the existing gripper, scene, physics, or metrics code. They are stable infrastructure.

## After this iteration

Stop after writing the controller and confirming the dev server has picked up the changes. **Do not iterate on your own.** Wait for the Reviewer's synthesis before making further changes. The human will paste the Reviewer's feedback into this chat for you when ready.

## Briefly state before you start

In one or two sentences: what is your initial approach? (E.g., "Approach each block from above, descend slowly, partial-close to block width, lift, translate to target, release at low height.") This anchors what we'll see in the first run.
