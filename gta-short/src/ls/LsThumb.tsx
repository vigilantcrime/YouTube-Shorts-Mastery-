/* Leonida Shifts — Ep.1 thumbnail (1280×720). Layout modelled on the viral "AVOID THIS IN CHAPTER X" series:
   giant purple→pink→orange numeral behind the protagonist, yellow kicker, huge white outlined headline.
   Content is this episode: the 99 Metascore (giant numeral) and the $1.84B launch estimate (price board).
   Own assets only: Jason cut out of our gameplay (GrabCut); no Rockstar logo or key art. */
import React from 'react';
import {AbsoluteFill, Img, continueRender, delayRender, staticFile} from 'remotion';

const useThumbFonts = () => {
  const [h] = React.useState(() => delayRender('thumb-fonts')); const [ok, setOk] = React.useState(false);
  React.useEffect(() => { Promise.all([['Anton', 'anton'], ['Road', 'road900']].map(([n, f]) => new FontFace(n, `url(${staticFile(`ls/fonts/${f}.woff2`)})`).load()))
    .then((fs) => { fs.forEach((x) => document.fonts.add(x)); setOk(true); continueRender(h); }); }, [h]);
  return ok;
};
/* outlined text as SVG (stroke painted under the fill) — clean edges, no layered-text artifacts */
let gid = 0;
const Outlined: React.FC<{text: string; size: number; fill: string; stroke: number; style?: React.CSSProperties; grad?: boolean; w?: number}> = ({text, size, fill, stroke, style, grad, w = 1280}) => {
  const [id] = React.useState(() => `g${gid++}`); const h = size * 1.04;
  return <svg width={w} height={h + 16} viewBox={`0 0 ${w} ${h + 16}`} style={{display: 'block', overflow: 'visible', filter: 'drop-shadow(0 14px 16px rgba(0,0,0,.5))', ...style}}>
    {grad && <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8a5cff" /><stop offset="0.52" stopColor="#ff4fb0" /><stop offset="1" stopColor="#ffa040" /></linearGradient></defs>}
    <text x={w / 2} y={h * 0.9 + 8} textAnchor="middle" fontFamily="Anton" fontSize={size} letterSpacing={size * 0.01} fill="#0d0716" stroke="#0d0716" strokeWidth={stroke * 2} strokeLinejoin="round" transform="translate(0 8)">{text}</text>
    <text x={w / 2} y={h * 0.9 + 8} textAnchor="middle" fontFamily="Anton" fontSize={size} letterSpacing={size * 0.01} fill={grad ? `url(#${id})` : fill} stroke="#0d0716" strokeWidth={stroke * 2} strokeLinejoin="round" paintOrder="stroke">{text}</text>
  </svg>;
};

export const LsThumb: React.FC = () => {
  const ok = useThumbFonts(); if (!ok) return <AbsoluteFill style={{background: '#000'}} />;
  return <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
    {/* bright Leonida street, punched up like a thumbnail */}
    <Img src={staticFile('ls/img/thumb_bg.png')} style={{position: 'absolute', left: -260, top: -60, width: 1560, height: 878, objectFit: 'cover', filter: 'saturate(1.45) contrast(1.1) brightness(1.06) blur(2.5px)'}} />
    <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(255,80,170,.30) 0%, rgba(255,140,60,.12) 38%, transparent 60%, rgba(10,4,20,.35) 100%)'}} />
    {/* giant gradient "99" (the Metascore) behind the hero, where the series puts its giant numeral */}
    <div style={{position: 'absolute', left: 250, top: -70}}>
      <Outlined text="99" size={700} stroke={14} grad fill="" w={1000} />
    </div>
    <div style={{position: 'absolute', left: 665, top: 18, padding: '4px 16px', background: '#0d0716', borderRadius: 8, fontFamily: 'Road', fontSize: 30, color: '#fff', letterSpacing: 3, transform: 'rotate(-3deg)'}}>METASCORE</div>
    {/* hero: Jason cut out of our gameplay */}
    <Img src={staticFile('ls/img/jason_cut.png')} style={{position: 'absolute', left: 60, top: 10, width: 470, WebkitMaskImage: 'linear-gradient(180deg, #000 0%, #000 44%, transparent 53%)', maskImage: 'linear-gradient(180deg, #000 0%, #000 44%, transparent 53%)', filter: 'saturate(1.15) contrast(1.08) drop-shadow(0 0 3px rgba(255,255,255,.9)) drop-shadow(0 18px 24px rgba(0,0,0,.6))'}} />
    {/* proof object: the launch-revenue estimate on a gas-station price board (the episode's own graphic language) */}
    <div style={{position: 'absolute', left: 905, top: 205, width: 350, borderRadius: 18, overflow: 'hidden', background: '#0b0b0e', border: '8px solid #0d0716', outline: '5px solid #f1f1f4',
      boxShadow: '0 22px 34px rgba(0,0,0,.6)', transform: 'rotate(6deg)'}}>
      <div style={{background: 'linear-gradient(100deg,#FF4FB0,#FF9A3C)', padding: '8px 18px', fontFamily: 'Road', fontSize: 28, color: '#fff', letterSpacing: 2}}>IN JUST 4 DAYS</div>
      <div style={{padding: '10px 18px 14px', fontFamily: 'Anton', fontSize: 108, color: '#FFB000', lineHeight: 1, textShadow: '0 0 22px #FFB000, 0 0 6px #FFB000'}}>$1.84B</div>
    </div>
    {/* kicker + headline */}
    <div style={{position: 'absolute', left: 0, right: 0, top: 452, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <Outlined text="GTA 6 JUST BROKE" size={92} stroke={9} fill="#FFD60A" />
      <Outlined text="EVERYTHING" size={176} stroke={12} fill="#ffffff" style={{marginTop: -30}} />
    </div>
  </AbsoluteFill>;
};
