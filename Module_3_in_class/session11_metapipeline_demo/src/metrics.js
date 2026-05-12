// Live success metrics for the stacking task.
//
//  stackHeight   — y of the highest block top face
//  centroidDrift — horizontal distance between current stack centroid and
//                  the centroid recorded at the most recent markPlacement()
//  maxAngVel     — rolling 1-second max angular speed across all blocks

const ANG_HISTORY_FRAMES = 60;

export class Metrics {
  constructor(blocks) {
    this.blocks = blocks;
    this.values = { stackHeight: 0, centroidDrift: 0, maxAngVel: 0 };
    this.angHistory = [];
    this.placementCentroid = null;
  }

  markPlacement() {
    this.placementCentroid = this._stackCentroid();
    console.log('[metrics:placement_marked]', this.placementCentroid);
  }

  _stackCentroid() {
    let mx = 0, mz = 0, m = 0;
    for (const b of this.blocks) {
      const t = b.body.translation();
      // include any block whose center is above the table surface
      if (t.y > b.size / 2 + 0.005) {
        mx += t.x * b.mass;
        mz += t.z * b.mass;
        m  += b.mass;
      }
    }
    if (m === 0) return { x: 0, z: 0 };
    return { x: mx / m, z: mz / m };
  }

  update() {
    let maxTop = 0;
    let maxAngThisFrame = 0;
    for (const b of this.blocks) {
      const t = b.body.translation();
      const top = t.y + b.size / 2;
      if (top > maxTop) maxTop = top;

      const a = b.body.angvel();
      const aMag = Math.hypot(a.x, a.y, a.z);
      if (aMag > maxAngThisFrame) maxAngThisFrame = aMag;
    }
    this.values.stackHeight = maxTop;

    this.angHistory.push(maxAngThisFrame);
    if (this.angHistory.length > ANG_HISTORY_FRAMES) this.angHistory.shift();
    let rollingMax = 0;
    for (const v of this.angHistory) if (v > rollingMax) rollingMax = v;
    this.values.maxAngVel = rollingMax;

    if (this.placementCentroid) {
      const c = this._stackCentroid();
      const dx = c.x - this.placementCentroid.x;
      const dz = c.z - this.placementCentroid.z;
      this.values.centroidDrift = Math.hypot(dx, dz);
    } else {
      this.values.centroidDrift = 0;
    }
  }
}
