/* VC long-form thumbnail (1280×720): police-light split, alarm phone, giant hot title, 56% badge. All original vector art. */
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Atmos, C, F, Icon, Pill, Stage, Title, useFonts} from './kit';
import {AlarmScreen, Phone, UKMap} from './parts';

export const VcThumb: React.FC<{v?: 'A' | 'B' | 'C'}> = ({v = 'A'}) => {
  const ok = useFonts(); if (!ok) return <AbsoluteFill style={{background: '#000'}} />;
  if (v === 'B') return <ThumbB />;
  if (v === 'C') return <ThumbC />;
  return <AbsoluteFill style={{background: '#050B1A', overflow: 'hidden'}}>
    <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: 'scale(0.6667)', transformOrigin: '0 0'}}>
      <Stage cx={960} cy={540} t={2.0} />
    </div>
    <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(100deg, rgba(47,123,255,0.30) 0%, rgba(5,11,26,0) 42%, rgba(255,46,74,0.34) 100%)'}} />
    {/* UK map, red-flooded, behind the title */}
    <div style={{position: 'absolute', left: 640, top: 70, width: 700, height: 700, opacity: 0.42, transform: 'rotate(6deg)'}}><UKMap w={700} h={700} t0={-5} center={[-3.0, 54.0]} span={1250} flood={{t0: -5, dur: 0.1}} /></div>
    {/* alarm phone */}
    <div style={{position: 'absolute', left: 78, top: 92, transform: 'rotate(-9deg) scale(0.86)', transformOrigin: '0 0'}}><Phone w={330}><AlarmScreen t0={-9} /></Phone></div>
    {/* title */}
    <div style={{position: 'absolute', left: 470, top: 60, width: 780, textAlign: 'center'}}>
      <Title size={196} hot style={{lineHeight: 0.96}}>Britain</Title>
      <Title size={196} hot style={{lineHeight: 0.96}}>called in</Title>
      <Title size={222} style={{lineHeight: 0.96, marginTop: 6, marginLeft: -60}}>sick</Title>
    </div>
    {/* tags */}
    <div style={{position: 'absolute', left: 452, top: 22, display: 'flex', gap: 16}}>
      <Pill text="GTA 6 launch day" v="blue" size={26} icon={<Icon n="pad" size={34} />} />
    </div>
    <div style={{position: 'absolute', left: 1052, top: 502, width: 204, height: 204, borderRadius: '50%', background: 'radial-gradient(circle at 38% 32%, #FF5A6E, #A3122A)', border: '8px solid #fff', boxShadow: '0 0 70px rgba(255,46,74,0.85), 0 22px 40px rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transform: 'rotate(8deg)'}}>
      <div style={{fontFamily: F.display, fontSize: 70, lineHeight: 1, color: '#fff', textShadow: '0 5px 0 rgba(90,10,28,0.8)'}}>+56%</div>
      <div style={{fontFamily: F.hero, fontSize: 20, letterSpacing: 3, color: '#fff'}}>SICK DAYS</div></div>
    {/* brand */}
    <div style={{position: 'absolute', left: 36, top: 26, display: 'flex', alignItems: 'center', gap: 12}}>
      <div style={{width: 46, height: 46, borderRadius: 12, background: 'linear-gradient(135deg, #2F7BFF 0 50%, #FF2E4A 50% 100%)', border: '2.5px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Icon n="eye" size={30} sw={7} /></div>
      <div style={{fontFamily: F.hero, fontSize: 27, letterSpacing: 3.5, color: '#fff'}}>VIGILANT <span style={{color: C.red}}>CRIME</span></div></div>
    <Atmos t={2.0} />
  </AbsoluteFill>;
};

const Brand: React.FC = () => <div style={{position: 'absolute', left: 36, top: 26, display: 'flex', alignItems: 'center', gap: 12}}>
  <div style={{width: 46, height: 46, borderRadius: 12, background: 'linear-gradient(135deg, #2F7BFF 0 50%, #FF2E4A 50% 100%)', border: '2.5px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Icon n="eye" size={30} sw={7} /></div>
  <div style={{fontFamily: F.hero, fontSize: 27, letterSpacing: 3.5, color: '#fff'}}>VIGILANT <span style={{color: C.red}}>CRIME</span></div></div>;

const Back: React.FC<{wash?: string}> = ({wash}) => <>
  <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: 'scale(0.6667)', transformOrigin: '0 0'}}><Stage cx={960} cy={540} t={2.0} /></div>
  <div style={{position: 'absolute', inset: 0, background: wash ?? 'linear-gradient(100deg, rgba(47,123,255,0.30) 0%, rgba(5,11,26,0) 42%, rgba(255,46,74,0.34) 100%)'}} /></>;

/* B: number first. One giant figure, the map flooded red behind it. */
const ThumbB: React.FC = () => <AbsoluteFill style={{background: '#050B1A', overflow: 'hidden'}}>
  <Back wash="linear-gradient(110deg, rgba(5,11,26,0.15) 0%, rgba(5,11,26,0) 40%, rgba(255,46,74,0.40) 100%)" />
  <div style={{position: 'absolute', left: 560, top: 10, width: 760, height: 760, opacity: 0.62, transform: 'rotate(5deg)'}}><UKMap w={760} h={760} t0={-5} center={[-3.0, 54.0]} span={1180} flood={{t0: -5, dur: 0.1}} /></div>
  <div style={{position: 'absolute', left: 452, top: 22}}><Pill text="GTA 6 launch day" v="blue" size={26} icon={<Icon n="pad" size={34} />} /></div>
  <div style={{position: 'absolute', left: 30, top: 118, width: 900, textAlign: 'left'}}>
    <Title size={470} hot style={{lineHeight: 0.92, textAlign: 'left'}}>+56%</Title>
  </div>
  <div style={{position: 'absolute', left: 44, top: 520, display: 'flex', alignItems: 'center', gap: 26}}>
    <Title size={176} style={{lineHeight: 0.96, textAlign: 'left'}}>sick days</Title>
    <div style={{width: 118, height: 118, borderRadius: '50%', background: 'radial-gradient(circle at 38% 32%, #FF5A6E, #A3122A)', border: '7px solid #fff', boxShadow: '0 0 50px rgba(255,46,74,0.85), 0 16px 30px rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Icon n="bell" size={66} sw={7} /></div>
  </div>
  <Brand /><Atmos t={2.0} /></AbsoluteFill>;

/* C: the human joke. A sick note with GTA 6 as the reason, "suddenly sick?" in the hot title. */
const ThumbC: React.FC = () => <AbsoluteFill style={{background: '#050B1A', overflow: 'hidden'}}>
  <Back wash="linear-gradient(100deg, rgba(47,123,255,0.34) 0%, rgba(5,11,26,0) 46%, rgba(255,46,74,0.30) 100%)" />
  <div style={{position: 'absolute', left: 452, top: 22}}><Pill text="GTA 6 launch day" v="blue" size={26} icon={<Icon n="pad" size={34} />} /></div>
  {/* paper */}
  <div style={{position: 'absolute', left: 52, top: 96, width: 560, height: 600, transform: 'rotate(-6deg)', background: 'linear-gradient(180deg, #FBF7EA, #EDE6D2)', borderRadius: 14, boxShadow: '0 30px 60px rgba(0,0,0,0.65), 0 0 0 4px rgba(255,255,255,0.9)', padding: '34px 40px', boxSizing: 'border-box'}}>
    <div style={{fontFamily: F.display, fontSize: 112, lineHeight: 1, color: '#0B1B3F', letterSpacing: 2}}>SICK NOTE</div>
    <div style={{height: 6, background: '#C8102E', margin: '12px 0 20px', borderRadius: 3}} />
    <div style={{fontFamily: F.mono, fontSize: 30, color: '#33405F', lineHeight: 1.45, letterSpacing: 1.5}}>EMPLOYEE:&nbsp;&nbsp;BRITAIN<br />DATE:&nbsp;&nbsp;THU 19 NOV<br />REASON:</div>
    <div style={{position: 'relative', marginTop: 10, marginLeft: 26, display: 'inline-block'}}>
      <div style={{fontFamily: F.display, fontSize: 160, lineHeight: 1.02, color: '#D01232', letterSpacing: 3}}>GTA 6</div>
      <div style={{position: 'absolute', left: -34, right: -34, top: -8, bottom: -2, border: '9px solid #1B2A5A', borderRadius: '50%', transform: 'rotate(-3deg)'}} />
    </div>
    <div style={{position: 'absolute', right: 18, bottom: 20, transform: 'rotate(8deg)', border: '8px solid #1A7A3C', color: '#1A7A3C', padding: '0 18px', borderRadius: 12, fontFamily: F.hero, fontSize: 50, letterSpacing: 4, opacity: 0.92}}>APPROVED</div>
  </div>
  {/* title */}
  <div style={{position: 'absolute', left: 616, top: 132, width: 640, textAlign: 'center'}}>
    <Title size={156} hot style={{lineHeight: 0.96}}>suddenly</Title>
    <Title size={262} style={{lineHeight: 0.96, marginTop: 6}}>sick?</Title>
  </div>
  <div style={{position: 'absolute', left: 612, top: 590, width: 640, display: 'flex', justifyContent: 'center', gap: 18}}>
    <div style={{width: 88, height: 88, borderRadius: '50%', background: 'rgba(8,18,44,0.9)', border: '4px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 30px rgba(255,46,74,0.6)'}}><Icon n="thermo" size={54} color={C.red} sw={7} /></div>
    <Pill text="+56% sick days" v="red" size={34} /></div>
  <Brand /><Atmos t={2.0} /></AbsoluteFill>;
