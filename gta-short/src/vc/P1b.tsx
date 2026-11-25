/* VC long-form Part 1 — scenes 18-43 (Sam → the schools cliffhanger). */
import React from 'react';
import {Big, C, Card, Count, F, Hi, Icon, Obj, Pill, Shock, Small, Stamp, commas, ramp, useT} from './kit';
import {Door10, LineSpike, PeopleGrid, Quote, UKMap, Bubble} from './parts';
import {SchoolHouse, Arrow, AgeBadge, Battery, Burst, Bust, DayTiles, Diary, Dissolve, Donut, Download, Gauge, Late, Moon, OfficeBlock, Portal, Race, Rise, SPill, StruckTitle, TF, Thought, Voucher, Checklist} from './parts2';
import {A, P, cue} from './anchors';
import {Photo} from './parts4';
import {CR, HAS} from './credits';
import type {SD} from './P1a';

const ic = (n: string, size = 46) => <Icon n={n} size={size} />;
const FiveHours: React.FC = () => {
  const t = useT(); const p = ramp(t, A('up for work'), A('five hours', 1) + 0.4, 1, 0.16);
  return <Donut size={400} p={p}><div style={{fontFamily: F.display, fontSize: 170, lineHeight: 1, color: '#fff'}}>5</div><div style={{fontFamily: F.hero, fontSize: 34, letterSpacing: 5, color: C.redL}}>HOURS</div></Donut>;
};

