/* Flat illustrated cast for the explainer scenes (no 3D, no glitches). viewBox 0 0 200 220. */
import React from 'react';

export type AvatarId = 'danny' | 'danny_hivis' | 'kyle' | 'jordan' | 'mum' | 'leah' | 'tony' | 'regular' | 'kid' | 'lad1' | 'lad2' | 'lad3' | 'dad';
export type Mood = 'neutral' | 'smile' | 'grin' | 'sad' | 'angry' | 'worried' | 'o' | 'blank';

type Look = {skin: string; hair: string; style: 'bowl' | 'beanie' | 'short' | 'curly' | 'bob' | 'bald' | 'crop'; top: string; vest?: boolean; glasses?: boolean; apron?: boolean; brow?: string};
export const LOOKS: Record<AvatarId, Look> = {
  danny: {skin: '#f0c19c', hair: '#3a2a22', style: 'bowl', top: '#26304a'},
  danny_hivis: {skin: '#f0c19c', hair: '#3a2a22', style: 'bowl', top: '#2a3142', vest: true},
  kyle: {skin: '#eebd96', hair: '#2b2622', style: 'short', top: '#2e3a2c', vest: true},
  jordan: {skin: '#8f5634', hair: '#4b4f57', style: 'beanie', top: '#454a53', brow: '#2a1a12'},
  mum: {skin: '#f3cdb2', hair: '#d8d4cd', style: 'curly', top: '#9c5a78'},
  leah: {skin: '#f2c8a6', hair: '#8a4a2a', style: 'bob', top: '#e4d4ba'},
  tony: {skin: '#f2d0b6', hair: '#f4f4f2', style: 'bald', top: '#8b9098', glasses: true, apron: true},
  regular: {skin: '#efc9ad', hair: '#efefef', style: 'crop', top: '#8a6a50'},
  kid: {skin: '#efbf98', hair: '#6b4a2e', style: 'bowl', top: '#3d63b0'},
  lad1: {skin: '#eebb94', hair: '#5a3a22', style: 'crop', top: '#b0413e'},
  lad2: {skin: '#c98d62', hair: '#1f1a17', style: 'short', top: '#4a7a4a'},
  lad3: {skin: '#f1c6a2', hair: '#b9622d', style: 'crop', top: '#3a5f9a'},
  dad: {skin: '#eab995', hair: '#4a3628', style: 'short', top: '#5c6470'},
};

const shade = (hex: string, k: number) => {
  const n = parseInt(hex.slice(1), 16); const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  const f = (c: number) => Math.max(0, Math.min(255, Math.round(c * k)));
  return `rgb(${f(r)},${f(g)},${f(b)})`;
};

