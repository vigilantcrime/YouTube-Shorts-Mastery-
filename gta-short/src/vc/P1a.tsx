/* VC long-form Part 1 — scenes 0-17 (hook → "permission"). Every pop-up is anchored to its spoken word via A('phrase'). */
import React from 'react';
import {Card, Count, F, Hi, Icon, Obj, Pill, Shock, Small, Src, Stamp, Big, C, commas, ramp, useT} from './kit';
import {AlarmScreen, BarPair, Bubble, CalendarCard, Door10, EmptyDesk, EvidenceTag, PeopleGrid, Phone, Rota, UKMap, BigBar} from './parts';
import {Arrow, Burst, Diary, DashRows, FitNote, LeaveForm, Lens, Paper, Portal, SPill, StruckTitle, SubBtn, TF, Vanish, Rise, Checklist, TodoCard, CallScreen} from './parts2';
import {Conn} from './kit';
import {A, P, cue} from './anchors';
import type {SceneDef} from './world';

export type SD = Omit<SceneDef, 't1'>;
const ic = (n: string, size = 46) => <Icon n={n} size={size} />;
const Clock0: React.FC = () => { const t = useT(); return <div style={{fontFamily: F.mono, fontSize: 168, fontWeight: 700, letterSpacing: 6, textAlign: 'center', color: '#fff', textShadow: '0 0 40px rgba(47,123,255,0.8)', lineHeight: 1.1}}>00<span style={{opacity: Math.floor(t * 2) % 2 ? 0.2 : 1}}>:</span>00</div>; };
const hotNum = {textShadow: '0 10px 0 #5a0a1c, 0 0 90px rgba(255,46,74,0.7)', WebkitTextStroke: '6px #fff', paintOrder: 'stroke fill'} as React.CSSProperties;

