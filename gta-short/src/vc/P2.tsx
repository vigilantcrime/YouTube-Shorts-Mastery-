/* VC long-form Part 2 — the schools, then "Britain is tired". Anchors are absolute (Part 2 VO starts at D2). */
import React from 'react';
import {Big, C, Card, Count, F, Hi, Icon, Obj, Pill, Shock, Small, Src, Stamp, commas, ramp, useT} from './kit';
import {BarPair, LineSpike, PeopleGrid, Quote, UKMap} from './parts';
import {Arrow, Battery, Burst, Rise, SPill, SchoolHouse, StruckTitle, TF} from './parts2';
import {Breath, CommentBox, EmptySeats, Pulse, RiseCard, SchoolGrid, Ticket, WeekCard} from './parts3';
import {A2 as A, P, D2, cue} from './anchors';
import {Photo} from './parts4';
import {CR, HAS} from './credits';
import type {SD} from './P1a';

const ic = (n: string, size = 46) => <Icon n={n} size={size} />;
const hot = {textShadow: '0 10px 0 #5a0a1c, 0 0 90px rgba(255,46,74,0.7)', WebkitTextStroke: '6px #fff', paintOrder: 'stroke fill'} as React.CSSProperties;

export const scenes2: SD[] = [
  /* P0 — not a panic about kids (bumper 05 overlays) */
  {t0: A("i'm not turning"), y: 330, children: <>
    <Obj t0={P(A('a panic'), 'slam')} x={960} y={225} from="zoom" z={3}><StruckTitle t0={A('about kids') + 0.3} text="A panic about kids" size={140} max={1400} /></Obj>
    {HAS.school ? <Obj t0={P(A('about kids') + 0.5, 'slam')} x={960} y={575} from="zoom" rotY={-6} z={2}><Photo src="ph/school.jpg" w={860} h={520} t0={A('about kids') + 0.5} credit={CR.school} dur={4} label="SCHOOL · ILLUSTRATIVE" /></Obj>
      : <Obj t0={P(A('about kids') + 0.5, 'slam')} x={960} y={575} from="zoom" z={2}><SchoolHouse w={440} /></Obj>}
    <Obj t0={P(A('straight with you'))} x={960} y={885} from="up"><Pill text="Straight with you" v="blue" size={40} icon={ic('eye', 56)} /></Obj>
  </>},
  /* P1 — more than 1,400 English secondary schools */
  {t0: A('on thursday morning'), y: 30, children: <>
    <Obj t0={P(A('on thursday morning') + 0.1)} x={1400} y={215} from="down"><Pill text="Thursday morning" v="dark" icon={ic('sun')} /></Obj>
    <Obj t0={P(A('on thursday morning') + 0.25)} x={520} y={600} from="left" rotY={9} z={2}><Card w={760} h={480} label="English secondary schools" tag="MORNING REGISTERS"><Small mono size={26}>MORE THAN</Small><Count t0={A('fourteen hundred') - 0.25} dur={1.0} to={1400} fmt={(v) => commas(v) + '+'} size={230} /><Small size={30} style={{marginTop: 8}}>SCHOOLS · THURSDAY MORNING</Small><div style={{marginTop: 20}}><Src text="Provisional · Arbor" /></div><div style={{position: 'absolute', right: 34, bottom: 26, opacity: 0.22}}><Icon n="school" size={130} color={C.blueL} /></div></Card></Obj>
    <Obj t0={P(A('english secondary'))} x={1400} y={600} from="right" rotY={-9} z={2}><UKMap w={640} h={700} t0={A('english secondary')} center={[-1.6, 52.7]} span={640} dots={{t0: A('english secondary') + 0.2, n: 340, dur: 1.5}} /></Obj>
    {cue(A('fourteen hundred') - 0.25, 'tick', 1.0)}
  </>},
  /* P2 — about 35,000 more pupils off; older boys mostly */
  {t0: A('about thirty five'), y: -40, children: <>
    <Obj t0={P(A('thirty five thousand'), 'slam')} x={560} y={370} from="zoom" z={3}><Count t0={A('thirty five thousand') - 0.15} dur={1.3} to={35000} fmt={(v) => '+' + commas(v)} size={230} color={C.red} style={hot} /></Obj>
    {cue(A('thirty five thousand') - 0.15, 'tick', 1.3)}
    <Obj t0={P(A('more pupils'))} x={560} y={590} from="up"><Pill text="More pupils off" v="red" icon={ic('group')} /></Obj>
    <Obj t0={P(A('three days before'))} x={560} y={720} from="up"><Pill text="Than the three days before" v="dark" icon={ic('calendar')} /></Obj>
    <Obj t0={P(A('three days before') + 0.5)} x={560} y={830} from="up"><Src text="Provisional figures · school registers" /></Obj>
    <Obj t0={P(A('about thirty five') + 0.2)} x={1370} y={590} from="right" rotY={-8} z={2}><EmptySeats t0={A('about thirty five') + 0.2} offAt={A('were off') - 0.1} /></Obj>
    <Obj t0={P(A('older boys'), 'slam')} x={1370} y={235} from="down"><Pill text="Older boys, mostly" v="red" icon={ic('person')} /></Obj>
  </>},
  /* P3 — voucher draws */
  {t0: A('some schools'), y: 40, children: <>
    <Obj t0={P(A('some schools'))} x={500} y={240} from="down"><Pill text="Some schools" v="dark" icon={ic('school')} /></Obj>
    <Obj t0={P(A('bribe them'), 'slam')} x={1400} y={240} from="down"><Pill text="Tried to bribe them in" v="red" icon={ic('key')} /></Obj>
    <Obj t0={P(A('voucher drawers') - 0.3)} x={960} y={590} from="zoom" rotY={-6} z={2}><Ticket t0={A('voucher drawers') - 0.3} w={860} /></Obj>
    <Obj t0={P(A('voucher drawers'))} x={960} y={880} from="up"><Pill text="Voucher draws" v="blue" icon={ic('bag')} /></Obj>
  </>},
  /* P4 — one head teacher in Birmingham: "the enemy" */
  {t0: A('one head teacher'), y: -30, children: <>
    <Obj t0={P(A('one head teacher'))} x={520} y={225} from="down"><Pill text="One head teacher" v="blue" icon={ic('person')} /></Obj>
    <Obj t0={P(A('in birmingham'))} x={620} y={560} from="left" rotY={8} z={2}><Quote w={900} who="A head teacher · Birmingham" v="red"><Hi t0={A('the enemy')} dur={0.5}>The enemy.</Hi></Quote></Obj>
    <Obj t0={P(A('in birmingham'))} x={1430} y={570} from="right" rotY={-9} z={2}><UKMap w={520} h={620} t0={A('in birmingham')} center={'Birmingham'} span={380} pins={[{at: 'Birmingham', label: 'BIRMINGHAM', t: A('in birmingham') + 0.5, side: 'l'}]} /></Obj>
    <Obj t0={P(A('the enemy'), 'slam')} x={620} y={870} from="none"><Stamp t0={A('the enemy')} text="The game" sub="CALLED THE ENEMY" size={56} color={C.red} rot={-4} /></Obj>
  </>},
  /* P5 — other researchers: a bigger set, winter bugs, snow in the north */
  {t0: A('other researchers'), y: 30, children: <>
    <Obj t0={P(A('other researchers'))} x={540} y={225} from="down"><Pill text="Other researchers" v="dark" icon={ic('search')} /></Obj>
    <Obj t0={P(A('a bigger set'))} x={540} y={370} from="left"><Pill text="A bigger set of schools" v="blue" icon={ic('school')} /></Obj>
    <Obj t0={P(A('a bigger set') + 0.2)} x={540} y={650} from="up" rotY={8} z={2}><SchoolGrid t0={A('a bigger set') + 0.2} cols={8} rows={4} size={78} /></Obj>
    <Obj t0={P(A('hang on'), 'slam')} x={1400} y={310} from="none"><Stamp t0={A('hang on')} text="Hang on" size={100} color={C.blueL} rot={-5} /></Obj>
    <Obj t0={P(A('winter bugs'))} x={1400} y={500} from="right"><Pill text="Winter bugs" v="dark" icon={ic('thermo')} /></Obj>
    <Obj t0={P(A('snow in the north'))} x={1400} y={640} from="right"><Pill text="Snow in the north" v="dark" icon={ic('snow')} /></Obj>
    <Obj t0={P(A('overeg'), 'slam')} x={1400} y={820} from="none"><Stamp t0={A('overeg')} text="Don't overegg it" size={52} color={C.red} rot={-4} /></Obj>
  </>},
  /* P6 — no collapse, but the tension */
  {t0: A('so no'), y: -30, children: <>
    <Obj t0={P(A('so no'))} x={520} y={340} from="left" z={3}><StruckTitle t0={A("didn't collapse") + 0.2} text="Collapse" size={190} max={700} /></Obj>
    <Obj t0={P(A('classrooms'))} x={520} y={540} from="up"><Pill text="The classrooms" v="blue" icon={ic('school')} /></Obj>
    <Obj t0={P(A('you can feel'))} x={1390} y={560} from="right" rotY={-8} z={2}><Card w={760} h={470} label="Tension · illustrative" v="red"><div style={{marginTop: 16}}><LineSpike t0={A('you can feel')} w={690} h={340} dur={3.0} spikeAt={0.4} /></div></Card></Obj>
    <Obj t0={P(A("can't you"), 'slam')} x={1390} y={885} from="up"><Pill text="Can't you?" v="red" icon={ic('eye')} /></Obj>
  </>},
  /* P7 — bosses vs teachers vs a country with other plans */
  {t0: A('bosses'), y: 40, children: <>
    <Obj t0={P(A('bosses'))} x={450} y={560} from="up" rotY={9} z={2}><Card w={470} h={430} label="Bosses" v="blue"><div style={{textAlign: 'center'}}><Icon n="case" size={100} color={C.blueL} /><div style={{fontFamily: F.display, fontSize: 64, lineHeight: 1.05, color: '#fff', marginTop: 10}}>BODIES<br />AT DESKS</div><div style={{marginTop: 8}}><Icon n="desk" size={70} color={C.blueL} /></div></div></Card></Obj>
    <Obj t0={P(A('teachers'))} x={960} y={560} from="up" z={2}><Card w={470} h={430} label="Teachers" v="blue"><div style={{textAlign: 'center'}}><Icon n="school" size={100} color={C.blueL} /><div style={{fontFamily: F.display, fontSize: 64, lineHeight: 1.05, color: '#fff', marginTop: 10}}>BODIES<br />IN SEATS</div><div style={{marginTop: 8}}><Icon n="chair" size={70} color={C.blueL} /></div></div></Card></Obj>
    <Obj t0={P(A('a country that'))} x={1470} y={560} from="up" rotY={-9} z={2}><Card w={470} h={430} label="A country" v="red"><div style={{textAlign: 'center'}}><Icon n="pad" size={100} color={C.redL} /><div style={{fontFamily: F.display, fontSize: 64, lineHeight: 1.05, color: '#fff', marginTop: 10}}>OTHER<br />PLANS</div><div style={{marginTop: 8}}><Icon n="sun" size={70} color={C.redL} /></div></div></Card></Obj>
    <Obj t0={P(A('one thursday'))} x={1470} y={860} from="up"><Pill text="For one Thursday" v="red" icon={ic('calendar')} /></Obj>
  </>},
  /* P8 — so what does that say about us? */
  {t0: A('so what does that'), y: -20, children: <>
    <Obj t0={P(A('so what does that'), 'slam')} x={960} y={330} from="zoom" z={3}><TF text="What does that" size={170} max={1300} /></Obj>
    <Obj t0={P(A('about us'), 'slam')} x={960} y={560} from="zoom" z={3}><TF text="Say about us?" size={210} max={1400} hot /></Obj>
    <Obj t0={P(A('about us') + 0.3)} x={960} y={820} from="up"><Pill text="Actually" v="ghost" icon={ic('search')} /></Obj>
  </>},
  /* P9 — my read (bumper 06 overlays), opinion */
  {t0: A('going to give'), y: -330, children: <>
    <Obj t0={P(A('going to give') + 0.15, 'slam')} x={960} y={225} from="zoom" z={3}><TF text="My read" size={170} max={900} /></Obj>
    <Obj t0={P(A('my opinion'), 'slam')} x={960} y={860} from="none"><Stamp t0={A('my opinion')} text="Opinion" sub="MINE — NOT A FACT" size={84} color={C.blueL} rot={-4} /></Obj>
  </>},
  /* P10a — tell me I'm wrong in the comments */
  {t0: A('tell me'), y: -30, children: <>
    <Obj t0={P(A('tell me'))} x={960} y={520} from="up" rotX={-4} z={2}><CommentBox t0={A('tell me')} w={940} text="Tell me I'm wrong." /></Obj>
    <Obj t0={P(A('in the comments'))} x={960} y={820} from="up"><Pill text="In the comments" v="blue" icon={ic('chat')} /></Obj>
  </>},
  /* P10b — Britain is tired */
  {t0: A('britain is tired'), y: 30, children: <>
    <Obj t0={P(A('britain is tired'), 'slam')} x={960} y={330} from="zoom" z={3}><TF text="Britain is tired" size={250} max={1560} hot /></Obj>
    <Shock t0={A('britain is tired')} x={960} y={330} size={1000} />
    <Obj t0={P(A('britain is tired') + 0.6)} x={960} y={720} from="up" z={2}><Battery t0={A('britain is tired') + 0.7} dur={3.0} w={760} from={0.42} to={0.04} /></Obj>
  </>},
  /* P11 — years of "hang on": cost of living, burnout, the week you were promised */
  {t0: A('years of being told'), y: -40, children: <>
    <Obj t0={P(A('years of being told'))} x={520} y={300} from="left"><Pill text="Years of “hang on”" v="dark" icon={ic('hourglass')} /></Obj>
    <Obj t0={P(A('cost of living'))} x={520} y={440} from="left"><Pill text="The cost of living" v="red" icon={ic('pound')} /></Obj>
    <Obj t0={P(A('burnout'))} x={520} y={580} from="left"><Pill text="Burnout" v="red" icon={ic('flame')} /></Obj>
    <Obj t0={P(A('quiet feeling'))} x={520} y={720} from="left"><Pill text="That quiet feeling" v="ghost" icon={ic('dots')} /></Obj>
    <Obj t0={P(A('working hard') - 0.2)} x={1370} y={580} from="right" rotY={-8} z={2}><WeekCard t0={A('working hard') - 0.2} w={800} /></Obj>
  </>},
  /* P12 — everything going up; the fun has to wait */
  {t0: A('everything going up'), y: 30, children: <>
    <Obj t0={P(A('everything going up'), 'slam')} x={960} y={205} from="zoom" z={3}><TF text="Everything going up" size={120} max={1300} /></Obj>
    <Obj t0={P(A('energy'))} x={420} y={500} from="up" rotY={8} z={2}><RiseCard t0={A('energy')} label="ENERGY" icon="thermo" w={440} /></Obj>
    <Obj t0={P(A('rent'))} x={900} y={500} from="up" z={2}><RiseCard t0={A('rent')} label="RENT" icon="house" w={440} /></Obj>
    <Obj t0={P(A('the weekly shop'))} x={1380} y={500} from="up" rotY={-8} z={2}><RiseCard t0={A('the weekly shop')} label="THE WEEKLY SHOP" icon="basket" w={440} /></Obj>
    <Obj t0={P(A('the fun'))} x={640} y={850} from="up"><Pill text="The fun" v="blue" icon={ic('pad')} /></Obj>
    <Obj t0={P(A('has to wait') - 0.5)} x={930} y={850} from="pop"><Arrow t0={A('has to wait') - 0.5} len={120} color={C.red} /></Obj>
    <Obj t0={P(A('has to wait'), 'slam')} x={1250} y={850} from="up"><Pill text="Has to wait" v="red" icon={ic('hourglass')} /></Obj>
  </>},
  /* P13 — and then a game comes along */
  {t0: A('a game comes along'), y: -30, children: <>
    <Obj t0={P(A('a game comes along') + 0.2, 'slam')} x={960} y={225} from="zoom" z={3}><TF text="A game comes along" size={140} max={1400} hot /></Obj>
    <Obj t0={P(A('a game comes along') + 0.5, 'slam')} x={520} y={620} from="zoom" rotY={9} z={2}><Photo src="ph/ps5.jpg" w={470} h={600} t0={A('a game comes along') + 0.5} credit={CR.ps5} dur={5} z0={1.0} z1={1.12} /></Obj>
    <Obj t0={P(A('half the country'))} x={1380} y={470} from="right"><Pill text="Half the country" v="red" icon={ic('group')} /></Obj>
    <Obj t0={P(A('since they were'))} x={1380} y={620} from="right"><Pill text="Since they were teens" v="dark" icon={ic('bag')} /></Obj>
    <Rise t0={A('since they were')} n={8} icon="star" color={C.blueL} x0={900} x1={1700} y0={950} />
  </>},
  /* P14 — for once people choose to feel alive */
  {t0: A('for once people'), y: 40, children: <>
    <Obj t0={P(A('for once people'))} x={960} y={215} from="down"><Pill text="For once" v="blue" icon={ic('star')} /></Obj>
    <Obj t0={P(A('feel alive') - 0.4, 'slam')} x={960} y={400} from="zoom" z={3}><TF text="Feel alive" size={300} max={1400} hot /></Obj>
    <Obj t0={P(A('for once people') + 0.3)} x={960} y={760} from="up" z={2}><Pulse t0={A('for once people') + 0.3} alive={A('feel alive') - 0.2} w={1200} h={240} /></Obj>
  </>},
  /* P15 — not next month, not when things calm down: Thursday */
  {t0: A('not next month'), y: -40, children: <>
    <Obj t0={P(A('not next month'))} x={520} y={380} from="left"><SPill t0={P(A('not next month') + 0.5, 'strike')} text="Next month" v="dark" icon={ic('calendar')} /></Obj>
    <Obj t0={P(A('not when things'))} x={700} y={540} from="left"><SPill t0={P(A('not when things') + 0.9, 'strike')} text="When things calm down" v="dark" icon={ic('hourglass')} /></Obj>
    <Obj t0={P(A('down thursday') + 0.1, 'slam')} x={1250} y={780} from="zoom" z={3}><TF text="Thursday" size={300} max={1000} hot /></Obj>
    <Shock t0={A('down thursday') + 0.1} x={1250} y={780} size={900} />
  </>},
  /* P16 — they spend, they book, they call in, they disappear to Wales (callbacks) */
  {t0: A('they spend money'), y: 30, children: <>
    <Obj t0={P(A('they spend money'))} x={430} y={330} from="up" rotY={8} z={2}><Card w={520} h={300} label="Spend" v="red"><div style={{display: 'flex', alignItems: 'center', gap: 22}}><Icon n="pound" size={96} color={C.redL} /><Count t0={A('they spend money') + 0.2} dur={0.9} to={1500} fmt={(v) => '£' + commas(v)} size={110} /></div><Small size={26} style={{marginTop: 14}}>MONEY THEY MAYBE SHOULDN'T</Small></Card></Obj>
    <Obj t0={P(A('book the thursday'))} x={960} y={330} from="up" z={2}><Card w={520} h={300} label="Book" v="blue"><div style={{display: 'flex', alignItems: 'center', gap: 22}}><div style={{position: 'relative'}}><Icon n="calendar" size={116} color={C.blueL} /><div style={{position: 'absolute', right: -16, bottom: -16}}><Icon n="tick" size={70} color={C.red} sw={11} /></div></div><div style={{fontFamily: F.display, fontSize: 70, lineHeight: 1, color: '#fff'}}>THE<br />THURSDAY</div></div></Card></Obj>
    <Obj t0={P(A('they call in'))} x={1490} y={330} from="up" rotY={-8} z={2}><Card w={520} h={300} label="Call in" v="red"><div style={{display: 'flex', alignItems: 'center', gap: 22}}><Icon n="phone" size={116} color={C.redL} /><div style={{fontFamily: F.display, fontSize: 70, lineHeight: 1, color: '#fff'}}>SICK<br />DAY</div></div></Card></Obj>
    <Obj t0={P(A('disappear to wales'))} x={760} y={750} from="up" rotX={-4} z={2}><UKMap w={1000} h={340} t0={A('disappear to wales')} center={[-2.8, 52.95]} span={800} pins={[{at: 'Wales', label: 'WALES', t: A('disappear to wales') + 0.5, col: 'blue', side: 'l'}, {at: 'Manchester', label: 'MANCHESTER', t: A('disappear to wales') + 0.2, side: 'r'}]} routes={[{from: 'Manchester', to: 'Wales', t0: A('disappear to wales') + 0.4, t1: A('with a playstation') + 0.5, bend: 0.3}]} /></Obj>
    <Obj t0={P(A('with a playstation'))} x={1560} y={750} from="right"><Pill text="With a PlayStation" v="blue" icon={ic('pad')} /></Obj>
  </>},
  /* P17 — irresponsible, or a nation catching its breath? */
  {t0: A('is that irresponsible'), y: -30, children: <>
    <Obj t0={P(A('irresponsible'), 'slam')} x={500} y={380} from="zoom" z={3}><TF text="Irresponsible?" size={130} max={700} hot /></Obj>
    <Obj t0={P(A('or is that'))} x={960} y={380} from="pop" z={3}><Pill text="Or" v="ghost" size={34} /></Obj>
    <Obj t0={P(A('a nation catching'), 'slam')} x={1440} y={380} from="zoom" z={3}><TF text="Catching its breath?" size={100} max={720} /></Obj>
    <Obj t0={P(A('a nation catching'))} x={1440} y={520} from="up"><Pill text="A nation" v="blue" icon={ic('group')} /></Obj>
    {HAS.mist && <Obj t0={P(A('its breath') - 1.4)} x={960} y={790} from="up" z={1}><Photo src="ph/mist.jpg" w={940} h={330} t0={A('its breath') - 1.4} credit={CR.mist} dur={5} label="A NATION, CATCHING ITS BREATH" /></Obj>}
    <Obj t0={P(A('its breath') - 0.5)} x={960} y={790} from="zoom" z={3}><Breath size={280} /></Obj>
  </>},
  /* P18 — you don't have to like it… but you can't look at a 56% (ends mid-word in the VO) */
  {t0: A("you don't have to"), y: 40, children: <>
    <Obj t0={P(A("you don't have to"))} x={540} y={330} from="left"><SPill t0={P(A('like the game') + 0.4, 'strike')} text="Like the game" v="dark" icon={ic('pad')} /></Obj>
    <Obj t0={P(A('like the sickie'))} x={540} y={490} from="left"><SPill t0={P(A('like the sickie') + 0.5, 'strike')} text="Like the sickie" v="dark" icon={ic('thermo')} /></Obj>
    <Obj t0={P(A("can't look at"))} x={540} y={680} from="up"><Pill text="But you can't look at a…" v="ghost" icon={ic('eye')} /></Obj>
    <Obj t0={P(A('fifty six percent'), 'slam')} x={1350} y={470} from="zoom" z={3}><Count t0={A('fifty six percent') - 0.15} dur={0.5} to={56} fmt={(v) => '+' + Math.round(v) + '%'} size={380} color={C.red} style={hot} /></Obj>
    <Shock t0={A('fifty six percent')} x={1350} y={470} size={1000} /><Burst t0={A('fifty six percent')} color="#ff6a7e" peak={0.25} />
    <Obj t0={P(A('fifty six percent') + 0.5)} x={1350} y={740} from="up"><Src text="Bright HR · company data · sickness absence" /></Obj>
  </>},
];
