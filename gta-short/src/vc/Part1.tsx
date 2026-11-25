/* VC long-form — Part 1 (254 s): "Britain called in sick". One continuous canvas, pop-ups anchored to the voiceover. */
import React from 'react';
import {AbsoluteFill, Audio, staticFile} from 'remotion';
import {Atmos, useFonts, useT} from './kit';
import {Bumper, HUD, SceneDef, World} from './world';
import {scenesA} from './P1a';
import {scenesB} from './P1b';
import {A, P} from './anchors';

export const P1_VO = 254.12, P1_TAIL = 0.9, FULL_END = 352;
const defs = [...scenesA, ...scenesB];
export const scenes1: SceneDef[] = defs.map((d, i) => ({...d, t1: i + 1 < defs.length ? defs[i + 1].t0 : P1_VO + P1_TAIL}));
export const bumps1 = [
  {t: P(A('first i need') + 0.1, 'bump'), n: '01', title: 'The numbers', sub: 'WHAT THE DATA COULD SEE'},
  {t: P(A("because here's") + 0.1, 'bump'), n: '02', title: 'The people', sub: 'WHO ACTUALLY STAYED HOME'},
  {t: P(A("and if you didn't") + 0.1, 'bump'), n: '03', title: 'The build-up', sub: 'HOW BRITAIN GOT READY'},
  {t: P(A('if you ask me') - 0.2, 'bump'), n: '04', title: 'The verdict', sub: 'WHAT IT REALLY MEANT'},
];
export const chapters1 = bumps1.map((b) => ({t: b.t, n: b.n, name: b.title.toUpperCase()}));

export const VcPart1: React.FC = () => {
  const ok = useFonts(); const t = useT();
  if (!ok) return <AbsoluteFill style={{background: '#000'}} />;
  return <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
    <World scenes={scenes1} />
    {bumps1.map((b) => <Bumper key={b.n} t0={b.t} n={b.n} title={b.title} sub={b.sub} />)}
    <Atmos t={t} />
    <HUD chapters={chapters1} end={FULL_END} caseId="CASE VC-LF-001" />
    <Audio src={staticFile('vc2/mix1.wav')} />
  </AbsoluteFill>;
};
