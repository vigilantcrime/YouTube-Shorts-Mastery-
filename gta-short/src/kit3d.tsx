/* Shared 3D helpers (three.js via @remotion/three). */
import React, {useMemo} from 'react';
import {interpolate, Easing, continueRender, delayRender, staticFile} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import * as THREE from 'three';
import {W, H} from './kit';

export const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const io = Easing.inOut(Easing.cubic);
export const lerp = (fr: number, a: number, b: number, x: number, y: number, e = io) => interpolate(fr, [a, b], [x, y], {...cl, easing: e});
export const rnd = (i: number) => { const x = Math.sin(i * 12.9898) * 43758.5453; return x - Math.floor(x); };
export const pop = (lf: number, frames = 8, from = 0.5) => ({
  s: interpolate(lf, [0, frames], [from, 1], {...cl, easing: Easing.out(Easing.back(2.2))}),
  o: interpolate(lf, [0, 4], [0, 1], cl),
});

export const useFontsReady = (id: string) => {
  const [handle] = React.useState(() => delayRender('fonts-' + id));
  const [ready, setReady] = React.useState(false);
  React.useEffect(() => {
    const a = new FontFace('HeroBlack', `url(${staticFile('InterDisplay-Black.otf')})`);
    const b = new FontFace('UIBold', `url(${staticFile('Inter-Bold.otf')})`);
    Promise.all([a.load(), b.load()]).then(([x, y]) => { document.fonts.add(x); document.fonts.add(y); setReady(true); });
  }, []);
  React.useEffect(() => { if (ready) continueRender(handle); }, [ready, handle]);
  return ready;
};

export const useTex = (key: string, w: number, h: number, draw: (g: CanvasRenderingContext2D, w: number, h: number) => void) =>
  useMemo(() => {
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const g = c.getContext('2d')!; draw(g, w, h);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

export const Rig: React.FC<{pos: number[]; look: number[]; fov?: number; up?: number[]}> = ({pos, look, fov, up = [0, 1, 0]}) => {
  const {camera} = useThree();
  camera.position.set(pos[0], pos[1], pos[2]);
  camera.up.set(up[0], up[1], up[2]);
  camera.lookAt(look[0], look[1], look[2]);
  const pc = camera as THREE.PerspectiveCamera;
  if (fov) pc.fov = fov;
  pc.near = 0.01; pc.far = 400; pc.updateProjectionMatrix();
  return null;
};

export const Stage: React.FC<{children: React.ReactNode; bg: string; fog?: [string, number, number]}> = ({children, bg, fog}) => (
  <ThreeCanvas width={W} height={H} camera={{fov: 50, position: [0, 0, 5]}} gl={{antialias: true}}>
    <color attach="background" args={[bg]} />
    {fog && <fog attach="fog" args={fog} />}
    {children}
  </ThreeCanvas>
);
