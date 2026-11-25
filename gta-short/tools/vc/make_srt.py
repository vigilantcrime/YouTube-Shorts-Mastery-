import json, re, difflib, sys
BASE = '/home/user/YouTube-Shorts-Mastery-/gta-short/'
D2 = 254.8
P1 = """On Thursday the 19th of November, Britain called in sick. Not a few people. Not a cheeky Friday. The alarm went off and half the country looked at it, looked at the telly, and made a decision: I'm not going in. Grand Theft Auto VI had unlocked at midnight. After thirteen years. After two delays. After a wait so long some of you went from schoolkids to mortgage holders in the gap. And on Thursday morning something very British happened. People didn't riot. They didn't camp outside the shops. They just didn't show up. Stay with me, because the sick days are only the opening. The strange part comes later: a Travelodge, a Fire Stick, and a man who walked out of court the same week the country clocked off. I promise I'll come back to that. First, I need you to picture that Thursday. An HR company called BrightHR looks after more than a million workers at about 70,000 British firms. On that morning, sickness absence on their books jumped 56% on the week before. 56%. Another firm, Deel, said leave requests for the day were up 21% on the same Thursday last year. Now, that isn't a government census. It's what those companies could see. But you and I both know what it looks like. It looks like a nation that had been waiting thirteen years for a Thursday. A poll taken just before launch found around 2.8 million UK adults planned to play on day one. One in twenty adults shaping their whole Thursday around a video game. Some did it properly: annual leave booked weeks out, the honest approach. Some were suddenly, tragically, very unwell. And if you were a boss that morning, staring at an empty desk, you probably weren't laughing. You'd have rotas to fill, calls to make, a Thursday that still needed doing. But if you were one of the people who'd finally got their hands on it, you weren't skiving. You were enjoying your life. Because here's what a lot of the coverage missed: this wasn't just people hiding under a duvet. This was a country giving itself permission. Sam from St Albans didn't mess about. He booked four days off, spent nearly £1,500 on a new set-up: new telly, custom controller, the full bunker. Then he couldn't even stay up till midnight. Set his alarm for seven and planned to lock himself away. That's not laziness. That's devotion. And then there's Kieran from Manchester. He told the BBC he was going on a pilgrimage to Wales, completely off grid for a week. His partner, he said, had been incredibly understanding, though he suspected she was questioning why their romantic getaway revolved around a PlayStation. I love that. A week in Wales, not for the hills, for Vice City. And he wasn't the only one who went all in. One couple turned it into a little holiday at home. He booked the day. She bought him a £90 PlayStation voucher. He packed her a getaway basket: Lego, colouring books, pyjamas, so she wouldn't feel left out while he disappeared into the game. That's not a national crisis. That's people trying, in their own slightly chaotic way, to be happy. And if you didn't already have the kit, good luck. In the weeks before launch, John Lewis said sales of consoles and accessories were up 62% on the year before. Currys said PlayStation 5 sales were up 149%. People weren't just buying a game; they were building a night they could disappear into. And then they broke the internet doing it. The evening before launch, Virgin Media O2 smashed its own broadband record. BT and EE said they hit their highest home broadband peak ever. One player told the BBC he was still on it in the early hours, even though he had to be up for work in five hours. "Why am I playing a game I have years to enjoy?" he said. Because that's the thing about a wait this long: when it finally arrives, five hours' sleep suddenly feels negotiable. Britain didn't queue outside Game at midnight. There was no disc to queue for. Just a download the size of a small moon, and a nation sitting in the dark waiting for a progress bar to finish, so they could finally go somewhere else. Somewhere warmer. Somewhere louder. Somewhere that wasn't the group chat or the bills or the 7am alarm. And that, if you ask me, is the real story. Not that people skipped work. That so many of them decided, at the same time, that this was worth it. Which brings me to the Prime Minister. Downing Street called the game "a British success story, made in Edinburgh." Fair enough, a huge part of it was. So would Andy Burnham be exploring Vice City with the rest of us? A spokesperson said his diary was very full. He wouldn't be playing it. Of course he wouldn't. The rest of the country had already booked the day. And if you think it was only offices that went quiet, wait till you hear about the schools, because this game is an 18."""
P2 = """I'm not turning this into a panic about kids. I want to be straight with you, but on Thursday morning, in more than 1,400 English secondary schools, about 35,000 more pupils were off than the three days before. Older boys, mostly. Some schools tried to bribe them in with voucher draws. One head teacher in Birmingham called the game the enemy. Other researchers looked at a bigger set of schools later and said, hang on: winter bugs, snow in the north. Don't overegg it. So no, the classrooms didn't collapse. But you can feel the tension, can't you? Bosses wanting bodies at desks, teachers wanting bodies in seats, and a country that for one Thursday had other plans. So what does that actually say about us? I'm going to give you my read. This is my opinion. You can tell me I'm wrong in the comments. Britain is tired. We've had years of being told to hang on: the cost of living, burnout, that quiet feeling that you're working hard and still not getting the week you were promised. Everything going up: energy, rent, the weekly shop, and the fun somehow always being the thing that has to wait. And then a game comes along that half the country has been waiting for since they were teenagers, and for once people choose the thing that makes them feel alive. Not next month. Not when things calm down. Thursday. They spend money they maybe shouldn't. They book the Thursday. They call in. They disappear to Wales with a PlayStation. Is that irresponsible, or is that a nation catching its breath? You don't have to like the game. You don't have to like the sickie. But you can't look at a 56%"""
SPOKEN = {'19th':['nineteenth'], '£1,500':['fifteen','hundred','pounds'], '70,000':['seventy','thousand'], '56%':['fifty','six','percent'], '56%.':['fifty','six','percent'], '21%':['twenty','one','percent'], '62%':['sixty','two','percent'], '149%.':['one','hundred','and','forty','nine'], '2.8':['two','point','eight'], '£90':['ninety','pound'], '1,400':['fourteen','hundred'], '35,000':['thirty','five','thousand'], '18."':['eighteen'], '18.':['eighteen'], 'VI':['six'], 'BrightHR':['bright','h','r'], 'HR':['h','r'], 'O2':['o','two'], 'EE':['e','e'], 'Currys':['curries'], 'Deel,':['deal'], 'rotas':['rotors'], 'skiving,':['skything'], 'skiving.':['skything'], 'pyjamas,':['pajamas'], 'colouring':['coloring'], 'Travelodge,':['travel','lodge'], 'set-up:':['setup'], '7am':['seven','am'], 'draws.':['drawers'], 'overegg':['overeg'], 'PlayStation':['playstation'], '5':['five'], '"Why':['why'], 'enjoy?"':['enjoy'], '"a':['a'], 'Edinburgh."':['edinburgh'], 'Burnham':['burnham'], 'Sam':['sam'], 'Kieran':['kieran']}
def nrm(s): return re.sub(r"[^a-z0-9']", '', s.lower())
def spoken_of(tok):
    if tok in SPOKEN: return SPOKEN[tok]
    t = nrm(tok); return [t] if t else []
