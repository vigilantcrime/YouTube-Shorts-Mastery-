"""make_scenes.py SB OUT.json : explainer scene specs for every shot being replaced."""
import sys, json, re
SB, OUT = sys.argv[1], sys.argv[2]
words = json.load(open(SB + '/ex/words.json'))
shots = {int(l.split()[0]): tuple(map(int, l.split()[1:])) for l in open(SB + '/danny/inv/shots.txt')}
FIX = {'TENOR': 'TENNER', 'TENORS': 'TENNERS', 'CUE': 'QUEUE', 'SHOT': 'SHOP', 'MUMS': "MUM'S", 'RECOGNIZED': 'RECOGNISED', 'OFFENSES': 'OFFENCES',
       'MIDCUT': 'MID-CUT', 'SECONDHAND': 'SECOND-HAND', 'PRACTICED': 'PRACTISED'}
W = []
for x in words:
    w = FIX.get(x['w'], x['w']); t = x['t']
    if w == 'FIND' and 630 < t < 640: w = 'MIND'
    W.append({'w': w, 't': t})
# merge "A VOID" -> AVOID, "TWENTY S" -> TWENTIES, "NINETY S" -> NINETIES
M = []
for x in W:
    if M and M[-1]['w'] == 'A' and x['w'] == 'VOID': M[-1]['w'] = 'AVOID'; continue
    if M and x['w'] == 'S' and M[-1]['w'] in ('TWENTY', 'NINETY'): M[-1]['w'] = M[-1]['w'][:-1] + 'IES'; continue
    M.append(dict(x))
W = M
# missing word: "...FOR ABOUT SIX WEEKS" (ASR dropped SIX at a chunk edge)
for i, x in enumerate(W):
    if x['w'] == 'WEEKS' and 162 < x['t'] < 164 and W[i - 1]['w'] == 'ABOUT': W.insert(i, {'w': 'SIX', 't': round(x['t'] - 0.25, 2)}); break

NUM = {'TWO': 2, 'THREE': 3, 'FOUR': 4, 'FIVE': 5, 'SIX': 6, 'SEVEN': 7, 'EIGHT': 8, 'NINE': 9, 'TEN': 10, 'ELEVEN': 11, 'TWELVE': 12,
       'FIFTEEN': 15, 'SEVENTEEN': 17, 'TWENTY': 20, 'FORTY': 40, 'FIFTY': 50, 'SIXTY': 60}
NAMES = {'DANNY', "DANNY'S", 'JORDAN', "JORDAN'S", 'KYLE', "KYLE'S", 'LEAH', 'TONY', "TONY'S", 'MUM', "MUM'S"}
RED = {'HATES', 'CRIED', 'SCARED', 'TERRIBLE', 'MORTIFIED', 'WORSE', 'ANGRY', 'TROUBLE', 'QUIT', 'CLUELESS', 'RUDE', 'OVERPRICED', 'BUTCHERED', 'AVOID',
       'FRIGHTENED', 'HIDING', 'NOBODY', 'NOTHING', 'NEVER', 'WITNESS', 'CAMERA', 'LINE', 'FAMOUS', 'RICH', 'STRANGER', 'STRANGERS', 'NOTICE', 'PULL', 'GRAB', 'DRAG'}
YEL = {'SUCCESSFUL', 'BRITAIN', 'FREE', 'CHEAP', 'GOOD', 'BEST', 'FIRST', 'CLIPPERS', 'SHOP', 'TIN', 'CAR', 'QUEUE', 'LOVES', 'HAIR', 'FADE', 'TWICE', 'TEA',
       'FILMING', 'WATCH', 'YES', 'CHANGE', 'SATURDAYS', 'CHAIR', 'CHAIRS', 'REACHES', 'BACK', 'CLOSED', 'ANSWER', 'TILL', 'REVIEWS', 'COAST', 'GOOD', 'NEWS', 'SEVENTEEN'}

def scene_words(s, e):
    return [dict(x) for x in W if s / 25 <= x['t'] < (e + 1) / 25]