export const Avatar: React.FC<{id: AvatarId; mood?: Mood; blink?: boolean; talk?: number; size?: number; ring?: string}> = ({id, mood = 'neutral', blink = false, talk = 0, size = 300, ring}) => {
  const L = LOOKS[id]; const sk = L.skin; const dk = shade(sk, 0.82);
  const brow = L.brow ?? '#2a1d17';
  const bt = mood === 'angry' ? 9 : mood === 'worried' || mood === 'sad' ? -9 : 0; // inner brow tilt
  const eyeRy = blink ? 1 : 7.5;
  const mouth = (() => {
    if (talk > 0.5) return <ellipse cx={100} cy={124} rx={10} ry={7} fill="#5a2020" />;
    switch (mood) {
      case 'smile': return <path d="M86 119 Q100 132 114 119" stroke="#5a2020" strokeWidth={4.5} fill="none" strokeLinecap="round" />;
      case 'grin': return <path d="M84 117 Q100 138 116 117 Z" fill="#fff" stroke="#5a2020" strokeWidth={3.5} strokeLinejoin="round" />;
      case 'sad': return <path d="M88 127 Q100 117 112 127" stroke="#5a2020" strokeWidth={4.5} fill="none" strokeLinecap="round" />;
      case 'o': return <ellipse cx={100} cy={124} rx={6} ry={8} fill="#5a2020" />;
      case 'angry': return <path d="M89 125 L111 123" stroke="#5a2020" strokeWidth={4.5} strokeLinecap="round" />;
      default: return <path d="M90 123 L110 123" stroke="#5a2020" strokeWidth={4} strokeLinecap="round" />;
    }
  })();
  const hair = (() => {
    const h = L.hair; const hl = shade(h, 1.35);
    switch (L.style) {
      case 'bowl': return <g><path d="M41 96 Q36 26 100 24 Q164 26 159 96 L157 80 Q132 64 100 64 Q68 64 43 80 Z" fill={h} /><path d="M62 40 Q90 28 120 34" stroke={hl} strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.5} /></g>;
      case 'beanie': return <g><path d="M38 100 Q34 22 100 20 Q166 22 162 100 Z" fill={h} /><rect x={37} y={80} width={126} height={20} rx={8} fill={shade(h, 0.82)} /><path d="M60 40 Q92 26 124 34" stroke={hl} strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.4} /></g>;
      case 'short': return <g><path d="M45 84 Q46 30 100 28 Q154 30 155 84 Q130 58 100 58 Q70 58 45 84 Z" fill={h} /></g>;
      case 'crop': return <g><path d="M46 78 Q52 34 100 32 Q148 34 154 78 Q128 52 100 54 Q72 52 46 78 Z" fill={h} /></g>;
      case 'curly': return <g fill={h}>{[48, 64, 82, 100, 118, 136, 152].map((x, i) => <circle key={i} cx={x} cy={i % 2 ? 44 : 52} r={17} />)}<circle cx={46} cy={74} r={13} /><circle cx={154} cy={74} r={13} /></g>;
      case 'bob': return <g><path d="M36 128 Q30 26 100 24 Q170 26 164 128 L146 128 Q150 70 100 62 Q50 70 54 128 Z" fill={h} /></g>;
      case 'bald': return <g fill={h}><ellipse cx={47} cy={84} rx={11} ry={20} /><ellipse cx={153} cy={84} rx={11} ry={20} /></g>;
    }
  })();
  return (
    <svg width={size} height={size * 1.1} viewBox="0 0 200 220" style={{overflow: 'visible'}}>
      {ring && <circle cx={100} cy={100} r={98} fill="none" stroke={ring} strokeWidth={4} opacity={0.9} />}
      {/* body */}
      <path d="M26 222 Q28 150 100 146 Q172 150 174 222 Z" fill={L.top} />
      {L.vest && <g><path d="M48 222 L56 160 Q76 150 84 152 L88 222 Z M152 222 L144 160 Q124 150 116 152 L112 222 Z" fill="#dfe34a" /><rect x={46} y={188} width={44} height={9} fill="#c9ccd1" /><rect x={110} y={188} width={44} height={9} fill="#c9ccd1" /></g>}
      {L.apron && <path d="M66 222 L70 162 Q100 154 130 162 L134 222 Z" fill="#f3f1ec" />}
      {/* ears */}
      <circle cx={45} cy={98} r={11} fill={sk} /><circle cx={155} cy={98} r={11} fill={sk} />
      {/* head */}
      <circle cx={100} cy={94} r={56} fill={sk} />
      <ellipse cx={100} cy={120} rx={46} ry={22} fill={dk} opacity={0.18} />
      {hair}
      {/* brows */}
      <g stroke={brow} strokeWidth={6} strokeLinecap="round">
        <line x1={70} y1={80 - bt * 0.15} x2={90} y2={80 + bt * 0.35} />
        <line x1={130} y1={80 - bt * 0.15} x2={110} y2={80 + bt * 0.35} />
      </g>
      {/* eyes */}
      <ellipse cx={81} cy={97} rx={5.5} ry={eyeRy} fill="#14110f" /><ellipse cx={119} cy={97} rx={5.5} ry={eyeRy} fill="#14110f" />
      {!blink && <g fill="#fff"><circle cx={83} cy={94} r={1.8} /><circle cx={121} cy={94} r={1.8} /></g>}
      {L.glasses && <g fill="none" stroke="#2b2b2b" strokeWidth={3.5}><circle cx={81} cy={97} r={13} /><circle cx={119} cy={97} r={13} /><line x1={94} y1={97} x2={106} y2={97} /></g>}
      {/* nose + cheeks */}
      <ellipse cx={100} cy={109} rx={7} ry={6} fill={dk} />
      <ellipse cx={72} cy={113} rx={8} ry={5} fill="#e8857a" opacity={0.22} /><ellipse cx={128} cy={113} rx={8} ry={5} fill="#e8857a" opacity={0.22} />
      {mouth}
    </svg>
  );
};
