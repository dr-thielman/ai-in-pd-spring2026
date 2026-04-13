# Client Intake Request — CardioGuard Medical

**From:** Dr. Sarah Okonkwo, VP of Product Development, CardioGuard Medical
**To:** Your engineering team
**Date:** April 14, 2026
**Subject:** NextGen AED Enclosure & Mechanical Systems Redesign

We're developing a next-generation automated external defibrillator that
incorporates a real-time ML algorithm for rhythm classification to improve
shock/no-shock decision sensitivity beyond current IEC 60601-2-4
requirements (our target: >99.5% sensitivity for shockable rhythms vs.
the standard's 90%).

The algorithm runs on an edge inference processor (NVIDIA Jetson Orin NX)
integrated into the device. We need mechanical engineering support for the
enclosure redesign to accommodate:

- New processor board (70 × 45 × 30 mm, with thermal dissipation
  requirements of 15W TDP under inference load)
- Additional battery capacity (targeting 300 shocks vs. current 200 —
  requires upgrading from 2S2P to 3S2P LiPo configuration)
- Enhanced electrode connector system (current bayonet lock has a 12%
  field failure rate for incorrect seating by bystanders)

The device must maintain:
- IP55 rating per IEC 60529
- 1.22m drop test survival per IEC 60068-2-31 (6 faces, 3 edges, 3 corners)
- Electromagnetic compatibility per IEC 60601-1-2 (the Jetson's switching
  regulators are a known EMI source — our preliminary scans show
  exceedances at 150–300 MHz)

We're also adding haptic feedback actuators (LRA type, 10mm diameter) to
guide CPR compression depth and rate. These need to be felt through gloved
hands (fire/EMS personnel) and must not introduce conducted noise into the
ECG signal acquisition path (baseline noise floor: 20 µV RMS).

Target weight: 2.3 kg (down from current 2.8 kg).
Target dimensions: 220 × 180 × 65 mm (current: 240 × 200 × 75 mm).

Timeline: Design verification testing begins Q1 2027. We need mechanical
design freeze by Q3 2026.

Budget: $200K for mechanical engineering services through DVT.

— Dr. Sarah Okonkwo
VP Product Development | CardioGuard Medical | sokonkwo@cardioguard.com
