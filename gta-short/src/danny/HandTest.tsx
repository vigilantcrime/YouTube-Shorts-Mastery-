import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, Clippers, Rig, Shop, ShopLights, Stage} from './kit';
import {RealHand, FIST, POINT} from './realHand';
import {Phone} from './char';
const View: React.FC<{cam: [number, number, number]; children: React.ReactNode}> = ({cam, children}) => (
  <div style={{position: 'absolute', inset: 0}}>
    <Stage exposure={1.1}>
      <Rig pos={cam} look={[0, 0.74, 0]} fov={30} />
      <ShopLights />
      <Shop />
      {children}
    </Stage>
  </div>
);
export const HandTest: React.FC<{k?: number}> = ({k = 0}) => (
  <AbsoluteFill style={{background: '#000'}}>
    <View cam={k === 0 ? [0.05, 0.85, 0.55] : k === 1 ? [0.55, 0.8, 0.05] : k === 3 ? [-0.25, 0.85, 0.45] : [0.05, 0.95, 0.5]}>
      {k === 3 ? <>
        <group position={[0, 0.74, 0]} rotation={[-0.2, 0.5, 0]}><group scale={1.25}><Phone /></group></group>
        <RealHand skin={C.dannySkin} curl={{thumb: 0.1, index: 0.2, middle: 0.22, ring: 0.25, pinky: 0.28}}
          place={{mode: 'grip', center: new (require('three').Vector3)(0.0, -0.025, -0.024).applyEuler(new (require('three').Euler)(-0.2, 0.5, 0)).add(new (require('three').Vector3)(0, 0.74, 0)).toArray(),
            axis: new (require('three').Vector3)(0, -1, 0).applyEuler(new (require('three').Euler)(-0.2, 0.5, 0)).toArray(),
            up: new (require('three').Vector3)(0, 0, -1).applyEuler(new (require('three').Euler)(-0.2, 0.5, 0)).toArray(), flat: true}} />
      </> : k < 2 ? <>
        <group position={[0, 0.74, 0]}><Clippers r={0.045} len={0.22} /></group>
        <RealHand skin={C.dannySkin} curl={FIST} place={{mode: 'grip', center: [-0.03, 0.74, 0], axis: [1, 0, 0], up: [0, 1, 0.3]}} />
      </> : <>
        <mesh position={[0, 0.7, 0]}><boxGeometry args={[0.4, 0.02, 0.3]} /><meshStandardMaterial color="#333" /></mesh>
        <RealHand skin={C.dannySkin} curl={POINT} place={{mode: 'point', tip: [0.05, 0.712, 0.0], dir: [1, -0.45, 0], up: [0, 1, 0]}} />
      </>}
    </View>
  </AbsoluteFill>
);
