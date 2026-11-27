/* 2D overlays for the 2:45.84 "THE REVIEWS" shot, matched to the original: left scrim + chapter title,
   PULL N°1 stamp, and the review-app phone sliding in from the right. */
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {cl} from './kit';

export const ChapterTitle: React.FC<{num: string; title: string; from: number; to: number}> = ({num, title, from, to}) => {
  const f = useCurrentFrame();
  const o = Math.min(interpolate(f, [from, from + 4], [0, 1], cl), interpolate(f, [to - 4, to], [1, 0], cl));
  const blur = interpolate(f, [from, from + 4], [10, 0], cl);
  if (o <= 0) return null;
  return (
    <AbsoluteFill style={{opacity: o}}>
      <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(20,22,26,0.82) 0%, rgba(20,22,26,0.55) 38%, rgba(20,22,26,0) 70%)'}} />
      <div style={{position: 'absolute', left: 140, top: 646, fontFamily: 'PlexMonoBold', fontSize: 27, letterSpacing: '0.34em', color: '#e4472c'}}>{num}</div>
      <div style={{position: 'absolute', left: 140, top: 690, width: 900, height: 3, background: '#e4472c'}} />
      <div style={{position: 'absolute', left: 136, top: 700, fontFamily: 'BigShoulders', fontWeight: 800, fontSize: 160, lineHeight: 1, color: '#f3efe6', filter: `blur(${blur}px)`, whiteSpace: 'nowrap'}}>{title}</div>
    </AbsoluteFill>
  );
};

const PullIcon: React.FC<{size?: number}> = ({size = 34}) => (
  <svg width={size} height={size * 0.8} viewBox="0 0 22 18"><path d="M2 15 C6 8, 11 4, 20 3 C15 6, 13 8, 12 11 C9 9, 6 11, 2 15 Z" fill="#e8452c" /></svg>
);

export const Stamp: React.FC<{n: string; text: string; from: number; to: number}> = ({n, text, from, to}) => {
  const f = useCurrentFrame();
  const s = interpolate(f, [from, from + 6], [1.6, 1], {...cl, easing: Easing.out(Easing.back(1.6))});
  const o = Math.min(interpolate(f, [from, from + 3], [0, 1], cl), interpolate(f, [to - 3, to], [1, 0], cl));
  if (o <= 0) return null;
  return (
    <div style={{position: 'absolute', left: 110, top: 98, width: 452, height: 128, transform: `rotate(-3deg) scale(${s})`, transformOrigin: '50% 50%', opacity: o,
      border: '5px solid #e8452c', borderRadius: 12, background: 'rgba(58,58,60,0.82)', boxSizing: 'border-box'}}>
      <div style={{position: 'absolute', left: 38, top: 50}}><PullIcon /></div>
      <div style={{position: 'absolute', left: 104, top: 14, fontFamily: 'PlexMonoBold', fontSize: 21, letterSpacing: '0.32em', color: '#e8452c'}}>{n}</div>
      <div style={{position: 'absolute', left: 104, top: 42, fontFamily: 'BigShoulders', fontWeight: 800, fontSize: 66, lineHeight: 1, color: '#e8452c', whiteSpace: 'nowrap'}}>{text}</div>
    </div>
  );
};

const Star: React.FC<{on: boolean}> = ({on}) => (
  <svg width={21} height={21} viewBox="0 0 24 24" style={{marginRight: 2}}><path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 9.2l7.1-.6z" fill={on ? '#f2a81d' : '#cfd3da'} /></svg>
);

const Card: React.FC<{name: string; text: string; appear: number}> = ({name, text, appear}) => {
  const f = useCurrentFrame();
  const k = interpolate(f, [appear, appear + 7], [0, 1], {...cl, easing: Easing.out(Easing.cubic)});
  if (k <= 0) return null;
  return (
    <div style={{position: 'relative', margin: '0 0 14px 0', height: 146, borderRadius: 16, background: '#fdeee9', boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
      opacity: k, transform: `translateY(${(1 - k) * 18}px) scale(${0.96 + 0.04 * k})`, fontFamily: 'InterUI'}}>
      <div style={{position: 'absolute', left: 18, top: 30, width: 38, height: 38, borderRadius: 19, background: '#c9ccd2'}} />
      <div style={{position: 'absolute', left: 68, top: 20, fontSize: 19, fontWeight: 700, color: '#15161a', fontFamily: 'InterBold'}}>{name}</div>
      <div style={{position: 'absolute', left: 68, top: 47, fontSize: 14, color: '#80848c'}}>0 reviews · no photo</div>
      <div style={{position: 'absolute', left: 18, top: 77, display: 'flex', alignItems: 'center'}}>
        <Star on /><Star on={false} /><Star on={false} /><Star on={false} /><Star on={false} />
        <span style={{fontSize: 14, color: '#80848c', marginLeft: 8}}>2 days ago</span>
      </div>
      <div style={{position: 'absolute', left: 18, top: 106, fontSize: 19.5, color: '#202228', fontWeight: 500, fontFamily: 'InterMed'}}>{text}</div>
    </div>
  );
};

export const ReviewsPhone: React.FC<{inAt: number; cards: {name: string; text: string; at: number}[]}> = ({inAt, cards}) => {
  const f = useCurrentFrame();
  const k = interpolate(f, [inAt, inAt + 9], [0, 1], {...cl, easing: Easing.out(Easing.cubic)});
  if (k <= 0) return null;
  return (
    <div style={{position: 'absolute', opacity: k, left: 1300 + (1 - k) * 60, top: 88, width: 474, height: 916, transform: 'rotate(-2.6deg)', transformOrigin: '50% 0%',
      borderRadius: 62, background: '#0e0f12', boxShadow: '0 30px 70px rgba(0,0,0,0.45)'}}>
      <div style={{position: 'absolute', left: 11, top: 11, right: 11, bottom: 11, borderRadius: 52, background: '#f1f3f6', overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: '50%', top: 18, width: 96, height: 30, marginLeft: -48, borderRadius: 15, background: '#0b0b0d'}} />
        <div style={{position: 'absolute', left: 22, top: 90, fontFamily: 'InterBold', fontSize: 27, color: '#121317'}}>Danny&apos;s Barbers</div>
        <div style={{position: 'absolute', left: 22, top: 126, fontFamily: 'InterUI', fontSize: 18, color: '#5e626a'}}>Barber shop · High St</div>
        <div style={{position: 'absolute', left: 14, right: 14, top: 168}}>
          {cards.map((c) => <Card key={c.name} name={c.name} text={c.text} appear={c.at} />)}
        </div>
      </div>
    </div>
  );
};