def numerals(ws):
    out = []; i = 0
    while i < len(ws):
        w = ws[i]['w']
        if w in NUM:
            v = NUM[w]; j = i + 1
            if w in ('TWENTY', 'FORTY', 'FIFTY', 'SIXTY') and j < len(ws) and ws[j]['w'] in NUM and NUM[ws[j]['w']] < 10: v += NUM[ws[j]['w']]; j += 1
            if j < len(ws) and ws[j]['w'] == 'HUNDRED': v *= 100; j += 1
            txt = str(v)
            if j < len(ws) and ws[j]['w'] == 'QUID': txt = '£' + txt; j += 1
            if j + 1 < len(ws) and ws[j]['w'] == 'YEAR' and ws[j + 1]['w'] == 'OLD': txt += '-YEAR-OLD'; j += 2
            out.append({'w': txt, 't': ws[i]['t'], 'num': True}); i = j; continue
        out.append(dict(ws[i])); i += 1
    return out

def colour(w):
    base = re.sub(r"[^A-Z0-9'£-]", '', w['w'])
    if w.get('num') or base in NAMES or base in YEL: return 'y'
    if base in RED: return 'r'
    return None

def phrases_of(ws, s, dur):
    ph = []; cur = []
    for k, x in enumerate(ws):
        gap = x['t'] - ws[k - 1]['t'] if k else 0
        if cur and (len(cur) >= 6 or sum(len(c['w']) + 1 for c in cur) > 30 or gap > 0.6): ph.append(cur); cur = []
        cur.append(x)
    if cur: ph.append(cur)
    # merge lonely single words into a neighbour
    i = 0
    while i < len(ph):
        if len(ph) > 1 and len(ph[i]) == 1 and not ph[i][0].get('num'):
            if i > 0 and len(ph[i - 1]) <= 6: ph[i - 1] += ph[i]; ph.pop(i); continue
            if i + 1 < len(ph) and len(ph[i + 1]) <= 6: ph[i + 1] = ph[i] + ph[i + 1]; ph.pop(i); continue
        i += 1
    # drop a sentence spill at the very end (it continues in the next shot)
    if len(ph) > 1 and round(ph[-1][0]['t'] * 25) - s > dur - 14 and len(ph[-1]) <= 2: ph.pop()
    out = []
    for i, p in enumerate(ph):
        t0 = max(0, round(p[0]['t'] * 25) - s); t1 = (round(ph[i + 1][0]['t'] * 25) - s) if i + 1 < len(ph) else dur
        out.append({'t0': t0, 't1': max(t1, t0 + 8), 'words': [{'t': max(0, round(x['t'] * 25) - s), 'w': x['w'], **({'c': colour(x)} if colour(x) else {})} for x in p]})
    return out

def take(ws, seq):
    """remove the word sequence seq (space separated) from ws and return (rest, taken)"""
    toks = seq.split(); n = len(toks)
    for i in range(len(ws) - n + 1):
        if [x['w'] for x in ws[i:i + n]] == toks: return ws[:i] + ws[i + n:], ws[i:i + n]
    raise SystemExit(f'not found: {seq}')

PULLS = [(0, 0), (4187, 1), (8475, 2), (12800, 3), (15125, 4), (17862, 5)]
def pulls_at(n): return [p for f, p in PULLS if f <= n][-1]

