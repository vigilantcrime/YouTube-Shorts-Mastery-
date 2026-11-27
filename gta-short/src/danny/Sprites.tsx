/* Hand sprite atlas for replacing the cracked ball hands: frame = pose*16 + side*8 + angle (45 deg steps).
   Transparent background, fixed scene lighting (key from upper left), wrist pointing along the arm direction. */
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import * as THREE from 'three';
import {Rig, V3} from './kit';
import {RealHand, FIST, RELAX, Curl} from './realHand';

const POSES: {curl: Curl; view: 'back' | 'side'}[] = [
  {curl: FIST, view: 'back'}, {curl: FIST, view: 'side'}, {curl: RELAX, view: 'side'}, {curl: RELAX, view: 'back'},
];
export const SPRITE_N = POSES.length * 16;

export const Sprites: React.FC = () => {
  const f = useCurrentFrame();
  const pose = POSES[Math.floor(f / 16)]; const side = Math.floor(f / 8) % 2 === 0 ? 'right' : 'left'; const k = f % 8;
  const rot = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), (k * Math.PI) / 4);
  const R = (v: V3) => new THREE.Vector3(...v).applyQuaternion(rot).toArray() as V3;
  const sx = side === 'right' ? 1 : -1;
  // arm hangs "down" in the image at k = 0, sprite rotates in 45 degree steps (counter-clockwise)
  const place = pose.view === 'back'
    ? {mode: 'grip' as const, center: [0, 0, 0] as V3, axis: R([sx, 0, 0]), up: R([0, 0, 1])}
    : {mode: 'grip' as const, center: [0, 0, 0] as V3, axis: R([0, 0, -1]), up: R([sx, 0, 0.25])};
  return (
    <AbsoluteFill>
      <ThreeCanvas width={512} height={512} gl={{antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, outputColorSpace: THREE.SRGBColorSpace}}>
        <Rig pos={[0, 0, 1.2]} look={[0, 0, 0]} fov={20} />
        <hemisphereLight args={['#fff4e6', '#4a4440', 1.1]} />
        <ambientLight intensity={0.3} />
        <directionalLight position={[-1.5, 2, 2.2]} intensity={2.0} color="#fff3e4" />
        <directionalLight position={[1.5, -0.5, 1]} intensity={0.45} color="#e4ecff" />
        <RealHand side={side} skin="#e2ae86" curl={pose.curl} scale={1.15} place={place}
          arm={{elbow: R([0, -0.4, 0]), sleeve: 'none'}} />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
