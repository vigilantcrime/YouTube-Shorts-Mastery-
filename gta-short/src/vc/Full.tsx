/* VC long-form — the joined cut: Part 1 (254 s) + Part 2 (98 s). */
import React from 'react';
import {AbsoluteFill, Audio, staticFile} from 'remotion';
import {Atmos, useFonts, useT, ramp} from './kit';
import {Bumper, HUD, SceneDef, World} from './world';
import {scenesA} from './P1a';
import {scenesB} from './P1b';
import {scenes2} from './P2';
import {bumps1, FULL_END} from './Part1';
import {A2, D2, P, P2_VO, FULL_TAIL} from './anchors';

export const FULL_DUR = D2 + P2_VO + FULL_TAIL;
const defs = [...scenesA, ...scenesB, ...scenes2];
export const scenesFull: SceneDef[] = defs.map((d, i) => ({...d, t1: i + 1 < defs.length ? defs[i + 1].t0 : FULL_DUR}));
export const bumps2 = [
  {t: P(D2 + 0.45, 'bump'), n: '05', title: 'The schools', sub: 'WHAT HAPPENED IN CLASS'},
  {t: P(A2('going to give') + 0.1, 'bump'), n: '06', title: 'My read', sub: 'THIS IS MY OPINION'},
];
export const bumpsFull = [...bumps1, ...bumps2];
export const chaptersFull = bumpsFull.map((b) => ({t: b.t, n: b.n, name: b.title.toUpperCase()}));

export const VcFull: React.FC = () => {
  const ok = useFonts(); const t = useT();
  if (!ok) return <AbsoluteFill style={{background: '#000'}} />;
  const fade = ramp(t, D2 + P2_VO + 0.25, D2 + P2_VO + 1.05);
  return <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
    <World scenes={scenesFull} />
    {bumpsFull.map((b) => <Bumper key={b.n} t0={b.t} n={b.n} title={b.title} sub={b.sub} />)}
    <Atmos t={t} />
    <HUD chapters={chaptersFull} end={FULL_END} caseId="CASE VC-LF-001" />
    <AbsoluteFill style={{background: '#000', opacity: fade, pointerEvents: 'none'}} />
    <Audio src={staticFile('vc2/mixfull.wav')} />
  </AbsoluteFill>;
};