export const scenesA: SD[] = [
  /* S0 — hook */
  {t0: 0, children: <>
    <Obj t0={P(0.15)} x={540} y={700} from="left" rotY={13} z={2}><CalendarCard t0={0.2} w={620} hot={19} /></Obj>
    <Obj t0={P(A('thursday', 0, 0.0))} x={540} y={392} from="down"><Pill text="Thursday 19 November" v="blue" icon={ic('calendar', 44)} /></Obj>
    <Obj t0={P(A('britain called', 0, -0.05), 'slam')} x={960} y={232} from="zoom" z={3}><TF text="Britain called in sick" size={176} max={1640} hot /></Obj>
    <Shock t0={A('britain called')} x={960} y={232} size={900} /><Burst t0={A('britain called')} peak={0.22} />
    <Obj t0={P(A('not a few'))} x={1330} y={500} from="right"><SPill t0={P(A('not a few') + 0.4, 'strike')} text="A few people" v="dark" icon={ic('person', 44)} /></Obj>
    <Obj t0={P(A('not a cheeky'))} x={1330} y={630} from="right"><SPill t0={P(A('not a cheeky') + 0.4, 'strike')} text="A cheeky Friday" v="dark" icon={ic('calendar', 44)} /></Obj>
    <Obj t0={P(A('not a few') + 0.35)} x={1330} y={835} from="pop"><PeopleGrid t0={A('not a few') + 0.35} hot={-1} cols={6} rows={3} size={84} lightAll={A('not a few') + 1.0} /></Obj>
  </>},
  /* S1 — alarm, the country, the telly, "I'm not going in" */
  {t0: A('the alarm went off'), y: 40, children: <>
    {cue(A('the alarm went off') + 0.15, 'alarm', 2.6)}
    <Obj t0={P(A('the alarm went off') + 0.1)} x={400} y={540} from="left" rotY={14} z={2}><Phone w={340}><AlarmScreen t0={A('the alarm went off') + 0.15} /></Phone></Obj>
    <Obj t0={P(A('half the country'))} x={1010} y={175} from="down"><Pill text="Half the country" v="red" icon={ic('group', 44)} /></Obj>
    <Obj t0={P(A('half the country') + 0.25)} x={1010} y={560} from="up" rotY={-10} z={2}><UKMap w={600} h={640} t0={A('half the country') + 0.2} center={[-3.2, 54.3]} span={1180} dots={{t0: A('half the country') + 0.4, n: 220, dur: 1.6}} /></Obj>
    <Obj t0={P(A('the telly'))} x={700} y={925} from="up"><Pill text="The telly" v="dark" icon={ic('tv', 44)} /></Obj>
    <Obj t0={P(A("i'm not going in"), 'slam')} x={1540} y={450} from="pop" rot={-3}><Bubble text="I'M NOT GOING IN." size={46} /></Obj>
    <Obj t0={A("i'm not going in") + 0.4} x={1540} y={545} from="up"><Src text="Dramatisation" /></Obj>
  </>},
  /* S2 — GTA VI unlocked at midnight */
  {t0: A('grand theft auto'), y: -50, children: <>
    <Obj t0={P(A('grand theft auto') + 0.25, 'slam')} x={960} y={285} from="zoom" z={3}><TF text="Grand Theft Auto VI" size={200} max={1560} hot /></Obj>
    <Obj t0={P(A('unlocked'))} x={960} y={500} from="pop"><Pill text="Unlocked at midnight" v="red" size={44} icon={ic('key', 60)} /></Obj>
    <Shock t0={A('unlocked')} x={960} y={500} size={800} /><Burst t0={A('unlocked')} peak={0.25} />
    <Obj t0={P(A('midnight') - 0.1)} x={960} y={770} from="up" rotX={-6}><Card w={560} label="Launch" tag="19 NOV" v="blue"><Clock0 /></Card></Obj>
    <Obj t0={P(A('unlocked') + 0.2)} x={470} y={700} from="left" rotY={14}><Icon n="lock" size={190} sw={5} color={C.blueL} /></Obj>
    <Obj t0={P(A('unlocked') + 0.3)} x={1450} y={700} from="right" rotY={-14}><Icon n="key" size={190} sw={5} color={C.redL} /></Obj>
  </>},
  /* S3 — thirteen years, two delays, schoolkids → mortgage holders */
  {t0: A('thirteen years'), y: 60, children: <>
    {cue(A('thirteen years'), 'tick', 0.9)}
    <Obj t0={P(A('thirteen years'), 'slam')} x={540} y={450} from="zoom" z={3}><Count t0={A('thirteen years')} dur={0.9} to={13} fmt={(v) => String(Math.round(v))} size={430} style={{textShadow: '0 10px 0 #0a1a3a, 0 0 90px rgba(47,123,255,0.85)', textAlign: 'center'}} /></Obj>
    <Obj t0={P(A('thirteen years') + 0.5)} x={540} y={710} from="up"><Pill text="Years" v="blue" size={44} icon={ic('hourglass', 58)} /></Obj>
    <Obj t0={P(A('thirteen years') + 0.7)} x={480} y={870} from="up"><BigBar t0={A('thirteen years') + 0.7} dur={2.2} w={560} label="THE WAIT" /></Obj>
    <Obj t0={P(A('two delays'), 'slam')} x={1280} y={390} from="none"><Stamp t0={A('two delays')} text="Delayed" sub="DELAY ONE" color={C.red} size={92} rot={-7} /></Obj>
    <Obj t0={P(A('two delays') + 0.7, 'slam')} x={1350} y={590} from="none"><Stamp t0={A('two delays') + 0.7} text="Delayed again" sub="DELAY TWO" color={C.red} size={80} rot={5} /></Obj>
    <Obj t0={P(A('schoolkids'))} x={1000} y={850} from="up"><Pill text="Schoolkid" v="dark" size={30} icon={ic('bag', 40)} /></Obj>
    <Obj t0={P(A('schoolkids') + 0.7)} x={1250} y={850} from="pop"><Arrow t0={A('schoolkids') + 0.7} len={110} color={C.red} /></Obj>
    <Obj t0={P(A('mortgage holders'))} x={1560} y={850} from="up"><Pill text="Mortgage holder" v="red" size={30} icon={ic('key', 40)} /></Obj>
  </>},
  /* S4 — something very British: they just didn't show up */
  {t0: A('something very british'), y: -30, children: <>
    <Obj t0={P(A('something very british') + 0.2, 'slam')} x={960} y={245} from="zoom" z={3}><TF text="Something very British" size={160} max={1500} /></Obj>
    <Obj t0={P(A('riot'))} x={560} y={470} from="left"><SPill t0={P(A('riot') + 0.3, 'strike')} text="Riot" v="dark" icon={ic('siren')} /></Obj>
    <Obj t0={P(A('camp outside'))} x={700} y={600} from="left"><SPill t0={P(A('camp outside') + 0.7, 'strike')} text="Camp outside the shops" v="dark" icon={ic('bag')} /></Obj>
    <Obj t0={P(A('they just'))} x={1180} y={880} from="up"><Pill text="They just didn't show up" v="red" icon={ic('door')} /></Obj>
    <Obj t0={P(A('show up') - 0.5)} x={1300} y={720} from="pop"><Vanish t0={A('show up') - 0.5} at={A('show up') + 0.1} n={7} size={92} /></Obj>
  </>},
  /* S4b — stay with me (subscribe ask) */
  {t0: A('stay with me'), y: 40, zoom: 0.98, children: <>
    <Obj t0={P(A('stay with me') + 0.1)} x={960} y={250} from="down"><Pill text="Stay with me" v="blue" size={52} icon={ic('eye', 72)} /></Obj>
    <Obj t0={P(A('stay with me') + 0.5)} x={960} y={530} from="up"><SubBtn t0={A('stay with me') + 0.5} click={P(A('only the opening') - 0.15, 'click')} /></Obj>
    <Obj t0={P(A('the sick days'))} x={960} y={790} from="up"><BigBar t0={A('the sick days')} dur={1.4} w={900} to={0.22} label="THE SICK DAYS" end={<Pill text="Only the opening" v="ghost" size={30} />} /></Obj>
    <Obj t0={A('stay with me') + 0.9} x={960} y={925} from="up"><Src text="Subscribe — the payoff is coming" /></Obj>
  </>},
  /* S5 — the teaser case file (travel lodge / fire stick / court) */
  {t0: A('the strange part'), children: <>
    <Obj t0={P(A('the strange part'))} x={960} y={225} from="down" z={3}><Pill text="The strange part comes later" v="red" size={42} icon={ic('warn', 58)} /></Obj>
    <Obj t0={P(A('a travel'))} x={460} y={575} from="up" rotY={-10}><EvidenceTag item="ITEM 01" icon="bed" label="A travel lodge" sub="DETAILS WITHHELD" w={440} /></Obj>
    <Obj t0={P(A('a fire stick'))} x={960} y={555} from="up"><EvidenceTag item="ITEM 02" icon="stick" label="A fire stick" sub="DETAILS WITHHELD" w={440} red /></Obj>
    <Obj t0={P(A('a man who'))} x={1460} y={575} from="up" rotY={10}><EvidenceTag item="ITEM 03" icon="scales" label="A man who walked out of court" sub="DETAILS WITHHELD" w={440} /></Obj>
    <Conn t0={A('a travel') + 0.1} x1={960} y1={262} x2={460} y2={470} sag={30} /><Conn t0={A('a fire stick') + 0.1} x1={960} y1={262} x2={960} y2={450} sag={0} /><Conn t0={A('a man who') + 0.1} x1={960} y1={262} x2={1460} y2={470} sag={30} />
    <Obj t0={P(A('the same week'))} x={720} y={900} from="up"><Pill text="The same week the country clocked off" v="dark" icon={ic('clock')} /></Obj>
    <Obj t0={P(A('i promise'), 'slam')} x={1560} y={880} from="none"><Stamp t0={A('i promise')} text="To be continued" sub="I PROMISE I'LL COME BACK TO THAT" size={52} color={C.blueL} rot={-5} /></Obj>
  </>},
  /* S6 — picture that Thursday (bumper 01 overlays the middle) */
  {t0: A('first i need'), y: -40, children: <>
    <Obj t0={P(A('picture that') - 0.1, 'slam')} x={960} y={215} from="zoom" z={3}><TF text="Picture that Thursday" size={140} max={1300} /></Obj>
    <Obj t0={P(A('that thursday') + 0.2)} x={470} y={885} from="up"><Pill text="Thursday" v="blue" icon={ic('calendar', 44)} /></Obj>
    <Obj t0={P(A('that thursday') + 0.5)} x={960} y={885} from="up"><Pill text="Morning" v="dark" icon={ic('sun', 44)} /></Obj>
    <Obj t0={P(A('that thursday') + 0.8)} x={1450} y={885} from="up"><Pill text="A nation" v="dark" icon={ic('group', 44)} /></Obj>
  </>},
  /* S7 — Bright HR: a million workers, seventy thousand firms */
  {t0: A('an h r company'), y: 50, children: <>
    {cue(A('more than a million') + 0.25, 'tick', 1.3)}{cue(A('seventy thousand') + 0.1, 'tick', 1.0)}
    <Obj t0={P(A('an h r company') + 0.2, 'slam')} x={960} y={215} from="zoom" z={3}><TF text="An HR company" size={120} max={1100} /></Obj>
    <Obj t0={P(A('bright h r'))} x={960} y={345} from="pop"><Pill text="Bright HR" v="blue" size={40} icon={ic('building', 56)} /></Obj>
    <Obj t0={P(A('more than a million'))} x={530} y={650} from="left" rotY={9} z={2}><Card w={700} h={390} label="Workers on its books" tag="EXHIBIT 01"><div style={{position: 'absolute', right: 34, bottom: 26, opacity: 0.22}}><Icon n="group" size={140} color={C.blueL} /></div><Count t0={A('more than a million') + 0.25} dur={1.3} to={1000000} fmt={(v) => commas(v) + '+'} size={118} /><Small size={30} style={{marginTop: 8}}>A MILLION-PLUS BRITISH WORKERS</Small><div style={{marginTop: 22}}><Src text="Company data" /></div></Card></Obj>
    <Obj t0={P(A('seventy thousand'))} x={1390} y={650} from="right" rotY={-9} z={2}><Card w={700} h={390} label="British firms" tag="EXHIBIT 02" v="red"><div style={{position: 'absolute', right: 34, bottom: 26, opacity: 0.22}}><Icon n="building" size={140} color={C.redL} /></div><Small mono size={26}>ABOUT</Small><Count t0={A('seventy thousand') + 0.1} dur={1.0} to={70000} fmt={(v) => commas(v)} size={190} /><Small size={30} style={{marginTop: 8}}>FIRMS USING ITS SOFTWARE</Small></Card></Obj>
  </>},
  /* S8 — +56% */
  {t0: A('on that morning'), y: -40, children: <>
    {cue(A('fifty six') - 0.1, 'tick', 1.2)}
    <Obj t0={P(A('sickness absence'))} x={520} y={590} from="left" rotY={10} z={2}><Card w={700} h={640} label="Sickness absence on their books"><BarPair t0={A('sickness absence') + 0.2} w={630} h={520} a={{label: 'WEEK BEFORE', v: 100, sub: 'INDEX'}} b={{label: 'THURSDAY', v: 156, sub: 'INDEX'}} max={170} delta="+56%" /></Card></Obj>
    <Obj t0={P(A('fifty six'), 'slam')} x={1390} y={450} from="zoom" z={3}><Count t0={A('fifty six') - 0.1} dur={1.2} to={56} fmt={(v) => '+' + Math.round(v) + '%'} size={340} color={C.red} style={hotNum} /></Obj>
    <Shock t0={A('fifty six', 1)} x={1390} y={450} size={900} /><Burst t0={A('fifty six', 1)} color="#ff6a7e" peak={0.2} />
    <Obj t0={P(A('on the week'))} x={1390} y={690} from="up"><Pill text="On the week before" v="dark" icon={ic('calendar', 44)} /></Obj>
    <Obj t0={P(A('on the week') + 0.4)} x={1390} y={820} from="up"><Src text="Company data · sickness absence" /></Obj>
  </>},
  /* S9 — +21% */
  {t0: A('another firm'), y: 60, children: <>
    {cue(A('twenty one percent') - 0.1, 'tick', 1.0)}
    <Obj t0={P(A('another firm'))} x={560} y={225} from="down"><Pill text="Another firm" v="blue" icon={ic('building', 48)} /></Obj>
    <Obj t0={P(A('twenty one percent'), 'slam')} x={560} y={540} from="zoom" z={3}><Count t0={A('twenty one percent') - 0.1} dur={1.0} to={21} fmt={(v) => '+' + Math.round(v) + '%'} size={340} style={{textShadow: '0 10px 0 #0a1a3a, 0 0 90px rgba(47,123,255,0.85)', WebkitTextStroke: '6px #fff', paintOrder: 'stroke fill', color: '#2F7BFF'}} /></Obj>
    <Obj t0={P(A('leave requests'))} x={1380} y={560} from="right" rotY={-9} z={2}><Card w={720} h={620} label="Leave requests"><BarPair t0={A('leave requests') + 0.2} w={650} h={500} a={{label: 'LAST YEAR', v: 100, sub: 'INDEX'}} b={{label: 'THIS THURSDAY', v: 121, sub: 'INDEX'}} max={140} delta="+21%" /></Card></Obj>
    <Obj t0={P(A('on the same thursday'))} x={560} y={800} from="up"><Pill text="Same Thursday, last year" v="dark" icon={ic('calendar', 44)} /></Obj>
  </>},
  /* S10 — not a census (magnifier on the companies' dashboard) */
  {t0: A("now that isn't"), y: -50, zoom: 1.02, children: <>
    <Obj t0={P(A("now that isn't"))} x={700} y={600} from="left" rotY={8} z={2}><Card w={900} h={600} label="What the companies could see" tag="DASHBOARD"><Lens w={832} h={470} from={[260, 160]} to={[560, 320]} t0={A("it's what those")} t1={A('could see') + 0.8} r={120} zoom={1.7}><DashRows t0={A("now that isn't") + 0.2} w={832} h={470} /></Lens></Card></Obj>
    <Obj t0={P(A('government census'), 'slam')} x={1480} y={390} from="none"><Stamp t0={A('government census')} text="Not a census" sub="COMPANY DATA ONLY" size={80} color={C.blueL} rot={-6} /></Obj>
    <Obj t0={P(A("it's what those"))} x={1480} y={640} from="right"><Pill text="What they could see" v="dark" icon={ic('search', 46)} /></Obj>
    <Obj t0={P(A('you and i both'))} x={1480} y={800} from="right"><Pill text="You and I both know" v="blue" icon={ic('eye', 46)} /></Obj>
  </>},
  /* S11 — a nation waiting thirteen years for a Thursday */
  {t0: A('it looks like'), y: 30, children: <>
    <Obj t0={P(A('it looks like') + 0.2)} x={960} y={160} from="down"><Pill text="What it looks like" v="ghost" size={30} icon={ic('eye', 40)} /></Obj>
    <Obj t0={P(A('a nation'), 'slam')} x={960} y={310} from="zoom" z={3}><TF text="A nation waiting" size={190} max={1500} /></Obj>
    <Obj t0={P(A('for a thursday'), 'slam')} x={960} y={520} from="zoom" z={3}><TF text="For a Thursday" size={190} max={1500} hot /></Obj>
    <Obj t0={P(A('thirteen years', 1))} x={540} y={780} from="left"><Pill text="13 years" v="blue" size={44} icon={ic('hourglass', 60)} /></Obj>
    <Obj t0={P(A('for a thursday') + 0.3)} x={1380} y={780} from="right"><Pill text="One day" v="red" size={44} icon={ic('calendar', 60)} /></Obj>
  </>},
  /* S12a — pre-launch poll: 2.8 million */
  {t0: A('a poll taken'), y: -30, children: <>
    {cue(A('two point eight') - 0.2, 'tick', 1.3)}
    <Obj t0={P(A('a poll taken'))} x={960} y={225} from="down"><Pill text="Pre-launch poll" v="blue" size={42} icon={ic('chat', 56)} /></Obj>
    <Obj t0={P(A('a poll taken') + 0.6)} x={960} y={520} from="up" rotX={-5} z={2}><Card w={1000} h={380} label="Around · surveyed before launch" tag="PROJECTED"><div style={{textAlign: 'center', paddingTop: 36}}><Count t0={A('two point eight') - 0.2} dur={1.3} to={2.8} fmt={(v) => v.toFixed(1) + ' MILLION'} size={170} /></div></Card></Obj>
    <Obj t0={P(A('uk adults'))} x={480} y={850} from="up"><Pill text="UK adults" v="dark" icon={ic('group')} /></Obj>
    <Obj t0={P(A('planned to play'))} x={930} y={850} from="up"><Pill text="Planned to play" v="blue" icon={ic('pad')} /></Obj>
    <Obj t0={P(A('day one'), 'slam')} x={1440} y={850} from="none"><Stamp t0={A('day one')} text="Day one" size={64} color={C.redL} rot={-5} /></Obj>
  </>},
  /* S12b — one in twenty */
  {t0: A('one in twenty'), y: 40, children: <>
    <Obj t0={P(A('one in twenty'))} x={540} y={580} from="left" rotY={10} z={2}><PeopleGrid t0={A('one in twenty')} hot={7} cols={5} rows={4} size={104} /></Obj>
    <Obj t0={P(A('one in twenty'), 'slam')} x={1330} y={400} from="zoom" z={3}><TF text="1 in 20" size={290} max={820} hot /></Obj>
    <Obj t0={P(A('twenty adults'))} x={1330} y={620} from="up"><Pill text="UK adults" v="dark" icon={ic('group')} /></Obj>
    <Obj t0={P(A('shaping their whole'))} x={1330} y={750} from="up"><Pill text="Their whole Thursday" v="blue" icon={ic('calendar')} /></Obj>
    <Obj t0={P(A('around a video'))} x={1330} y={880} from="up"><Pill text="Around a video game" v="red" icon={ic('pad')} /></Obj>
  </>},
  /* S14a — annual leave: the honest approach */
  {t0: A('some did it'), y: -40, children: <>
    <Obj t0={P(A('some did it'), 'slam')} x={960} y={215} from="zoom" z={3}><TF text="Some did it properly" size={130} max={1300} /></Obj>
    <Obj t0={P(A('annual leave'))} x={540} y={610} from="left" rotY={10} z={2}><LeaveForm t0={A('annual leave') - 0.1} w={580} /></Obj>
    <Obj t0={P(A('annual leave') + 0.1)} x={1350} y={450} from="right"><Pill text="Annual leave" v="blue" icon={ic('calendar')} /></Obj>
    <Obj t0={P(A('weeks out'))} x={1350} y={580} from="right"><Pill text="Booked weeks out" v="dark" icon={ic('clock')} /></Obj>
    <Obj t0={P(A('the honest approach'), 'slam')} x={1350} y={730} from="pop"><Pill text="The honest approach" v="blue" size={40} icon={ic('tick', 54)} /></Obj>
    <Shock t0={A('the honest approach')} x={1350} y={730} color={C.blue} size={700} />
  </>},
  /* S14b — suddenly, tragically, very unwell */
  {t0: A('some were suddenly'), y: 40, children: <>
    {cue(A('some were suddenly') + 0.45, 'type', 0.85)}
    <Obj t0={P(A('some were suddenly'))} x={520} y={580} from="left" rotY={10} z={2}><FitNote t0={A('some were suddenly') + 0.2} w={600} /></Obj>
    <Obj t0={P(A('suddenly'))} x={1320} y={380} from="right"><Pill text="Suddenly" v="dark" icon={ic('thermo')} /></Obj>
    <Obj t0={P(A('tragically'))} x={1360} y={520} from="right"><Pill text="Tragically" v="ghost" icon={ic('warn')} /></Obj>
    <Obj t0={P(A('very unwell'))} x={1320} y={660} from="right"><Pill text="Very unwell" v="red" icon={ic('thermo')} /></Obj>
    <Obj t0={P(A('very unwell') + 0.5, 'slam')} x={1370} y={850} from="none"><Stamp t0={A('very unwell') + 0.5} text="Allegedly" size={72} color={C.redL} rot={-6} /></Obj>
  </>},
  /* S15a — the boss, the empty desk */
  {t0: A('and if you were a boss'), y: -30, children: <>
    <Obj t0={P(A('a boss'))} x={540} y={250} from="down"><Pill text="A boss, that morning" v="blue" icon={ic('person', 44)} /></Obj>
    <Obj t0={P(A('empty desk'))} x={540} y={640} from="left" rotY={8} z={2}><EmptyDesk w={680} /></Obj>
    <Obj t0={P(A('empty desk'))} x={1360} y={440} from="right"><Pill text="An empty desk" v="ghost" icon={ic('chair', 44)} /></Obj>
    <Obj t0={P(A("weren't laughing"))} x={1360} y={600} from="right"><Pill text="Not laughing" v="red" icon={ic('warn', 44)} /></Obj>
    <Obj t0={P(A('staring at'))} x={1360} y={760} from="right"><Pill text="Staring at it" v="dark" icon={ic('eye', 44)} /></Obj>
  </>},
  /* S15b — rotas, calls, a Thursday that still needed doing */
  {t0: A("you'd have"), y: 30, children: <>
    <Obj t0={P(A('rotors'))} x={450} y={290} from="down"><Pill text="Rotas to fill" v="blue" icon={ic('clock', 44)} /></Obj>
    <Obj t0={P(A("you'd have"))} x={450} y={600} from="left" rotY={10} z={2}><Card w={600} label="Rota"><Rota t0={A("you'd have") + 0.1} w={540} /></Card></Obj>
    <Obj t0={P(A('calls to make'))} x={1000} y={205} from="down"><Pill text="Calls to make" v="red" icon={ic('phone', 44)} /></Obj>
    <Obj t0={P(A('calls to make') + 0.1)} x={1000} y={600} from="up" z={2}><Phone w={300}><CallScreen t0={A('calls to make')} /></Phone></Obj>
    <Obj t0={P(A('a thursday that'))} x={1480} y={560} from="right" rotY={-10} z={2}><TodoCard w={480} items={[{t: A('a thursday that') + 0.1, label: 'FILL THE ROTA'}, {t: A('a thursday that') + 0.4, label: 'MAKE THE CALLS'}, {t: A('a thursday that') + 0.7, label: 'RUN THE DAY'}]} /></Obj>
    <Obj t0={P(A('still needed doing'), 'slam')} x={1480} y={880} from="none"><Stamp t0={A('still needed doing')} text="Still needed doing" size={44} color={C.red} rot={-4} /></Obj>
  </>},
  /* S16 — the ones who got their hands on it: enjoying your life */
  {t0: A('but if you were one'), y: -40, children: <>
    <Obj t0={P(A('but if you were one'))} x={960} y={215} from="down"><Pill text="Finally got their hands on it" v="blue" size={40} icon={ic('pad', 56)} /></Obj>
    <Obj t0={P(A('their hands'), 'slam')} x={540} y={600} from="zoom" rot={-6} z={2}><Icon n="pad" size={440} sw={4.5} style={{filter: 'drop-shadow(0 0 44px rgba(47,123,255,0.95))'}} /></Obj>
    <Obj t0={P(A('skything'))} x={1370} y={420} from="right"><SPill t0={P(A('skything') + 0.35, 'strike')} text="Skiving" v="dark" icon={ic('thermo')} /></Obj>
    <Obj t0={P(A('enjoying your life'), 'slam')} x={1320} y={620} from="zoom" z={3}><TF text="Enjoying" size={190} max={800} hot /></Obj>
    <Obj t0={P(A('enjoying your life') + 0.25, 'slam')} x={1320} y={800} from="zoom" z={3}><TF text="Your life" size={190} max={800} hot /></Obj>
    <Rise t0={A('enjoying your life')} n={8} icon="star" color={C.blueL} x0={900} x1={1700} y0={950} />
  </>},
  /* S17 — what the coverage missed → a country giving itself permission (bumper 02 overlays) */
  {t0: A("because here's"), y: -30, children: <>
    <Obj t0={P(A("because here's") + 0.1, 'slam')} x={960} y={225} from="zoom" z={3}><TF text="What the coverage missed" size={130} max={1500} /></Obj>
    <Obj t0={P(A('coverage missed') + 0.7)} x={520} y={640} from="left" rotY={10} z={2}><Paper w={640} head="Britain pulls a sickie" kicker="COVERAGE" /></Obj>
    <Obj t0={P(A('coverage missed') + 1.1, 'slam')} x={640} y={830} from="none" z={4}><Stamp t0={A('coverage missed') + 1.1} text="Missed the point" size={54} color={C.red} rot={-7} /></Obj>
    <Obj t0={P(A('hiding under'))} x={1370} y={450} from="right"><SPill t0={P(A('hiding under') + 0.5, 'strike')} text="Hiding under a duvet" v="dark" icon={ic('bed')} /></Obj>
    <Obj t0={P(A('giving itself'), 'slam')} x={1350} y={660} from="zoom" z={3}><TF text="Permission" size={210} max={700} hot /></Obj>
    <Obj t0={P(A('permission') + 0.3)} x={1350} y={850} from="pop"><Pill text="Granted" v="blue" icon={ic('tick', 44)} /></Obj>
  </>},
];