def build(text, words, off):
    disp = text.split(); own = []; flat = []
    for i, d in enumerate(disp):
        for s in spoken_of(d): flat.append(s); own.append(i)
    asr = [nrm(w['w']) for w in words]
    sm = difflib.SequenceMatcher(None, asr, flat, autojunk=False); tm = [None] * len(flat)
    for a, b, n in sm.get_matching_blocks():
        for k in range(n): tm[b + k] = words[a + k]['on'] + off
    # interpolate gaps
    idx = [i for i, t in enumerate(tm) if t is not None]
    for i in range(len(tm)):
        if tm[i] is None:
            lo = max([j for j in idx if j < i], default=None); hi = min([j for j in idx if j > i], default=None)
            if lo is None: tm[i] = tm[hi] - 0.2 * (hi - i)
            elif hi is None: tm[i] = tm[lo] + 0.28 * (i - lo)
            else: tm[i] = tm[lo] + (tm[hi] - tm[lo]) * (i - lo) / (hi - lo)
    start = {}
    for k, o in enumerate(own):
        if o not in start: start[o] = tm[k]
    matched = len(idx) / max(1, len(flat))
    return disp, [start.get(i, None) for i in range(len(disp))], matched
def cues_from(disp, times, vo_end):
    toks = list(zip(disp, times)); sents = []; cur = []
    for d, t in toks:
        cur.append((d, t))
        if d.rstrip('"').endswith(('.', '?', '!')): sents.append(cur); cur = []
    if cur: sents.append(cur)
    def L(ws): return len(' '.join(d for d, _ in ws))
    def split_long(ws):
        if L(ws) <= 84: return [ws]
        k = -(-L(ws) // 72); target = L(ws) / k; chunks = []; cur = []; acc = 0
        for i, (d, t) in enumerate(ws):
            cur.append((d, t)); acc = L(cur)
            rem = L(ws[i + 1:]) if i + 1 < len(ws) else 0
            near = acc >= target * 0.8 and (d.endswith((',', ':', ';')) or acc >= target * 1.1)
            if near and len(chunks) < k - 1 and rem > 12: chunks.append(cur); cur = []
        if cur: chunks.append(cur)
        return chunks
    units = []
    for s_ in sents: units += split_long(s_)
    cues = []
    for u in units:
        if cues and L(cues[-1]) + 1 + L(u) <= 84 and (u[0][1] - cues[-1][-1][1]) < 1.3 and (u[-1][1] - cues[-1][0][1]) < 7.0 and not (L(cues[-1]) > 60): cues[-1] = cues[-1] + u
        else: cues.append(list(u))
    res = []
    for k, c in enumerate(cues):
        t0 = c[0][1] - 0.06; nxt = cues[k + 1][0][1] - 0.06 if k + 1 < len(cues) else vo_end
        t1 = min(nxt - 0.04, c[-1][1] + 0.6 + 0.3 * (len(c) > 6)); t1 = max(t1, t0 + 0.9)
        res.append((t0, t1, ' '.join(d for d, _ in c)))
    return res
def two_lines(s):
    if len(s) <= 42: return s
    words = s.split(); best = None
    for i in range(1, len(words)):
        a = ' '.join(words[:i]); b = ' '.join(words[i:]); sc = abs(len(a) - len(b))
        if best is None or sc < best[0]: best = (sc, a, b)
    return best[1] + '\n' + best[2]
def ts(t):
    t = max(0, t); h = int(t // 3600); m = int(t % 3600 // 60); s = t % 60; return f"{h:02d}:{m:02d}:{s:06.3f}".replace('.', ',')
def vtt_ts(t): return ts(t).replace(',', '.')
w1 = json.load(open(BASE + 'src/vc/long_words.json')); w2 = json.load(open(BASE + 'src/vc/short_words.json'))
d1, t1, m1 = build(P1, w1, 0.0); d2, t2, m2 = build(P2, w2, D2)
print('alignment coverage p1 %.1f%% p2 %.1f%%' % (100 * m1, 100 * m2))
c1 = cues_from(d1, t1, 254.12); c2 = cues_from(d2, t2, D2 + 97.9)
mode = sys.argv[1] if len(sys.argv) > 1 else 'full'
cues = c1 if mode == 'p1' else c1 + c2
srt = ''; vtt = 'WEBVTT\n\n'
for i, (a, b, s) in enumerate(cues, 1):
    srt += f"{i}\n{ts(a)} --> {ts(b)}\n{two_lines(s)}\n\n"; vtt += f"{vtt_ts(a)} --> {vtt_ts(b)}\n{two_lines(s)}\n\n"
open(BASE + f'out/vc/vc_longform_{mode}.srt', 'w').write(srt); open(BASE + f'out/vc/vc_longform_{mode}.vtt', 'w').write(vtt)
print(len(cues), 'cues;', 'longest line', max(max(len(x) for x in two_lines(s).split('\n')) for _, _, s in cues))