export const scenesB: SD[] = [
  /* S18 — Sam, St Albans: four days off, nearly £1,500 */
  {t0: A('sam elwood'), y: 40, children: <>
    <Obj t0={P(A('sam elwood'))} x={500} y={580} from="left" rotY={11} z={2}><UKMap w={560} h={640} t0={A('sam elwood') + 0.2} center={'St Albans'} span={420} pins={[{at: 'St Albans', label: 'SAM', t: A('sam elwood') + 0.8, side: 'r'}, {at: 'London', label: 'LONDON', t: A('st albans') + 0.5, col: 'blue', side: 'b'}]} /></Obj>
    <Obj t0={P(A('st albans'))} x={500} y={215} from="down"><Pill text="St Albans" v="blue" icon={ic('house')} /></Obj>
    <Obj t0={P(A('four days'))} x={1310} y={330} from="up"><DayTiles t0={A('four days')} n={4} /></Obj>
    <Obj t0={P(A('four days') + 1.5)} x={1310} y={480} from="up"><Pill text="Days off" v="dark" icon={ic('sun')} /></Obj>
    <Obj t0={P(A('nearly fifteen'))} x={1040} y={590} from="left"><Pill text="Nearly" v="red" size={30} /></Obj>
    <Obj t0={P(A('fifteen hundred'), 'tick')} x={1320} y={700} from="zoom" z={3}><Count t0={A('nearly fifteen')} dur={1.4} to={1500} fmt={(v) => '£' + commas(v)} size={230} style={{textShadow: '0 8px 0 #0a1a3a, 0 0 70px rgba(47,123,255,0.8)'}} /></Obj>
    <Obj t0={P(A('new setup'))} x={1320} y={890} from="up"><Pill text="On a new setup" v="blue" icon={ic('pad')} /></Obj>
  </>},
  /* S19 — new telly, custom controller, the full bunker → asleep before midnight, alarm, lock away */
  {t0: A('new telly'), y: -40, children: <>
    <Obj t0={P(A('new telly'))} x={520} y={560} from="left" rotY={10} z={2}><Checklist w={700} title="The setup" items={[{t: A('new telly') + 0.1, label: 'New telly', icon: 'tv'}, {t: A('custom controller'), label: 'Custom controller', icon: 'pad'}, {t: A('the full bunker'), label: 'The full bunker', icon: 'house'}]} /></Obj>
    <Obj t0={P(A('new telly') + 0.3)} x={1360} y={400} from="right" rotY={-9} z={2}><Photo src="ph/ps5.jpg" w={640} h={410} t0={A('new telly') + 0.3} credit={CR.ps5} dur={7} z0={1.3} z1={1.5} fx={0.7} fy={0.6} px={0} py={0} pos="50% 92%" /></Obj>
    <Obj t0={P(A("then he couldn't"))} x={1360} y={690} from="right"><Pill text="Asleep before midnight" v="dark" icon={ic('moon')} /></Obj>
    <Obj t0={P(A('set his alarm'))} x={1360} y={790} from="right"><Pill text="Alarm set for seven" v="red" icon={ic('bell')} /></Obj>
    <Obj t0={P(A('lock himself'))} x={1360} y={890} from="right"><Pill text="Locked himself away" v="blue" icon={ic('lock')} /></Obj>
  </>},
  /* S21 — not laziness, devotion */
  {t0: A("that's not laziness"), y: 40, children: <>
    <Obj t0={P(A("that's not laziness"))} x={560} y={500} from="left" z={3}><StruckTitle t0={A('laziness') + 0.1} text="Laziness" size={170} max={640} /></Obj>
    <Obj t0={P(A("that's devotion"), 'slam')} x={1380} y={480} from="zoom" z={3}><TF text="Devotion" size={200} max={700} hot /></Obj>
    <Obj t0={P(A("that's devotion") + 0.3, 'slam')} x={1380} y={760} from="zoom"><Icon n="heart" size={190} color={C.red} sw={5} style={{filter: 'drop-shadow(0 0 40px rgba(255,46,74,0.9))'}} /></Obj>
    <Shock t0={A("that's devotion")} x={1380} y={480} size={900} />
  </>},
  /* S22 — Kieran: Manchester → Wales, told the BBC, off grid */
  {t0: A("then there's kieran"), y: -30, children: <>
    <Obj t0={P(A("then there's kieran"))} x={560} y={570} from="left" rotY={10} z={2}><UKMap w={760} h={700} t0={A("then there's kieran") + 0.2} center={[-3.0, 53.1]} span={800} pins={[{at: 'Manchester', label: 'KIERAN', t: A('kieran') + 0.5, side: 'r'}, {at: 'Wales', label: 'WALES', t: A('pilgrimage') + 0.3, col: 'blue', side: 'l'}]} routes={[{from: 'Manchester', to: 'Wales', t0: A('pilgrimage') + 0.4, t1: A('off grid') + 0.2, bend: 0.3}]} /></Obj>
    <Obj t0={P(A('from manchester'))} x={1400} y={300} from="right"><Pill text="From Manchester" v="blue" icon={ic('house')} /></Obj>
    <Obj t0={P(A('he told the'))} x={1400} y={430} from="right"><Pill text="Told the BBC" v="dark" icon={ic('chat')} /></Obj>
    <Obj t0={P(A('pilgrimage'))} x={1400} y={570} from="right"><Pill text="Pilgrimage to Wales" v="red" icon={ic('mountain')} /></Obj>
    <Obj t0={P(A('off grid'), 'slam')} x={1400} y={740} from="none"><Stamp t0={A('off grid')} text="Off grid" sub="NO SIGNAL · NO WIFI" size={70} color={C.blueL} rot={-5} /></Obj>
    <Obj t0={P(A('for a week'))} x={1400} y={900} from="up"><Pill text="For a week" v="dark" icon={ic('calendar')} /></Obj>
  </>},
  /* S23 — his partner: incredibly understanding … why a PlayStation? */
  {t0: A('his partner'), y: -40, children: <>
    <Obj t0={P(A('his partner'))} x={540} y={225} from="down"><Pill text="His partner" v="red" icon={ic('heart')} /></Obj>
    <Obj t0={P(A('incredibly understanding'))} x={560} y={400} from="left"><Bubble me={false} text="Incredibly understanding." size={44} /></Obj>
    <Obj t0={P(A('she was questioning'))} x={1330} y={500} from="up" z={2}><Thought w={640} h={380}><div style={{fontFamily: F.uiB, fontSize: 40, lineHeight: 1.15}}>Why is our romantic getaway… <span style={{color: C.red}}>a PlayStation?</span></div></Thought></Obj>
    <Obj t0={P(A('romantic getaway'))} x={540} y={780} from="up"><Pill text="Romantic getaway" v="red" icon={ic('heart')} /></Obj>
    <Obj t0={P(A('romantic getaway') + 0.8)} x={870} y={780} from="pop"><Arrow t0={A('romantic getaway') + 0.8} len={110} color={C.red} /></Obj>
    <Obj t0={P(A('around a playstation'))} x={1330} y={880} from="up"><Pill text="Revolved around a PlayStation" v="blue" icon={ic('pad')} /></Obj>
  </>},
  /* S24 — not for the hills, for Vice City */
  {t0: A('i love that'), y: 50, children: <>
    <Obj t0={P(A('a week in'))} x={960} y={215} from="down"><Pill text="A week in Wales" v="blue" icon={ic('calendar')} /></Obj>
    {HAS.snowdonia ? <Obj t0={P(A('not for the hills') - 0.3)} x={520} y={520} from="up" rotY={10} z={2}><Photo src="ph/snowdonia.jpg" w={640} h={470} t0={A('not for the hills') - 0.3} credit={CR.snowdonia} dur={6} /></Obj>
      : <Obj t0={P(A('not for the hills'))} x={520} y={500} from="up" z={2}><Icon n="mountain" size={300} sw={5} color={C.blueL} /></Obj>}
    <Obj t0={P(A('the hills'))} x={520} y={HAS.snowdonia ? 830 : 760} from="up"><SPill t0={P(A('the hills') + 0.35, 'strike')} text="The hills" v="dark" icon={ic('mountain')} /></Obj>
    <Obj t0={P(A('for vice city'))} x={1360} y={340} from="down"><Icon n="sun" size={150} sw={5} color={C.redL} style={{filter: 'drop-shadow(0 0 40px rgba(255,46,74,0.9))'}} /></Obj>
    <Obj t0={P(A('vice city'), 'slam')} x={1360} y={560} from="zoom" z={3}><TF text="Vice City" size={250} max={820} hot /></Obj>
    <Obj t0={P(A('vice city') + 0.4)} x={1360} y={780} from="up"><Pill text="For Vice City" v="red" icon={ic('pad')} /></Obj>
  </>},
  /* S25 — all in; a couple, a little holiday at home */
  {t0: A("and he wasn't"), y: -30, children: <>
    <Obj t0={P(A('all in'), 'slam')} x={520} y={330} from="zoom" z={3}><TF text="All in" size={260} max={700} hot /></Obj>
    <Obj t0={P(A('all in') + 0.2)} x={520} y={690} from="up"><PeopleGrid t0={A('all in') + 0.2} hot={-1} cols={4} rows={2} size={100} lightAll={A('all in') + 0.9} /></Obj>
    <Obj t0={P(A('one couple'))} x={1350} y={235} from="down"><Pill text="One couple" v="red" icon={ic('heart')} /></Obj>
    <Obj t0={P(A('holiday at home') - 0.4)} x={1350} y={400} from="down"><Icon n="sun" size={120} sw={5} color={C.redL} style={{filter: 'drop-shadow(0 0 30px rgba(255,46,74,0.9))'}} /></Obj>
    <Obj t0={P(A('holiday at home'), 'slam')} x={1350} y={600} from="zoom" z={2}><Icon n="house" size={320} sw={5} style={{filter: 'drop-shadow(0 0 40px rgba(47,123,255,0.9))'}} /></Obj>
    <Obj t0={P(A('holiday at home') + 0.2)} x={1350} y={860} from="up"><Pill text="A little holiday at home" v="blue" icon={ic('sun')} /></Obj>
  </>},
  /* S26 — he booked the day; she bought him a £90 PlayStation voucher */
  {t0: A('he booked the day'), y: 40, children: <>
    <Obj t0={P(A('he booked the day'))} x={520} y={500} from="left" z={2}><div style={{position: 'relative'}}><Icon n="calendar" size={290} sw={5} color={C.blueL} /><div style={{position: 'absolute', right: -30, bottom: -30}}><Icon n="tick" size={150} color={C.red} sw={10} /></div></div></Obj>
    <Obj t0={P(A('he booked the day') + 0.1)} x={520} y={780} from="up"><Pill text="He booked the day" v="dark" icon={ic('calendar')} /></Obj>
    <Obj t0={P(A('she bought him'))} x={1250} y={350} from="down"><Pill text="She bought him" v="red" icon={ic('heart')} /></Obj>
    <Obj t0={P(A('ninety pound'), 'tick')} x={1250} y={640} from="right" rotY={-9} z={2}><Voucher t0={A('ninety pound') - 0.1} w={760} /></Obj>
  </>},
  /* S27 — the getaway basket */
  {t0: A('he packed'), y: -40, children: <>
    <Obj t0={P(A('he packed'))} x={960} y={225} from="down"><Pill text="A getaway basket" v="blue" icon={ic('bag')} /></Obj>
    <Obj t0={P(A('getaway basket'), 'slam')} x={960} y={600} from="zoom" z={2}><Icon n="basket" size={380} sw={5} style={{filter: 'drop-shadow(0 0 40px rgba(47,123,255,0.9))'}} /></Obj>
    <Obj t0={P(A('lego'))} x={470} y={470} from="up"><Pill text="Lego" v="red" icon={ic('brick')} /></Obj>
    <Obj t0={P(A('coloring books'))} x={1450} y={430} from="up"><Pill text="Colouring books" v="dark" icon={ic('book')} /></Obj>
    <Obj t0={P(A('pajamas'))} x={470} y={700} from="up"><Pill text="Pyjamas" v="blue" icon={ic('shirt')} /></Obj>
    <Obj t0={P(A("so she wouldn't"))} x={1290} y={830} from="up"><Pill text="So she wouldn't feel left out" v="red" icon={ic('heart')} /></Obj>
  </>},
  /* S28 — while he disappeared into the game; not a national crisis */
  {t0: A('while he disappeared'), y: 30, children: <>
    <Obj t0={P(A('while he disappeared'))} x={520} y={500} from="up" z={2}><Dissolve at={A('disappeared') + 0.4}><Icon n="person" size={330} sw={5} color={C.blueL} /></Dissolve></Obj>
    <Obj t0={P(A('into the game'))} x={520} y={800} from="up"><Pill text="Into the game" v="blue" icon={ic('pad')} /></Obj>
    <Obj t0={P(A('not a national crisis'))} x={1340} y={500} from="right" z={3}><StruckTitle t0={A('national crisis') + 0.3} text="National crisis" size={150} max={800} /></Obj>
  </>},
  /* S29 — that's people trying, in their own slightly chaotic way, to be happy */
  {t0: A("that's people trying"), y: -40, children: <>
    <Obj t0={P(A("that's people trying"), 'slam')} x={960} y={250} from="zoom" z={3}><TF text="People trying" size={170} max={1300} /></Obj>
    <Obj t0={P(A('in their own'))} x={960} y={450} from="up"><Pill text="In their own slightly chaotic way" v="dark" icon={ic('dots')} /></Obj>
    <Obj t0={P(A('to be happy'), 'slam')} x={960} y={660} from="zoom" z={3}><TF text="To be happy" size={190} max={1300} hot /></Obj>
    <Rise t0={A('to be happy')} n={9} icon="heart" />
  </>},
  /* S30 — no kit? good luck; John Lewis +62% (bumper 03 overlays) */
  {t0: A("and if you didn't"), y: 330, children: <>
    {cue(A('sixty two percent') - 0.1, 'tick', 1.1)}
    <Obj t0={P(A('have the kit'), 'slam')} x={960} y={225} from="zoom" z={3}><TF text="No kit? Good luck." size={150} max={1300} /></Obj>
    <Obj t0={P(A('in the weeks before'))} x={540} y={895} from="up"><Pill text="In the weeks before launch" v="dark" icon={ic('clock')} /></Obj>
    <Obj t0={P(A('john lewis'))} x={960} y={600} from="up" rotX={-4} z={2}><Card w={1120} h={380} label="John Lewis" tag="SAID" v="blue"><div style={{display: 'flex', alignItems: 'center', gap: 40, height: '100%'}}><Count t0={A('sixty two percent') - 0.1} dur={1.1} to={62} fmt={(v) => '+' + Math.round(v) + '%'} size={230} color={C.white} style={{textShadow: '0 8px 0 #0a1a3a, 0 0 70px rgba(47,123,255,0.8)', flex: 'none', width: 560}} /><div style={{flex: 1}}><Big size={44}>SALES</Big><Small size={30} style={{marginTop: 10}} color={C.blueL}>ON THE YEAR BEFORE</Small></div></div></Card></Obj>
    <Obj t0={P(A('consoles'))} x={1130} y={895} from="up"><Pill text="Consoles" v="blue" icon={ic('pad')} /></Obj>
    <Obj t0={P(A('accessories'))} x={1500} y={895} from="up"><Pill text="Accessories" v="dark" icon={ic('bag')} /></Obj>
  </>},
  /* S31 — Currys +149%: the bar race */
  {t0: A('curries'), y: -30, children: <>
    <Obj t0={P(A('curries'))} x={960} y={225} from="down"><Pill text="Sales vs the year before" v="blue" icon={ic('bag')} /></Obj>
    <Obj t0={P(A('curries') + 0.1)} x={960} y={610} from="up" z={2}><Race t0={A('curries')} t1={A('one hundred and forty') - 0.3} w={1380} /></Obj>
    <Obj t0={P(A('one hundred and forty') + 1.5, 'slam')} x={1500} y={900} from="none"><Stamp t0={A('one hundred and forty') + 1.5} text="More than doubled" size={46} color={C.blueL} rot={-4} /></Obj>
  </>},
  /* S32 — building a night they could disappear into */
  {t0: A("people weren't just"), y: 30, children: <>
    <Obj t0={P(A("people weren't just"))} x={560} y={400} from="left"><SPill t0={P(A("people weren't just") + 0.6, 'strike')} text="Just buying a game" v="dark" icon={ic('pad')} /></Obj>
    <Obj t0={P(A('building a night'), 'slam')} x={960} y={640} from="zoom" z={3}><TF text="Building a night" size={200} max={1500} hot /></Obj>
    <Obj t0={P(A('building a night') + 0.2)} x={1540} y={340} from="pop"><Icon n="moon" size={190} sw={5} color={C.blueL} style={{filter: 'drop-shadow(0 0 36px rgba(143,193,255,0.9))'}} /></Obj>
    <Obj t0={P(A('disappear into'))} x={1300} y={870} from="up"><Pill text="A night to disappear into" v="blue" icon={ic('moon')} /></Obj>
  </>},
  /* S33a — they broke the internet */
  {t0: A('they broke the internet'), y: -30, children: <>
    <Obj t0={P(A('broke the internet'), 'slam')} x={960} y={250} from="zoom" z={3}><TF text="Broke the internet" size={190} max={1500} hot /></Obj>
    <Obj t0={P(A('broke the internet') + 0.05)} x={960} y={660} from="up" z={2}><Gauge t0={A('broke the internet') + 0.05} w={720} /></Obj>
    {HAS.router && <Obj t0={P(A('broke the internet') + 0.2)} x={330} y={640} from="left" rotY={12} z={2}><Photo src="ph/router.jpg" w={500} h={380} t0={A('broke the internet') + 0.2} credit={CR.router} dur={4} /></Obj>}
    <Obj t0={P(A('broke the internet') + 0.8, 'slam')} x={1500} y={850} from="none"><Stamp t0={A('broke the internet') + 0.8} text="Off the chart" size={56} color={C.red} rot={-5} /></Obj>
  </>},
  /* S33b — Virgin Media O2 and BT/EE broadband records */
  {t0: A('the evening before'), y: 40, children: <>
    <Obj t0={P(A('the evening before'))} x={540} y={225} from="down"><Pill text="Broadband records" v="dark" icon={ic('wifi')} /></Obj>
    <Obj t0={P(A('the evening before') + 0.2)} x={540} y={640} from="left" rotY={9} z={2}><Card w={780} h={470} label="Home broadband traffic" tag="ILLUSTRATIVE"><div style={{marginTop: 24}}><LineSpike t0={A('the evening before') + 0.3} w={700} h={290} dur={3.0} /></div></Card></Obj>
    <Obj t0={P(A('virgin media'))} x={1380} y={420} from="right" rotY={-8} z={2}><Card w={640} label="Virgin Media O2" v="red" tag="10 NOV"><div style={{display: 'flex', alignItems: 'center', gap: 22}}><Icon n="wifi" size={96} color={C.redL} /><Big size={42}>Smashed its own record</Big></div></Card></Obj>
    <Obj t0={P(A('smashed its own') + 0.2, 'slam')} x={1650} y={300} from="none"><Stamp t0={A('smashed its own') + 0.2} text="Record" size={50} color={C.red} rot={6} /></Obj>
    <Obj t0={P(A('peak ever') - 0.3, 'slam')} x={1650} y={590} from="none"><Stamp t0={A('peak ever') - 0.3} text="Peak ever" size={50} color={C.blueL} rot={5} /></Obj>
    <Obj t0={P(A('bt and e e'))} x={1380} y={700} from="right" rotY={-8} z={2}><Card w={640} label="BT & EE" v="blue" tag="AS REPORTED"><div style={{display: 'flex', alignItems: 'center', gap: 22}}><Icon n="wifi" size={96} color={C.blueL} /><Big size={42}>Highest home broadband peak ever</Big></div></Card></Obj>
  </>},
  /* S34 — one player told the BBC: years to enjoy; five hours to work */
  {t0: A('one player'), y: -50, children: <>
    <Obj t0={P(A('one player'))} x={640} y={470} from="left" rotY={8} z={2}><Quote w={980} who="One player, told the BBC" v="blue"><Late t0={A('why am i')}>Why am I playing a game I have <Hi t0={A('years to enjoy') - 0.1}>years to enjoy?</Hi></Late></Quote></Obj>
    <Obj t0={P(A('still on it'))} x={640} y={800} from="up"><Pill text="Still on it" v="blue" icon={ic('pad')} /></Obj>
    <Obj t0={P(A('early hours'))} x={1480} y={225} from="down"><Pill text="In the early hours" v="dark" icon={ic('moon')} /></Obj>
    <Obj t0={P(A('up for work'))} x={1480} y={520} from="zoom" z={2}><FiveHours /></Obj>
    <Obj t0={P(A('up for work') + 0.2)} x={1480} y={830} from="up"><Pill text="Up for work in five hours" v="red" size={30} icon={ic('bell', 40)} /></Obj>
  </>},
  /* S35 — when it finally arrives, five hours' sleep feels negotiable */
  {t0: A("because that's the thing"), y: 30, children: <>
    <Obj t0={P(A("because that's the thing"))} x={960} y={225} from="down" z={3}><TF text="A wait this long" size={150} max={1300} /></Obj>
    <Obj t0={P(A('when it finally'))} x={1390} y={430} from="right"><Pill text="When it finally arrives" v="blue" icon={ic('download')} /></Obj>
    <Obj t0={P(A('five hours', 1) - 0.1)} x={540} y={580} from="left" z={2}><Battery t0={A('five hours', 1)} dur={2.2} w={620} /></Obj>
    <Obj t0={P(A('five hours', 1))} x={540} y={800} from="up"><Pill text="Five hours' sleep" v="dark" icon={ic('bed')} /></Obj>
    <Obj t0={P(A('negotiable'), 'slam')} x={1390} y={680} from="none"><Stamp t0={A('negotiable')} text="Negotiable" sub="SLEEP: OPTIONAL" size={96} color={C.blueL} rot={-6} /></Obj>
  </>},
  /* S36a — nobody queued outside Game; no disc */
  {t0: A("britain didn't queue"), y: -30, children: <>
    <Obj t0={P(A('queue outside'))} x={560} y={330} from="left"><SPill t0={P(A('queue outside') + 0.5, 'strike')} text="Queue outside Game" v="dark" icon={ic('bag')} /></Obj>
    <Obj t0={P(A('at midnight', 1))} x={560} y={700} from="up" z={2}><Card w={520} h={300} label="Queue at midnight" v="blue"><div style={{fontFamily: F.display, fontSize: 190, lineHeight: 1, textAlign: 'center', color: '#fff', textShadow: '0 8px 0 #0a1a3a, 0 0 60px rgba(47,123,255,0.8)'}}>0</div></Card></Obj>
    <Obj t0={P(A('no disc'))} x={1350} y={500} from="zoom" z={2}><div style={{position: 'relative'}}><Icon n="disc" size={300} sw={5} /><div style={{position: 'absolute', inset: 0}}><Icon n="cross" size={300} color={C.red} sw={9} /></div></div></Obj>
    <Obj t0={P(A('no disc') + 0.5)} x={1350} y={790} from="up"><Pill text="No disc to queue for" v="red" icon={ic('disc')} /></Obj>
  </>},
  /* S36b — a download the size of a small moon; a nation in the dark */
  {t0: A('just to download'), y: 40, children: <>
    {HAS.moon ? <Obj t0={P(A('just to download'))} t1={HAS.uknight ? A('a nation sitting') - 0.1 : undefined} x={1270} y={470} from="zoom" z={2}><Photo src="ph/moon.jpg" round w={540} h={540} t0={A('just to download')} dur={4} z0={1.0} z1={1.18} px={0} py={0} /></Obj>
      : <Obj t0={P(A('just to download'))} x={1270} y={470} from="zoom" z={2}><Moon size={520} /></Obj>}
    {HAS.uknight && <Obj t0={P(A('a nation sitting'), 'slam')} x={1270} y={470} from="zoom" z={2}><Photo src="ph/uknight.jpg" w={600} h={600} t0={A('a nation sitting')} credit={CR.uknight} label="BRITAIN AT NIGHT" dur={3} z0={1.0} z1={1.15} /></Obj>}
    <Obj t0={P(A('size of a small'))} x={560} y={310} from="left"><Pill text="The size of a small moon" v="blue" icon={ic('moon')} /></Obj>
    <Obj t0={P(A('a nation sitting'))} x={560} y={560} from="left"><Pill text="A nation, in the dark" v="dark" icon={ic('group')} /></Obj>
    <Obj t0={P(A('progress bar') - 0.3)} x={960} y={880} from="up" z={3}><Download t0={A('just to download') + 0.4} t1={A('finish')} w={1300} /></Obj>
  </>},
  /* S37 — somewhere else: warmer, louder, not the group chat / bills / alarm */
  {t0: A('so they could finally'), y: -40, children: <>
    <Obj t0={P(A('somewhere else'), 'slam')} x={960} y={225} from="zoom" z={3}><TF text="Somewhere else" size={150} max={1100} hot /></Obj>
    <Obj t0={P(A('somewhere else'))} x={960} y={600} from="zoom" z={2}><Portal w={340} h={500} /></Obj>
    <Obj t0={P(A('somewhere warmer'))} x={470} y={440} from="left"><Pill text="Warmer" v="blue" icon={ic('sun')} /></Obj>
    <Obj t0={P(A('somewhere louder'))} x={470} y={600} from="left"><Pill text="Louder" v="blue" icon={ic('speaker')} /></Obj>
    <Obj t0={P(A("somewhere that wasn't"))} x={1440} y={410} from="right"><SPill t0={P(A("somewhere that wasn't") + 0.9, 'strike')} text="The group chat" v="dark" icon={ic('chat')} /></Obj>
    <Obj t0={P(A('the bills'))} x={1440} y={560} from="right"><SPill t0={P(A('the bills') + 0.4, 'strike')} text="The bills" v="dark" icon={ic('pound')} /></Obj>
    <Obj t0={P(A('seven am alarm'))} x={1440} y={710} from="right"><SPill t0={P(A('seven am alarm') + 0.5, 'strike')} text="The 7am alarm" v="dark" icon={ic('bell')} /></Obj>
  </>},
  /* S38 — the real story (bumper 04) */
  {t0: A('if you ask me'), y: -330, children: <>
    <Obj t0={P(A('real story'), 'slam')} x={960} y={225} from="zoom" z={3}><TF text="The real story" size={170} max={1400} hot /></Obj>
    <Obj t0={P(A('not that people'))} x={560} y={850} from="left"><SPill t0={P(A('not that people') + 0.7, 'strike')} text="People skipped work" v="dark" icon={ic('case')} /></Obj>
    <Obj t0={P(A('at the same time'))} x={1330} y={380} from="down"><Pill text="At the same time" v="red" icon={ic('clock')} /></Obj>
    <Obj t0={P(A('so many of them'))} x={1330} y={640} from="up" rotY={-8} z={2}><PeopleGrid t0={A('so many of them')} hot={-1} cols={5} rows={3} size={100} lightAll={A('at the same time') + 0.2} /></Obj>
    <Obj t0={P(A('worth it'), 'slam')} x={560} y={560} from="none"><Stamp t0={A('worth it')} text="Worth it" size={110} color={C.blueL} rot={-6} /></Obj>
  </>},
  /* S39 — the Prime Minister; Downing Street; a British success story made in Edinburgh */
  {t0: A('which brings me'), y: -30, children: <>
    <Obj t0={P(A('the prime minister'))} x={560} y={225} from="down"><Pill text="The Prime Minister" v="blue" size={42} icon={ic('shield', 58)} /></Obj>
    {HAS.door ? <Obj t0={P(A('downing street'))} x={380} y={590} from="left" rotY={14} z={2}><Photo src="ph/door.jpg" w={340} h={500} t0={A('downing street')} credit={CR.door} dur={6} label="NO. 10" /></Obj>
      : <Obj t0={P(A('downing street'))} x={380} y={600} from="left" rotY={14} z={2}><Door10 w={330} /></Obj>}
    <Obj t0={P(A('downing street') + 0.3)} x={380} y={925} from="up"><Pill text="Downing Street" v="dark" size={30} icon={ic('house', 40)} /></Obj>
    <Obj t0={P(A('a british success'))} x={1260} y={420} from="right" rotY={-8} z={2}><Quote w={900} who="Downing Street" v="blue">A British <Hi t0={A('success story')}>success story,</Hi> made in Edinburgh.</Quote></Obj>
    {HAS.edinburgh ? <Obj t0={P(A('made in edinburgh'))} x={1260} y={790} from="up" rotY={-6} z={2}><Photo src="ph/edinburgh.jpg" w={640} h={330} t0={A('made in edinburgh')} credit={CR.edinburgh} label="EDINBURGH" dur={4} /></Obj>
      : <Obj t0={P(A('made in edinburgh'))} x={1260} y={790} from="up" rotY={-6} z={2}><UKMap w={620} h={330} t0={A('made in edinburgh')} center={'Edinburgh'} span={430} pins={[{at: 'Edinburgh', label: 'EDINBURGH', t: A('made in edinburgh') + 0.5, side: 'r'}]} /></Obj>}
    <Obj t0={P(A('fair enough'))} x={740} y={700} from="up"><Pill text="Fair enough" v="blue" icon={ic('tick')} /></Obj>
  </>},
  /* S41a — would Andy Burnham be exploring Vice City? */
  {t0: A('so would andy'), y: 40, children: <>
    <Obj t0={P(A('so would andy'))} x={540} y={570} from="left" rotY={10} z={2}><Bust w={420} name="Andy Burnham" role="PRIME MINISTER" /></Obj>
    <Obj t0={P(A('exploring vice city'))} x={1370} y={400} from="right"><Pill text="Exploring Vice City?" v="red" icon={ic('search')} /></Obj>
    <Obj t0={P(A('with the rest of us'))} x={1370} y={560} from="right"><Pill text="With the rest of us" v="dark" icon={ic('group')} /></Obj>
    <Obj t0={P(A('with the rest of us') + 0.5, 'slam')} x={1370} y={800} from="zoom" z={3}><TF text="?" size={300} max={400} hot /></Obj>
  </>},
  /* S41b — a spokesperson: his diary was very full; he wouldn't be playing it */
  {t0: A('a spokesperson'), y: -30, children: <>
    <Obj t0={P(A('a spokesperson'))} x={520} y={560} from="left" rotY={10} z={2}><Diary w={540} fillAt={A('his diary')} /></Obj>
    <Obj t0={P(A('said his diary'))} x={1330} y={380} from="right" rotY={-8} z={2}><Card w={780} label="Downing Street spokesperson" v="blue"><Big size={54}>His diary was <Hi t0={A('very full')}>very full.</Hi></Big></Card></Obj>
    <Obj t0={P(A("he wouldn't be playing"), 'slam')} x={1330} y={650} from="none"><Stamp t0={A("he wouldn't be playing")} text="Not playing" sub="OF COURSE HE WOULDN'T" size={90} color={C.red} rot={-5} /></Obj>
  </>},
  /* S42 — the rest of the country had already booked the day; only offices went quiet? */
  {t0: A('the rest of the country'), y: 30, children: <>
    <Obj t0={P(A('already booked'))} x={520} y={215} from="down"><Pill text="Already booked the day" v="red" icon={ic('calendar')} /></Obj>
    <Obj t0={P(A('the rest of the country'))} x={520} y={600} from="left" rotY={10} z={2}><UKMap w={720} h={700} t0={A('the rest of the country') + 0.1} center={[-3.2, 54.3]} span={1180} flood={{t0: A('already booked'), dur: 1.2}} /></Obj>
    <Obj t0={P(A('only offices'))} x={1400} y={300} from="down"><Pill text="Only offices?" v="dark" icon={ic('building')} /></Obj>
    <Obj t0={P(A('only offices') + 0.1)} x={1400} y={650} from="right" rotY={-9} z={2}><OfficeBlock w={420} h={560} off={A('went quiet') - 0.2} /></Obj>
  </>},
  /* S43 — the schools: because this game is an 18 (cliffhanger) */
  {t0: A('wait till you'), y: -20, children: <>
    <Obj t0={P(A('wait till you'))} x={960} y={185} from="down"><Pill text="Wait till you hear…" v="dark" size={44} icon={ic('eye', 60)} /></Obj>
    <Obj t0={P(A('the schools'), 'slam')} x={960} y={345} from="zoom" z={3}><TF text="The schools" size={190} max={1300} hot /></Obj>
    <Obj t0={P(A('the schools') + 0.1)} x={600} y={690} from="up" z={2}><SchoolHouse w={560} /></Obj>
    <Obj t0={P(A('because this game'))} x={1340} y={885} from="up"><Pill text="Because this game is an 18" v="red" size={34} icon={ic('warn', 46)} /></Obj>
    <Obj t0={P(A('eighteen') - 0.1, 'slam')} x={1340} y={630} from="zoom" z={3}><AgeBadge size={290} /></Obj>
    <Shock t0={A('eighteen')} x={1340} y={630} size={900} /><Burst t0={A('eighteen')} peak={0.3} color="#ff5a6e" />
  </>},
];