C = lambda *a: list(a)
H = {
 0: dict(layout='crab', crab='intro'),
 3: dict(layout='crab', crab='pull'),
 6: dict(layout='cast', cast=C('danny_hivis'), icon='box', label='NIGHT SHIFT · 22:00–06:00'),
 7: dict(layout='object', icon='meal', label='THE BREAK ROOM'),
 8: dict(layout='cast', cast=C('danny_hivis'), moods=C('blank')),
 9: dict(layout='cast', cast=C('danny'), icon='house', label="MUM'S KITCHEN · SUNDAYS", moods=C('smile')),
 10: dict(layout='cast', cast=C('kid'), icon='clippers', label="AGED 15 · UNCLE'S OLD CLIPPERS", moods=C('smile')),
 11: dict(layout='cast', cast=C('lad1', 'lad2', 'lad3'), moods=C('smile', 'grin', 'smile')),
 12: dict(layout='cast', cast=C('mum'), icon='mug', moods=C('smile')),
 14: dict(layout='stat', icon='tin', stat={'value': 6, 'suffix': ' YEARS', 'label': 'EVERY WAGE PACKET · INTO THE TIN'}),
 16: dict(layout='cast', cast=C('danny_hivis', 'kyle'), label='THE WAREHOUSE · BREAK ROOM'),
 18: dict(layout='cast', cast=C('danny_hivis', 'kyle'), icon='shop', moods=C('neutral', 'grin')),
 19: dict(layout='object', icon='shop', chapter={'num': 'CHAPTER 02', 'title': 'THE SHOP', 'to': 80}),
 21: dict(layout='cast', cast=C('danny'), icon='tin', moods=C('o')),
 22: dict(layout='object', icon='letter', label='NOTICE'),
 23: dict(layout='cast', cast=C('mum'), moods=C('sad')),
 24: dict(layout='stat', icon='shop', stat={'value': 3, 'suffix': ' SHOPS', 'label': 'OPENED AND CLOSED · SAME STREET · 5 YEARS'}),
 27: dict(layout='object', icon='till', label='SECOND-HAND'),
 31: dict(layout='cast', cast=C('danny', 'mum'), icon='phone', moods=C('worried', 'smile')),
 32: dict(layout='cast', cast=C('mum'), icon='chair', label='FREE CUT · IN THE WINDOW', moods=C('smile')),
 33: dict(layout='cast', cast=C('lad1', 'lad2', 'dad', 'lad3'), label='SATURDAY MORNINGS', moods=C('smile', 'neutral', 'smile', 'grin')),
 34: dict(layout='cast', cast=C('danny'), icon='clippers', moods=C('smile')),
 35: dict(layout='stat', icon='star', stat={'value': 6, 'suffix': ' WEEKS', 'label': 'THE BEST THING THAT EVER HAPPENED TO HIM'}),
 36: dict(layout='phone', cast=C('danny'), phone='reviews', moods=C('worried'), chapter={'num': 'CHAPTER 03', 'title': 'THE REVIEWS', 'to': 63},
         stamp={'n': 'PULL N°1', 'text': 'FAKE REVIEWS', 'from': 38, 'to': 108}),
 45: dict(layout='cast', cast=C('danny'), icon='shop', label="TONY'S · FAR END OF THE HIGH STREET", moods=C('worried')),
 46: dict(layout='cast', cast=C('tony', 'danny'), icon='broom', bubbles=[('tony', "YOU'VE HAD THE REVIEWS THEN")], moods=C('neutral', 'o'), tags=C('TONY · 60-SOMETHING', '')),
 47: dict(layout='cast', cast=C('tony'), icon='broom'),
 52: dict(layout='quote', who='tony', quote="I THOUGHT IT WAS THE BLOKE WHO HAD THE SHOP BEFORE ME SPENT YEARS HATING HIM TURNED OUT HE'D MOVED TO SPAIN THEN HE SAID IT'S NOT ALWAYS THE COMPETITION SON AFTER TIME YOU NEVER FIND OUT WHO"),
 53: dict(layout='cast', cast=C('danny'), moods=C('angry')),
 55: dict(layout='cast', cast=C('danny'), icon='clippers', moods=C('blank')),
 61: dict(layout='cast', cast=C('danny'), icon='car', moods=C('grin')),
 62: dict(layout='cast', cast=C('danny', 'mum'), icon='mug', label='THE COAST · FIRST SUNDAY', moods=C('smile', 'smile')),
 64: dict(layout='object', icon='car', label='DAY 4'),
 65: dict(layout='object', icon='car_scratch', stamp={'n': 'PULL N°2', 'text': 'KEYED CAR', 'from': 2, 'to': 80}),
 66: dict(layout='object', icon='car_scratch'),
 70: dict(layout='object', icon='cctv'),
 72: dict(layout='object', icon='cctv'),
 73: dict(layout='stat', icon='car', stat={'value': 400, 'prefix': '£', 'label': 'THE RESPRAY · OUT OF HIS OWN POCKET'}),
 74: dict(layout='cast', cast=C('danny'), moods=C('blank')),
 75: dict(layout='cast', cast=C('leah', 'danny'), bubbles=[('danny', "HE DIDN'T WANT TO BE THE BLOKE MOANING ABOUT HIS NICE NEW CAR")], moods=C('worried', 'neutral')),
 76: dict(layout='quote', who='leah', quote="SO YOU'D RATHER SOMEONE JUST GETS AWAY WITH IT"),
 77: dict(layout='cast', cast=C('danny'), moods=C('blank')),
 78: dict(layout='cast', cast=C('jordan'), tags=C('JORDAN, 17 · LEFT SCHOOL WITH NOTHING'), chapter={'num': 'CHAPTER 06', 'title': 'THE LAD ON THE WALL', 'to': 70}),
 79: dict(layout='cast', cast=C('danny'), moods=C('angry')),
 81: dict(layout='cast', cast=C('jordan'), icon='broom'),
 82: dict(layout='cast', cast=C('danny', 'jordan'), icon='clippers', give=True, label='One slow Tuesday.', moods=C('smile', 'o')),
 83: dict(layout='cast', cast=C('jordan'), moods=C('worried')),
 85: dict(layout='cast', cast=C('jordan'), label='MON · WED · THU · SAT', moods=C('smile')),
 86: dict(layout='cast', cast=C('danny', 'jordan'), icon='cash', give=True, moods=C('smile', 'grin')),
 87: dict(layout='cast', cast=C('jordan', 'danny'), bubbles=[('jordan', "YOU'RE GOOD THOUGH"), ('jordan', 'LIKE ACTUALLY GOOD PEOPLE WOULD WATCH THAT')], moods=C('grin', 'neutral')),
 88: dict(layout='phone', cast=C('danny'), phone='record', moods=C('smile')),
 90: dict(layout='cast', cast=C('kid', 'danny'), icon='clippers', label='FIRST PROPER HAIRCUT', moods=C('worried', 'smile')),
 95: dict(layout='phone', cast=C('danny'), phone='comments', moods=C('blank')),
 96: dict(layout='cast', cast=C('lad1', 'lad2', 'kyle'), tags=C('SCHOOL', 'FAMILY', 'WORK')),
 97: dict(layout='phone', cast=C('danny'), phone='profiles', moods=C('worried')),
 99: dict(layout='cast', cast=C('kyle'), icon='phone', moods=C('blank')),
 101: dict(layout='phone', cast=C('danny'), phone='call', chapter={'num': 'CHAPTER 08', 'title': 'THE LETTER', 'to': 72}),
 105: dict(layout='cast', cast=C('mum', 'jordan'), icon='mug', moods=C('smile', 'grin')),
 106: dict(layout='cast', cast=C('mum'), icon='clock', label='03:10', moods=C('worried')),
 109: dict(layout='cast', cast=C('mum'), moods=C('sad')),
 112: dict(layout='phone', cast=C('danny'), phone='contact', moods=C('blank')),
 113: dict(layout='cast', cast=C('danny'), moods=C('worried')),
 116: dict(layout='object', icon='car', label='2 STREETS AWAY'),
 117: dict(layout='quote', who='leah', quote="YOU'VE STOPPED TELLING ME WHEN SOMETHING GOOD HAPPENS"),
 118: dict(layout='cast', cast=C('danny'), moods=C('sad')),
 119: dict(layout='cast', cast=C('jordan', 'regular'), icon='clippers', label='NOVEMBER · FIRST PAYING CUSTOMER', moods=C('worried', 'neutral')),
 120: dict(layout='cast', cast=C('regular', 'jordan'), icon='cash', give=True, bubbles=[('regular', 'KEEP THE CHANGE')], moods=C('smile', 'grin')),
 122: dict(layout='phone', cast=C('jordan'), phone='review1', moods=C('sad'), stamp={'n': 'PULL N°5', 'text': 'JORDAN', 'from': -20, 'to': 40}),
 123: dict(layout='cast', cast=C('danny', 'jordan'), moods=C('neutral', 'sad')),
 124: dict(layout='object', icon='chair'),
 126: dict(layout='cast', cast=C('jordan', 'danny'), bubbles=[('jordan', "DOESN'T IT GET TO YOU"), ('danny', "YEAH IT DOES YOU JUST DON'T LET IT DECIDE ANYTHING FOR YOU")], moods=C('sad', 'smile')),
 128: dict(layout='object', icon='shop', label='17:55', chapter={'num': 'CHAPTER 10', 'title': 'FIVE TO SIX', 'to': 75}),
 130: dict(layout='object', icon='box', label='THE WAREHOUSE'),
 131: dict(layout='cast', cast=C('kyle', 'danny'), moods=C('blank', 'neutral')),
 134: dict(layout='object', icon='chair', label='CLOSED'),
 135: dict(layout='cast', cast=C('danny', 'kyle'), icon='clippers', moods=C('smile', 'grin')),
 137: dict(layout='quote', who='kyle', quote="I ALWAYS THOUGHT YOU'D COME BACK YOU KNOW I THOUGHT WE'D STILL BE THERE TOGETHER WHEN WE WERE 40", moods=['sad']),
 140: dict(layout='crab', crab='pull'),
 142: dict(layout='cast', cast=C('jordan', 'kyle'), icon='clippers', label='Spring. Jordan teaches him a fade.', moods=C('neutral', 'o')),
 143: dict(layout='stat', icon='chair', stat={'value': 4, 'suffix': ' CHAIRS', 'label': 'THE SHOP · NOW'}),
 145: dict(layout='cast', cast=C('mum'), icon='mug', moods=C('grin')),
 148: dict(layout='crab', crab='reach'),
 149: dict(layout='cast', cast=C('danny', 'jordan'), icon='clippers', give=True, moods=C('smile', 'grin')),
}
SELECT = [10, 14, 21, 23, 27, 33, 34, 36, 46, 47, 55, 61, 66, 73, 75, 81, 82, 83, 86, 87, 90, 95, 97, 99, 101, 105, 106, 109,
          112, 113, 118, 119, 120, 122, 123, 126, 135, 142, 145, 149]
