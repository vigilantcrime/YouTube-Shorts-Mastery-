import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Atmos, Card, Count, Flash, Hi, Icon, Obj, Pill, Ring, Small, Spot, Src, Stamp, Title, Big, commas, useFonts, useT, C, F, Conn} from './kit';
import {HUD, SceneDef, World, Bumper} from './world';
import {AlarmScreen, BarPair, Bubble, CalendarCard, Door10, EmptyDesk, EvidenceTag, LineSpike, PeopleGrid, Phone, Quote, Redact, Rota, UKMap, BigBar} from './parts';

const scenes: SceneDef[] = [
  {t0: 0, t1: 3, children: <>
    <Obj t0={0.1} x={960} y={300} from="zoom"><Title size={190}>Britain called in sick</Title></Obj>
    <Obj t0={0.5} x={560} y={560} from="left"><Pill text="Not a few people" v="dark" icon={<Icon n="person" size={44} />} strike={1} /></Obj>
    <Obj t0={0.8} x={1330} y={560} from="right"><Pill text="Not a cheeky Friday" v="red" icon={<Icon n="calendar" size={44} />} /></Obj>
    <Obj t0={1.0} x={620} y={800} from="up" rotY={-10}><Card w={620} label="Bright HR" tag="EXHIBIT 01"><Count t0={1.1} to={1000000} fmt={(v) => commas(v) + '+'} size={150} /><Small>WORKERS ON THEIR BOOKS</Small><div style={{marginTop: 14}}><Src text="Company data" /></div></Card></Obj>
    <Obj t0={1.3} x={1380} y={800} from="pop" rotY={9}><Stamp t0={1.4} text="Not a census" sub="COMPANY DATA ONLY" color={C.blueL} /></Obj>
    <Ring t0={1.6} x={560} y={560} w={560} h={150} />
  </>},
  {t0: 3, t1: 6, y: 80, children: <>
    <Obj t0={3.1} x={620} y={520} from="up" rotY={12}><UKMap w={720} h={820} t0={3.1} center={'Wales'} span={560} pins={[{at: 'Manchester', label: 'KIERAN', t: 3.6}, {at: 'Wales', label: 'WALES', t: 4.0, col: 'blue', side: 'l'}, {at: 'St Albans', label: 'SAM', t: 4.4, side: 'r'}]} routes={[{from: 'Manchester', to: 'Wales', t0: 4.1, t1: 5.0}]} dots={{t0: 3.2, n: 160, dur: 1.5}} /></Obj>
    <Obj t0={3.3} x={1290} y={540} from="right" rotY={-8}><Phone w={340}><AlarmScreen t0={3.4} /></Phone></Obj>
    <Obj t0={4.3} x={1560} y={840} from="up"><Bubble text="I'm not going in." /></Obj>
  </>},
  {t0: 6, t1: 9, children: <>
    <Obj t0={6.1} x={460} y={520} from="up" rotY={10}><Card w={640} h={560} label="Sickness absence"><BarPair t0={6.2} w={570} h={470} a={{label: 'WEEK BEFORE', v: 100}} b={{label: 'THURSDAY', v: 156}} max={170} delta="+56%" /></Card></Obj>
    <Obj t0={6.3} x={1180} y={420} from="pop"><PeopleGrid t0={6.4} hot={7} size={96} /></Obj>
    <Obj t0={6.5} x={1250} y={800} from="up"><LineSpike t0={6.6} w={640} h={220} /></Obj>
    <Obj t0={6.2} x={1660} y={430} from="right" rotY={-10} scale={0.62}><CalendarCard t0={6.3} /></Obj>
  </>},
  {t0: 9, t1: 12, children: <>
    <Obj t0={9.1} x={330} y={520} from="left" rotY={14}><Door10 w={300} /></Obj>
    <Obj t0={9.2} x={760} y={380} from="up"><EvidenceTag item="ITEM 01" icon="bed" label="A travel lodge" sub="ROOM 114" /></Obj>
    <Obj t0={9.4} x={760} y={700} from="up"><EvidenceTag item="ITEM 02" icon="stick" label="A fire stick" red /></Obj>
    <Obj t0={9.6} x={1380} y={340} from="right" rotY={-9}><Quote w={720} who="TOLD THE BBC">Why am I playing a game I have <Hi t0={9.8}>years to enjoy?</Hi></Quote></Obj>
    <Obj t0={9.7} x={1400} y={640} from="up"><BigBar t0={9.8} dur={2} w={760} label="DOWNLOADING… 212 GB" /></Obj>
    <Obj t0={9.8} x={1620} y={900} from="up" scale={0.7}><Rota t0={9.9} w={620} /></Obj>
    <Obj t0={9.5} x={430} y={880} from="pop" scale={0.55}><EmptyDesk /></Obj>
  </>},
];
export const VcGallery: React.FC = () => {
  const ok = useFonts(); const t = useT(); if (!ok) return <AbsoluteFill style={{background: '#000'}} />;
  return <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
    <World scenes={scenes} />
    <Bumper t0={1.6} n="01" title="The numbers" sub="WHAT THE DATA COULD SEE" />
    <Atmos t={t} />
    <HUD chapters={[{t: 1.6, n: '01', name: 'THE NUMBERS'}]} end={12} caseId="CASE VC-LF-001" />
  </AbsoluteFill>;
};
