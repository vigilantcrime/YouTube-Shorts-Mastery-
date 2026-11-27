/* Re-render of the clipper hand-over (7:16.92 and 14:07.60): real hands with fingers round the clippers,
   attached to arms and sleeves, Danny on the left, Jordan coming in from the right. */
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, Caption, Chair, Clippers, Finish, Hud, Rig, Shop, ShopLights, Stage, Tag, lerp, useFonts, V3} from './kit';
import {RealHand, FIST, RELAX, Curl} from './realHand';
const mixCurl = (a: Curl, b: Curl, t: number): Curl => ({thumb: a.thumb + (b.thumb - a.thumb) * t, index: a.index + (b.index - a.index) * t, middle: a.middle + (b.middle - a.middle) * t, ring: a.ring + (b.ring - a.ring) * t, pinky: a.pinky + (b.pinky - a.pinky) * t});

type Beat = {n: number; give: number; take: number; release: number};
const BEATS: Record<'G' | 'H', Beat> = {
  G: {n: 149, give: 0, take: 62, release: 96},
  H: {n: 177, give: 0, take: 80, release: 118},
};


const Scene: React.FC<{v: 'G' | 'H'}> = ({v}) => {
  const f = useCurrentFrame();
  const b = BEATS[v];
  const rc = 0.045;
  const cx = lerp(f, 0, b.take, -0.12, 0.02) + lerp(f, b.release, b.n, 0, 0.16);
  const cy = 0.76 + Math.sin(f / 9) * 0.003;
  const clip: V3 = [cx, cy, 0];
  // Danny: grips the back half, arm from the foreground; lets go after the release and pulls back
  const dOpen = lerp(f, b.release - 2, b.release + 10, 0, 1);
  const dBack = lerp(f, b.release + 4, b.n, 0, 1);
  const dCurl = mixCurl(FIST, RELAX, dOpen);
  const dC: V3 = [cx - 0.075 - dBack * 0.12, cy - dBack * 0.08, dBack * 0.16];
  // Jordan: reaches in from behind, closes on the front half at the take
  const jIn = lerp(f, b.take - 34, b.take, 0, 1);
  const jCurl = mixCurl(RELAX, FIST, lerp(f, b.take - 3, b.take + 9, 0, 1));
  const jC: V3 = [cx + 0.085 + (1 - jIn) * 0.2, cy + (1 - jIn) * 0.06, -(1 - jIn) * 0.3];
  const camX = lerp(f, 0, b.n, -0.12, 0.06);
  return (
    <Stage bg="#2c3034" exposure={1.12}>
      <Rig pos={[camX, 1.02, 0.78]} look={[camX * 0.4 + 0.02, 0.74, 0]} fov={40} />
      <ShopLights />
      <Shop />
      <Chair p={[0.9, 0, -0.7]} ry={-0.42} />
      <group position={clip}><Clippers r={rc} len={0.24} /></group>
      <RealHand side="right" skin={C.dannySkin} curl={dCurl}
        place={{mode: 'grip', center: dC, axis: [1, 0, 0], up: [0, 0.75, 0.66]}} arm={{elbow: [dC[0] - 0.12, dC[1] - 0.2, dC[2] + 0.3], shoulder: [dC[0] - 0.35, dC[1] + 0.1, dC[2] + 0.75], sleeve: C.dannySleeve}} />
      <RealHand side="right" skin={C.jordanSkin} curl={jCurl}
        place={{mode: 'grip', center: jC, axis: [-1, 0, 0], up: [0.1, 0.97, -0.22]}} arm={{elbow: [jC[0] + 0.12, jC[1] + 0.02, jC[2] - 0.36], shoulder: [jC[0] + 0.32, jC[1] + 0.28, jC[2] - 0.8], sleeve: C.jordanSleeve}} />
    </Stage>
  );
};

export const ShotClip: React.FC<{v: 'G' | 'H'}> = ({v}) => {
  useFonts();
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Scene v={v} />
      <Finish />
      {v === 'G' ? (
        <>
          <Hud pulls={2} />
          <Tag text="One slow Tuesday." from={-10} to={28} />
          <Caption text="A FADE. ON A MATE WHO VOLUNTEERED." from={78} to={200} />
        </>
      ) : (
        <>
          <Caption text="HE DIDN'T BEAT THEM BY GETTING AWAY." from={-10} to={90} />
          <Caption text="HE BEAT THEM THE DAY HE HANDED A 17-YEAR-OLD THE CLIPPERS." from={90} to={176} color="#f2b336" />
        </>
      )}
    </AbsoluteFill>
  );
};
