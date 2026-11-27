/* Re-render of 5:43.32: Danny runs his finger along the key scratch on the car door.
   The original showed a lone finger capsule with no hand; this one has the whole hand and sleeve. */
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import * as THREE from 'three';
import {Finish, Hud, Rig, Rod, Stage, lerp, useFonts, V3} from './kit';
import {DANNY} from './ShotPhone';
import {RealHand, POINT} from './realHand';

const N = 69;
const SKIN = DANNY.skin;

/* hand with the index finger pointing along local +X, palm facing the panel (local -Z), fingertip at the origin */
const PointHand: React.FC = () => {
  const fr = 0.03; const m = <meshStandardMaterial color={SKIN} roughness={0.42} />;
  return (
    <group>
      <Rod a={[-0.17, 0.0, 0.035]} b={[-0.085, 0.0, 0.02]} r0={fr * 1.02} color={SKIN} rough={0.42} />
      <Rod a={[-0.085, 0.0, 0.02]} b={[-fr * 0.6, 0.0, fr * 0.65]} r0={fr} r1={fr * 0.95} color={SKIN} rough={0.42} />
      {/* palm / back of hand */}
      <mesh position={[-0.25, -0.03, 0.07]} rotation={[0, 0.25, 0.08]} scale={[0.1, 0.085, 0.052]} castShadow><sphereGeometry args={[1, 40, 28]} />{m}</mesh>
      {/* curled fingers */}
      {[0, 1, 2].map((i) => (
        <group key={i}>
          <Rod a={[-0.2, -0.055 - i * 0.04, 0.06]} b={[-0.13, -0.06 - i * 0.04, 0.03]} r0={fr} color={SKIN} rough={0.42} />
          <Rod a={[-0.13, -0.06 - i * 0.04, 0.03]} b={[-0.15, -0.065 - i * 0.04, 0.095]} r0={fr} r1={fr * 0.92} color={SKIN} rough={0.42} />
        </group>
      ))}
      {/* thumb tucked along the side */}
      <Rod a={[-0.27, 0.05, 0.09]} b={[-0.18, 0.05, 0.1]} r0={fr * 1.15} color={SKIN} rough={0.42} />
    </group>
  );
};

export const ShotFinger: React.FC = () => {
  useFonts();
  const f = useCurrentFrame();
  // scratch line across the door, direction in panel plane
  const a: V3 = [-3.2, 0.62, 0], b: V3 = [3.6, -0.58, 0];
  const dir = new THREE.Vector3(b[0] - a[0], b[1] - a[1], 0).normalize();
  const ang = Math.atan2(dir.y, dir.x);
  const t = lerp(f, 0, N, 0.44, 0.53);
  const tip: V3 = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, 0.012];
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const wrist = new THREE.Vector3(...tip).add(new THREE.Vector3(-0.34 * Math.cos(ang), -0.34 * Math.sin(ang) - 0.04, 0.16));
  const elbow = new THREE.Vector3(...tip).add(new THREE.Vector3(-0.95 * Math.cos(ang), -0.95 * Math.sin(ang) - 0.25, 0.75));
  const cam: V3 = [tip[0] - 0.42, tip[1] + 0.3, lerp(f, 0, N, 1.05, 0.82)];
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Stage bg="#0d0e10" exposure={1.0}>
        <Rig pos={cam} look={[tip[0] + 0.08, tip[1] - 0.05, 0]} fov={40} />
        <hemisphereLight args={['#d8dde6', '#101114', 0.5]} />
        <directionalLight position={[-2, 3, 3]} intensity={1.4} color="#f3f1ec" castShadow shadow-mapSize={[2048, 2048]} shadow-bias={-0.0004} />
        <directionalLight position={[3, 1, 2]} intensity={0.5} color="#bcd0ff" />
        {/* car door: glossy black panel with a soft sheen gradient */}
        <mesh position={[0, -0.2, -0.002]} receiveShadow>
          <planeGeometry args={[8, 4]} />
          <meshPhysicalMaterial color="#2b2c30" roughness={0.42} metalness={0.25} clearcoat={0.6} clearcoatRoughness={0.3} />
        </mesh>
        {/* the scratch */}
        <mesh position={[(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, 0.003]} rotation={[0, 0, ang]}>
          <boxGeometry args={[len, 0.03, 0.004]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1.6} />
        </mesh>
        <mesh position={[(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, 0.0025]} rotation={[0, 0, ang]}>
          <boxGeometry args={[len, 0.07, 0.001]} />
          <meshStandardMaterial color="#9a9a9a" emissive="#ffffff" emissiveIntensity={0.25} transparent opacity={0.35} />
        </mesh>
        {/* real hand tracing the scratch with the index finger */}
        <RealHand skin={SKIN} curl={POINT} scale={1.25}
          place={{mode: 'point', tip: tip, dir: [Math.cos(ang) * 0.9, Math.sin(ang) * 0.9, -0.42], up: [-Math.sin(ang) * 0.3, Math.cos(ang) * 0.3, 1]}}
          arm={{elbow: [tip[0] - 0.55 * Math.cos(ang), tip[1] - 0.55 * Math.sin(ang) - 0.15, 0.42], shoulder: [tip[0] - 1.1 * Math.cos(ang), tip[1] - 0.2, 1.2], sleeve: DANNY.top, r: 0.056}} />
      </Stage>
      <Finish />
      <Hud pulls={2} />
    </AbsoluteFill>
  );
};