SUB = {33: (3760, 3826)}
H[33] = dict(layout='cast', cast=C('lad1', 'lad2', 'dad', 'lad3'), label='SATURDAY MORNINGS', moods=C('smile', 'neutral', 'smile', 'grin'))
scenes = []
for sid in SELECT:
    h = H[sid]
    s, e = SUB.get(sid, shots[sid]); dur = e - s + 1
    ws = numerals(scene_words(s, e))
    sc = {'sid': sid, 'start': s, 'dur': dur, 'pulls': pulls_at(s), 'hud': 622 <= s < 20862, 'layout': h['layout']}
    steps = [[f - s, p] for f, p in PULLS if s < f <= e]
    if steps: sc['pullSteps'] = steps
    for k in ('cast', 'moods', 'tags', 'icon', 'give', 'label', 'stat', 'crab', 'chapter', 'stamp'):
        if k in h: sc[k] = h[k]
    if 'phone' in h: sc['phone'] = {'kind': h['phone']}
    if h['layout'] == 'quote':
        ws, q = take(ws, h['quote']) if h['quote'].split()[0] in [x['w'] for x in ws] else (ws, [])
        sc['quote'] = {'who': h['who'], 'words': [{'t': max(0, round(x['t'] * 25) - s), 'w': x['w']} for x in q]}
        sc['cast'] = [h['who']]
        if 'moods' in h: sc['moods'] = h['moods']
    bl = []
    for who, seq in h.get('bubbles', []):
        ws, q = take(ws, seq)
        qq = [{'t': max(0, round(x['t'] * 25) - s), 'w': x['w']} for x in q]
        bl.append({'who': who, 't0': qq[0]['t'], 't1': qq[-1]['t'] + 10, 'words': qq})
    if bl: sc['bubbles'] = bl
    ph = phrases_of(ws, s, dur)
    if 'chapter' in h: ph = [p for p in ph if p['t0'] >= h['chapter']['to'] - 4]
    sc['phrases'] = ph
    scenes.append(sc)
json.dump({'scenes': scenes}, open(OUT, 'w'))
print('scenes', len(scenes), 'frames', sum(s['dur'] for s in scenes))
