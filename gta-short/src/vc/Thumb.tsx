/* VC long-form thumbnail (1280×720): police-light split, alarm phone, giant hot title, 56% badge. All original vector art. */
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Atmos, C, F, Icon, Pill, Stage, Title, useFonts} from './kit';
import {AlarmScreen, Phone, UKMap} from './parts';

export const VcThumb: React.FC = () => {
  const ok = useFonts(); if (!ok) return <AbsoluteFill style={{background: '#000'}} />;
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
