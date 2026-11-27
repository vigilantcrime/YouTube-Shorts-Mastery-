/* Anatomical rigged hand (WebXR generic-hand mesh, MIT, Amazon 2019) posed per frame.
   Grip mode places the hand so the closed fingers wrap a bar (centre, axis, back-of-hand direction);
   point mode puts the index fingertip on a target. */
import React, {useEffect, useMemo, useState} from 'react';
import {continueRender, delayRender, staticFile} from 'remotion';
import * as THREE from 'three';
import {GLTFLoader, GLTF} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {clone as skClone} from 'three/examples/jsm/utils/SkeletonUtils.js';
import {Rod, V3} from './kit';

const cache: Partial<Record<'left' | 'right', Promise<GLTF>>> = {};
const useHandGltf = (side: 'left' | 'right') => {
  const [g, setG] = useState<GLTF | null>(null);
  const [h] = useState(() => delayRender('hand-' + side));
  useEffect(() => {
    (cache[side] ??= new GLTFLoader().loadAsync(staticFile(`hands/${side}.glb`))).then((x) => { setG(x); continueRender(h); });
  }, [side, h]);
  return g;
};

export type Curl = {thumb: number; index: number; middle: number; ring: number; pinky: number};
const FINGERS = ['index', 'middle', 'ring', 'pinky'] as const;
const MAX = [1.5, 1.75, 1.05]; // proximal, intermediate, distal flexion (rad) at curl 1
export const FIST: Curl = {thumb: 0.85, index: 0.78, middle: 0.8, ring: 0.82, pinky: 0.84};
export const POINT: Curl = {thumb: 0.7, index: 0.04, middle: 0.95, ring: 1.0, pinky: 1.0};
export const RELAX: Curl = {thumb: 0.25, index: 0.25, middle: 0.3, ring: 0.35, pinky: 0.4};

type Grip = {mode: 'grip'; center: V3; axis: V3; up: V3; flat?: boolean};
type Point = {mode: 'point'; tip: V3; dir: V3; up: V3};

const basis = (x: THREE.Vector3, y: THREE.Vector3) => {
  const X = x.clone().normalize(); const Y = y.clone().sub(X.clone().multiplyScalar(y.dot(X))).normalize(); const Z = X.clone().cross(Y);
  return new THREE.Matrix4().makeBasis(X, Y, Z);
};

