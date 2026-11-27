/* Line icons that draw themselves on (stroke-dashoffset). viewBox 0 0 100 100. */
import React from 'react';

export type IconName = 'clippers' | 'chair' | 'mug' | 'tin' | 'shop' | 'letter' | 'till' | 'phone' | 'star' | 'broom' | 'car' | 'car_scratch' |
  'cctv' | 'cash' | 'box' | 'meal' | 'house' | 'clock' | 'mirror';

const INK = '#f3efe6', YEL = '#f2b336', RED = '#e4472c';

export const Icon: React.FC<{name: IconName; size?: number; draw?: number; color?: string; accent?: string; t?: number}> = ({name, size = 300, draw = 1, color = INK, accent = YEL, t = 0}) => {
  const st = {fill: 'none', stroke: color, strokeWidth: 4, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
  const P: React.FC<{d: string; c?: string; w?: number; fill?: string}> = ({d, c, w, fill}) => (
    <path d={d} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} {...st} stroke={c ?? color} strokeWidth={w ?? 4} fill={fill ?? 'none'} />
  );
  const fillOp = Math.max(0, Math.min(1, (draw - 0.6) / 0.4));
  const body = (() => {
    switch (name) {
      case 'clippers': return <g transform="rotate(-24 50 50)">
        <rect x={34} y={22} width={32} height={62} rx={12} fill={accent} opacity={0.16 * fillOp} />
        <P d="M46 22 h8 q12 0 12 12 v38 q0 12 -12 12 h-8 q-12 0 -12 -12 v-38 q0 -12 12 -12 z" />
        <P d="M32 22 h36 M35 14 v8 M42 14 v8 M49 14 v8 M56 14 v8 M63 14 v8" c={accent} />
        <circle cx={50} cy={48} r={3.2} fill="#34e39a" opacity={fillOp} />
        <P d="M50 84 q0 10 -10 12 q-14 2 -14 -6" w={3} /></g>;
      case 'chair': return <g>
        <P d="M30 18 h40 v34 h-40 z" /><P d="M24 52 h52 v10 h-52 z" c={accent} />
        <P d="M24 52 v-10 M76 52 v-10" /><P d="M50 62 v18 M34 86 h32 M38 80 h24" /><P d="M70 62 l12 10" w={3} /></g>;
      case 'mug': return <g>
        <P d="M28 36 h38 v34 q0 14 -14 14 h-10 q-14 0 -14 -14 z" /><P d="M66 44 q16 0 16 12 q0 12 -16 12" />
        <P d="M40 26 q-4 -6 0 -12 q4 -6 0 -12 M52 26 q-4 -6 0 -12 q4 -6 0 -12" c={accent} w={3} /></g>;
      case 'tin': return <g>
        <P d="M22 40 q28 -12 56 0 v34 q-28 12 -56 0 z" /><P d="M22 40 q28 12 56 0" />
        <P d="M34 36 l6 -20 h22 l4 18" c={accent} /><P d="M44 22 h14" c={accent} w={3} /></g>;
      case 'shop': return <g>
        <P d="M18 40 v44 h64 v-44" /><P d="M14 40 h72 l-6 -16 h-60 z" c={accent} />
        <P d="M24 40 q4 8 8 0 q4 8 8 0 q4 8 8 0 q4 8 8 0 q4 8 8 0 q4 8 8 0 q4 8 8 0" w={3} />
        <P d="M28 52 h22 v32 h-22 z M58 52 h18 v16 h-18 z" /></g>;
      case 'letter': return <g>
        <P d="M24 14 h40 l14 14 v58 h-54 z" /><P d="M64 14 v14 h14" />
        <P d="M32 38 h36 M32 48 h36 M32 58 h28 M32 68 h32" w={3} c={accent} /></g>;
      case 'till': return <g>
        <P d="M20 54 h60 v28 h-60 z" /><P d="M28 54 l6 -26 h32 l6 26" /><P d="M38 36 h24" c={accent} />
        <P d="M30 64 h8 M44 64 h8 M58 64 h8 M30 72 h36" w={3} /></g>;
      case 'phone': return <g>
        <P d="M34 10 h32 q8 0 8 8 v64 q0 8 -8 8 h-32 q-8 0 -8 -8 v-64 q0 -8 8 -8 z" /><P d="M44 17 h12" w={4} c={accent} />
        <rect x={30} y={24} width={40} height={56} rx={3} fill={accent} opacity={0.16 * fillOp} /></g>;
      case 'star': return <g><P d="M50 12 l11 24 26 3 -19 18 5 26 -23 -13 -23 13 5 -26 -19 -18 26 -3 z" c={accent} fill={accent} /></g>;
      case 'broom': return <g><P d="M66 12 l-26 52" /><P d="M28 60 l22 10 l-10 22 q-14 -2 -24 -14 z" c={accent} /><P d="M24 80 l8 -6 M30 86 l8 -8 M36 90 l6 -10" w={3} /></g>;
      case 'car': case 'car_scratch': return <g>
        <P d="M10 66 v-12 q0 -6 6 -8 l14 -4 l12 -14 q4 -4 10 -4 h18 q6 0 9 5 l9 17 q6 2 6 8 v12 z" />
        <P d="M44 30 l-8 12 h22 v-14 M62 28 v14 h14 l-7 -14" w={3} />
        <circle cx={28} cy={68} r={9} fill="#0c0f15" stroke={color} strokeWidth={4} /><circle cx={72} cy={68} r={9} fill="#0c0f15" stroke={color} strokeWidth={4} />
        {name === 'car_scratch' && <path d="M14 52 l10 2 l8 -3 l10 3 l9 -2 l10 3 l9 -3 l10 2 l8 -1" pathLength={1} strokeDasharray={1}
          strokeDashoffset={1 - Math.max(0, Math.min(1, t))} fill="none" stroke={RED} strokeWidth={3} strokeLinecap="round" />}</g>;
      case 'cctv': return <g>
        <P d="M18 34 l44 -12 l6 16 l-44 12 z" /><P d="M40 46 l4 14 h-18 M26 60 v24" />
        <P d="M20 18 L84 86 M84 18 L20 86" c={RED} w={6} /></g>;
      case 'cash': return <g>
        <P d="M12 30 h76 v42 h-76 z" c={accent} /><circle cx={50} cy={51} r={13} fill="none" stroke={color} strokeWidth={4} opacity={draw} />
        <text x={50} y={60} textAnchor="middle" fontSize={24} fontWeight={800} fill={color} opacity={fillOp} fontFamily="BigShoulders">£</text></g>;
      case 'box': return <g>
        <P d="M16 34 l34 -14 l34 14 v38 l-34 14 l-34 -14 z" /><P d="M16 34 l34 14 l34 -14 M50 48 v38" />
        <P d="M33 27 l34 14" c={accent} w={5} /></g>;
      case 'meal': return <g>
        <P d="M14 70 l26 -46 l26 46 z" /><P d="M22 62 h36" c={accent} w={3} /><P d="M70 34 h16 v50 h-16 z" /><P d="M70 44 h16" c={accent} w={3} /></g>;
      case 'house': return <g><P d="M18 48 l32 -28 l32 28" /><P d="M26 42 v42 h48 v-42" /><P d="M44 84 v-20 h12 v20" c={accent} /></g>;
      case 'clock': return <g><circle cx={50} cy={50} r={36} fill="none" stroke={color} strokeWidth={4} opacity={draw} /><P d="M50 26 v24 l16 10" c={accent} w={5} /></g>;
      case 'mirror': return <g><ellipse cx={50} cy={46} rx={26} ry={34} fill="none" stroke={color} strokeWidth={4} opacity={draw} /><P d="M38 34 l12 -8 M36 46 l20 -14" c={accent} w={3} /><P d="M50 80 v10 M38 92 h24" /></g>;
    }
  })();
  return <svg width={size} height={size} viewBox="0 0 100 100" style={{overflow: 'visible'}}>{body}</svg>;
};
