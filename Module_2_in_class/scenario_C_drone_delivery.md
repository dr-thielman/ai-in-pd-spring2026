# Client Intake Request — Meridian Logistics

**From:** Alex Chen, Director of Autonomous Systems, Meridian Logistics
**To:** Your engineering team
**Date:** April 14, 2026
**Subject:** Gen-3 Delivery Drone — Antenna Integration & Airframe Packaging

We're designing our Gen-3 autonomous delivery drone for urban operations
under the FAA's expanded Part 135 BVLOS waiver framework. The current
platform uses a redundant C2 link architecture (LTE primary, 900 MHz mesh
secondary) but we're experiencing unacceptable handoff latency (>200 ms)
during building-canyon transitions in downtown corridors.

We need mechanical and systems engineering support for integrating a
phased-array antenna system into the airframe without exceeding our 22 kg
MTOW or compromising the cargo bay volume (0.028 m³ minimum for standard
parcel dimensions).

The antenna integration affects CG location, so we'll need updated W&B
analysis. The current CG envelope is certified at 22–26% MAC.

Additionally, we need to meet DAA (Detect and Avoid) requirements for our
operational volume. The DAA system uses:
- ADS-B In receiver (978 MHz UAT and 1090 MHz ES)
- Radar altimeter (4.2–4.4 GHz)
- Forward-facing solid-state lidar (905 nm, 200m range)

All sensors need mounting provisions that don't create electromagnetic
interference with the C2 links. Our EMC testing on Gen-2 showed coupling
between the radar altimeter and the 900 MHz mesh radio at -62 dBm —
well above our -85 dBm threshold.

Timeline: PDR in 10 weeks. First flight test of Gen-3 targeted for Q4 2026.

Budget: $150K for mechanical/systems engineering through PDR.

— Alex Chen
Director, Autonomous Systems | Meridian Logistics | achen@meridianlogistics.com