export const RealHand: React.FC<{side?: 'left' | 'right'; skin: string; curl: Curl; place: Grip | Point; scale?: number; flexAxis?: V3;
  arm?: {elbow: V3; shoulder?: V3; sleeve: string; r?: number}}> = ({side = 'right', skin, curl, place, scale = 1.15, flexAxis = [1, 0, 0], arm}) => {
  const g = useHandGltf(side);
  const obj = useMemo(() => {
    if (!g) return null;
    const o = skClone(g.scene) as THREE.Object3D;
    const mat = new THREE.MeshStandardMaterial({color: skin, roughness: 0.52, metalness: 0});
    o.traverse((c) => { const m = c as THREE.SkinnedMesh; if (m.isMesh) { m.material = mat; m.castShadow = true; m.receiveShadow = true; m.frustumCulled = false; } });
    const rest: Record<string, {q: THREE.Quaternion; p: THREE.Vector3}> = {};
    o.traverse((c) => { if (c.name) rest[c.name] = {q: c.quaternion.clone(), p: c.position.clone()}; });
    return {o, rest};
  }, [g, skin]);
  if (!obj) return null;
  const {o, rest} = obj;
  const get = (n: string) => o.getObjectByName(n)!;
  // rest pose: reset bones, read joint positions in hand space
  Object.entries(rest).forEach(([n, r0]) => { const b = o.getObjectByName(n); if (b && b !== o) { b.quaternion.copy(r0.q); b.position.copy(r0.p); } });
  o.position.set(0, 0, 0); o.quaternion.identity(); o.scale.setScalar(1); o.updateMatrixWorld(true);
  const inv = new THREE.Matrix4().copy(o.matrixWorld).invert();
  const P = (n: string) => new THREE.Vector3().setFromMatrixPosition(get(n).matrixWorld).applyMatrix4(inv);
  // joints are all direct children of the Armature, so forward kinematics is done by hand in Armature space
  const B = (n: string) => get(n) as THREE.Object3D;
  const bp = (n: string) => B(n).position.clone();
  const d = bp('middle-finger-tip').sub(bp('wrist')).normalize();
  const acr = bp('pinky-finger-phalanx-proximal').sub(bp('index-finger-phalanx-proximal')).normalize();
  const palmA = (side === 'right' ? d.clone().cross(acr) : acr.clone().cross(d)).normalize();
  const chain = (names: string[], angles: number[], nrm: THREE.Vector3) => {
    for (let k = 0; k < angles.length; k++) {
      if (!angles[k]) continue;
      const pivot = bp(names[k]);
      const seg = bp(names[k + 1]).sub(pivot).normalize();
      const axis = seg.clone().cross(nrm).normalize();
      const R = new THREE.Quaternion().setFromAxisAngle(axis, angles[k]);
      for (let m = k; m < names.length; m++) {
        const b = B(names[m]);
        if (m > k) b.position.copy(b.position.clone().sub(pivot).applyQuaternion(R).add(pivot));
        b.quaternion.premultiply(R);
      }
    }
  };
  FINGERS.forEach((f) => {
    const k = curl[f]; const pre = `${f}-finger-`;
    chain([pre + 'phalanx-proximal', pre + 'phalanx-intermediate', pre + 'phalanx-distal', pre + 'tip'], [MAX[0] * k, MAX[1] * k, MAX[2] * k], palmA);
  });
  const tn = palmA.clone().add(acr.clone().multiplyScalar(0.8)).normalize();
  chain(['thumb-metacarpal', 'thumb-phalanx-proximal', 'thumb-phalanx-distal', 'thumb-tip'], [0.5 * curl.thumb, 0.55 * curl.thumb, 0.75 * curl.thumb], tn);
  o.updateMatrixWorld(true);
  const arm2o = new THREE.Matrix4().copy(inv).multiply(B('wrist').parent!.matrixWorld);
  const palm = palmA.clone().transformDirection(arm2o).normalize();
  o.updateMatrixWorld(true);

  let local: THREE.Matrix4, origin: THREE.Vector3, target: THREE.Matrix4, tpos: THREE.Vector3;
  if (place.mode === 'grip') {
    const prox = FINGERS.map((f) => P(`${f}-finger-phalanx-proximal`));
    const dist = FINGERS.map((f) => P(`${f}-finger-phalanx-distal`));
    const C = new THREE.Vector3(); prox.forEach((p, i) => C.add(p).add(dist[i])); C.multiplyScalar(1 / 8);
    const knuck = new THREE.Vector3(); prox.forEach((p) => knuck.add(p)); knuck.multiplyScalar(1 / 4);
    const A = prox[3].clone().sub(prox[0]);
    local = basis(A, place.flat ? palm.clone().negate() : palm.clone().negate().add(knuck.clone().sub(C).normalize()).normalize()); origin = C;
    target = basis(new THREE.Vector3(...place.axis), new THREE.Vector3(...place.up)); tpos = new THREE.Vector3(...place.center);
  } else {
    const tip = P('index-finger-tip'); const base = P('index-finger-phalanx-proximal');
    const dir = tip.clone().sub(base);
    local = basis(dir, palm.clone().negate()); origin = tip;
    target = basis(new THREE.Vector3(...place.dir), new THREE.Vector3(...place.up)); tpos = new THREE.Vector3(...place.tip);
  }
  const R = target.clone().multiply(local.clone().transpose());
  const q = new THREE.Quaternion().setFromRotationMatrix(R);
  const pos = tpos.clone().sub(origin.clone().multiplyScalar(scale).applyQuaternion(q));
  const wrist = P('wrist').multiplyScalar(scale).applyQuaternion(q).add(pos);
  const r = arm?.r ?? 0.05;
  let armEl: React.ReactNode = null;
  if (arm) {
    const w = wrist.clone();
    const fore = P('wrist').sub(P('middle-finger-metacarpal')).normalize().applyQuaternion(q);
    const e0 = new THREE.Vector3(...arm.elbow);
    const e = w.clone().add(fore.multiplyScalar(0.26).lerp(e0.clone().sub(w).normalize().multiplyScalar(0.26), 0.35));
    arm = {...arm, elbow: e.toArray() as V3};
    const cuff = w.clone().add(e.clone().sub(w).normalize().multiplyScalar(0.06));
    armEl = (
      <group>
        <Rod a={w.clone().add(e.clone().sub(w).normalize().multiplyScalar(-0.012)).toArray() as V3} b={cuff.toArray() as V3} r0={0.026 * scale} r1={0.028 * scale} color={skin} rough={0.52} caps={false} />
        {arm.sleeve === 'none' ? <Rod a={cuff.toArray() as V3} b={w.clone().add(e.clone().sub(w).normalize().multiplyScalar(0.12)).toArray() as V3} r0={0.028 * scale} r1={0.03 * scale} color={skin} rough={0.52} caps={false} /> : <>
        <Rod a={cuff.toArray() as V3} b={arm.elbow} r0={r} r1={r * 1.12} color={arm.sleeve} rough={0.65} caps={false} />
        <mesh position={arm.elbow}><sphereGeometry args={[r * 1.12, 32, 24]} /><meshStandardMaterial color={arm.sleeve} roughness={0.65} /></mesh></>}
        {arm.shoulder && arm.sleeve !== 'none' && <Rod a={arm.elbow} b={arm.shoulder} r0={r * 1.12} r1={r * 1.2} color={arm.sleeve} rough={0.65} />}
      </group>
    );
  }
  return <group><group position={pos} quaternion={q} scale={scale}><primitive object={o} /></group>{armEl}</group>;
};

