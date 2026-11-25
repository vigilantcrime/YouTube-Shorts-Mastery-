"""Vigilant Crime long-form: original music bed + cue-driven SFX + VO mix.
usage: python3 music_lf.py <cues.json> <vo.wav> <out_prefix> <dur_s>
Everything is synthesised here (numpy/scipy) — no samples, no licensed music."""
import sys, json, subprocess, re
import numpy as np, soundfile as sf
from scipy import signal

SR = 48000
cues_path, vo_path, out_prefix, DUR = sys.argv[1], sys.argv[2], sys.argv[3], float(sys.argv[4])
MODE = sys.argv[5] if len(sys.argv) > 5 else 'p1'      # 'p1' = Part 1 only, 'full' = Part 1 + Part 2
VO2_PATH = sys.argv[6] if len(sys.argv) > 6 else None
D2 = 254.8; HIT2 = 351.66
D = json.load(open(cues_path)); CUES = D['cues']; SCENES = D['scenes']; CH = D['chapters']
N = int(SR * DUR) + SR
rng = np.random.default_rng(11)
BPM = 90.0; BEAT = 60 / BPM; BAR = 4 * BEAT
END_HIT = 253.42            # the "18" slam

def m2f(m): return 440.0 * 2 ** ((m - 69) / 12)
def place(buf, x, at, g=1.0):
    i = int(round(at * SR))
    if i >= len(buf) or i + len(x) <= 0: return
    a = max(0, -i); j = min(len(buf), i + len(x)); buf[max(i, 0):j] += g * x[a:a + (j - max(i, 0))]
def placeS(buf, x, at, g=1.0, pan=0.0):
    l = np.cos((pan + 1) * np.pi / 4); r = np.sin((pan + 1) * np.pi / 4)
    place(buf[0], x, at, g * l); place(buf[1], x, at, g * r)
def sos_lp(fc, o=2): return signal.butter(o, min(0.98, fc / (SR / 2)), 'low', output='sos')
def lp(x, fc, o=2): return signal.sosfilt(sos_lp(fc, o), x)
def hp(x, fc, o=2): return signal.sosfilt(signal.butter(o, fc / (SR / 2), 'high', output='sos'), x)
def bp(x, lo, hi, o=2): return signal.sosfilt(signal.butter(o, [lo / (SR / 2), min(0.98, hi / (SR / 2))], 'band', output='sos'), x)
def env_ad(n, a, d):
    e = np.exp(-np.arange(n) / SR / d); na = max(1, int(a * SR)); e[:na] *= np.linspace(0, 1, na); return e
def tone(f, d, dec, ph=0.0):
    n = int(d * SR); it = np.arange(n) / SR; return np.sin(2 * np.pi * f * it + ph) * np.exp(-it * dec)
def mixs(*xs):
    n = max(len(x) for x in xs); o = np.zeros(n)
    for x in xs: o[:len(x)] += x
    return o
def noise(d, lo=None, hi=None):
    x = rng.standard_normal(int(d * SR))
    if lo and hi: return bp(x, lo, hi)
    if lo: return hp(x, lo)
    if hi: return lp(x, hi)
    return x

# ---------- band-limited oscillators (wavetables per octave) ----------
TS = 4096
def _tab(kind, K):
    n = np.arange(TS) / TS; x = np.zeros(TS)
    for k in range(1, K + 1):
        if kind == 'saw': x += np.sin(2 * np.pi * k * n) / k
        elif kind == 'tri' and k % 2: x += (-1) ** ((k - 1) // 2) * np.sin(2 * np.pi * k * n) / (k * k)
    return x / max(1e-9, np.abs(x).max())
TABS = {k: [_tab(k, max(1, int(min(TS / 2 - 1, 16000 / (27.5 * 2 ** (o + 1)))))) for o in range(10)] for k in ('saw', 'tri')}
def osc(kind, f, n, ph0=0.0):
    o = int(np.clip(np.floor(np.log2(max(f, 27.5) / 27.5)), 0, 9)); tab = TABS[kind][o]
    ph = (ph0 + np.arange(n) * (f / SR)) % 1.0; idx = ph * TS; i0 = idx.astype(int) % TS; fr = idx - np.floor(idx)
    return tab[i0] * (1 - fr) + tab[(i0 + 1) % TS] * fr

def sweep_noise(d, fc_of_u, bw=1.5, hop=1024):
    n = int(d * SR); x = rng.standard_normal(n + 2 * hop); out = np.zeros(n + 2 * hop); win = np.hanning(2 * hop)
    for i in range(0, n, hop):
        fc = fc_of_u(i / n); sos = signal.butter(2, [max(60.0, fc / bw) / (SR / 2), min(0.98, fc * bw / (SR / 2))], 'band', output='sos')
        out[i:i + 2 * hop] += signal.sosfilt(sos, x[i:i + 2 * hop] * win)
    return out[:n]
def make_ir(rt=2.4, pre=0.02, bright=6500):
    n = int(rt * SR); t = np.arange(n) / SR; irs = []
    for c in range(2):
        r = rng.standard_normal(n) * np.exp(-6.9 * t / rt); r = lp(r, bright); r[:int(pre * SR)] = 0; irs.append(r / np.sqrt(np.sum(r ** 2)))
    return np.array(irs)
def reverb(x, ir): return np.array([signal.fftconvolve(x, ir[c])[:len(x)] for c in range(2)])
def lufs(path):
    r = subprocess.run(['ffmpeg', '-nostats', '-i', path, '-af', 'ebur128=peak=true', '-f', 'null', '-'], capture_output=True, text=True).stderr
    m = re.findall(r'I:\s+(-?[\d.]+) LUFS', r); return float(m[-1]) if m else None

# ---------- arrangement (A minor) ----------
CHRD = {'Am': (33, [57, 60, 64]), 'F': (29, [53, 57, 60]), 'C': (36, [55, 60, 64]), 'G': (31, [55, 59, 62]), 'E': (28, [56, 59, 64]), 'Dm': (38, [53, 57, 62])}
# (start, end, name, progression, kick, snare, hats, bass_style, pad_cut)
SECT = [
    (0.0, 29.0, 'hook', ['Am', 'F', 'Am', 'E'], 1, 0, 1, 'pulse', 2400),
    (29.0, 39.4, 'tease', ['Am', 'F', 'C', 'E'], 0, 0, 0, 'long', 1500),
    (39.4, 100.9, 'numbers', ['Am', 'F', 'C', 'G'], 1, 1, 1, 'pulse', 2600),
    (100.9, 161.9, 'people', ['F', 'C', 'G', 'Am'], 1, 0, 1, 'long', 3200),
    (161.9, 222.3, 'buildup', ['Am', 'F', 'C', 'E'], 1, 1, 1, 'pulse', 3000),
    (222.3, 254.8 if MODE == 'full' else 1e9, 'verdict', ['Am', 'F', 'Dm', 'E'], 1, 1, 0, 'long', 2200),
]
if MODE == 'full':
    SECT += [
        (254.8, 301.0, 'schools', ['Am', 'Dm', 'F', 'E'], 1, 1, 1, 'pulse', 2600),
        (301.0, 306.0, 'hush', ['Am', 'F', 'C', 'E'], 0, 0, 0, 'long', 1400),
        (306.0, 332.7, 'tired', ['Am', 'F', 'Dm', 'E'], 1, 0, 0, 'long', 2200),
        (332.7, 343.2, 'alive', ['F', 'C', 'G', 'Am'], 1, 1, 1, 'pulse', 3600),
        (343.2, 347.3, 'question', ['Dm', 'Am', 'F', 'E'], 0, 0, 0, 'long', 1500),
        (347.3, 1e9, 'final', ['Am', 'F', 'C', 'E'], 1, 1, 0, 'pulse', 2600),
    ]
bus = {k: np.zeros((2, N)) for k in ('drum', 'bass', 'pad', 'arp', 'fx', 'sfx')}
def kick(v=1.0):
    n = int(0.42 * SR); it = np.arange(n) / SR; return np.sin(2 * np.pi * np.cumsum(46 + 110 * np.exp(-it * 26)) / SR) * np.exp(-it * 7.5) * v
def snare(v=1.0):
    n = int(0.3 * SR); it = np.arange(n) / SR; return (bp(rng.standard_normal(n), 1400, 7500) * np.exp(-it * 17) * 0.8 + np.sin(2 * np.pi * 190 * it) * np.exp(-it * 24) * 0.45) * v
def hat(v=1.0, open_=False):
    n = int((0.22 if open_ else 0.05) * SR); it = np.arange(n) / SR; return hp(rng.standard_normal(n), 7200) * np.exp(-it * (14 if open_ else 80)) * v

for si, (s0, s1, name, prog, kk, sn, hh, bst, cut) in enumerate(SECT):
    b0 = s0; k = 0
    while b0 < min(s1, DUR + 0.5):
        bass_m, tones = CHRD[prog[k % 4]]; k += 1
        if kk:
            for beat in ((0,) if name == 'tired' else (0, 1, 2, 3) if name == 'final' else (0, 2)): placeS(bus['drum'], kick(0.95 if name != 'tired' else 0.8), b0 + beat * BEAT, 1.0)
            if name in ('numbers', 'buildup') and k % 2 == 0: placeS(bus['drum'], kick(0.6), b0 + 2.75 * BEAT, 1.0)
        if sn:
            for beat in (1, 3): placeS(bus['drum'], snare(0.75), b0 + beat * BEAT, 1.0)
        if hh:
            for e in range(8): placeS(bus['drum'], hat(0.5 if e % 2 else 0.8, open_=(e == 7 and k % 2 == 0)), b0 + e * BEAT / 2 + (0.09 * BEAT if e % 2 else 0), 0.9, 0.25 if e % 2 else -0.25)
            if name == 'buildup':
                for e in range(16): placeS(bus['drum'], hat(0.25), b0 + e * BEAT / 4, 0.7, 0.0)
        root = m2f(bass_m)
        if bst == 'pulse':
            for e in range(8):
                if e in (0, 3, 4, 6) or (name == 'buildup' and e in (1, 5, 7)):
                    n = int(BEAT / 2 * SR * 0.92); x = np.sin(2 * np.pi * root * np.arange(n) / SR) * 0.8 + 0.35 * lp(osc('saw', root, n), 420)
                    x *= env_ad(n, 0.006, 0.20) * np.minimum(1, (n - np.arange(n)) / (0.01 * SR)); placeS(bus['bass'], x, b0 + e * BEAT / 2, 0.9, 0.0)
        else:
            n = int(BAR * SR * 0.98); x = np.sin(2 * np.pi * root * np.arange(n) / SR) * 0.5 + 0.15 * lp(osc('saw', root, n), 300)
            x *= np.minimum(1, np.arange(n) / (0.06 * SR)) * np.minimum(1, (n - np.arange(n)) / (0.12 * SR)); placeS(bus['bass'], x, b0, 0.8, 0.0)
        n = int(BAR * SR * 1.08)
        for m in tones:
            for de, pan in ((-0.0035, -0.5), (0.0035, 0.5), (0.0, 0.0)):
                x = lp(osc('saw', m2f(m) * (1 + de), n, rng.random()) * 0.5, cut) * np.minimum(1, np.arange(n) / (0.45 * SR)) * np.minimum(1, (n - np.arange(n)) / (0.35 * SR))
                placeS(bus['pad'], x, b0, 0.16, pan)
        pat = [0, 1, 2, 1, 0, 2, 1, 2, 0, 1, 2, 1, 0, 2, 1, 2] if name != 'people' else [0, 2, 1, 2, 0, 2, 1, 2]
        step = BEAT / 4 if name != 'people' else BEAT / 2
        for e, pi_ in enumerate(pat):
            m = tones[pi_ % len(tones)] + 12 + (12 if (e % 8 == 6) else 0); n = int(0.28 * SR)
            x = lp(osc('tri' if name == 'people' else 'saw', m2f(m), n) * env_ad(n, 0.002, 0.2 if name == 'people' else 0.11), 1800 if name == 'tease' else 3600)
            placeS(bus['arp'], x, b0 + e * step, 0.22 * (0.55 if name == 'tease' else 1.0) * (0.7 if e % 4 else 1.0), -0.4 + 0.8 * ((e % 4) / 3))
        b0 += BAR

def curve(points): return np.interp(np.arange(N) / SR, [p[0] for p in points], [p[1] for p in points])
p1_drum = [(0, 1.0), (28.5, 1.0), (28.9, 0.0), (39.3, 0.0), (39.4, 1.0), (100.5, 1.0), (101.0, 0.45), (161.4, 0.45), (161.9, 1.25), (221.8, 1.25), (222.3, 0.9), (252.0, 0.9), (253.2, 0.0)]
p1_bass = [(0, 1.0), (28.5, 1.0), (29.0, 0.55), (38.6, 0.55), (39.3, 0.0), (39.5, 1.0), (253.1, 1.0), (253.4, 0.0)]
p1_pad = [(0, 0.9), (29, 0.9), (39.3, 1.2), (39.5, 1.0), (101, 0.95), (162, 1.0), (222.3, 1.0), (253.3, 1.5), (END_HIT + 1.2, 1.5)]
p1_arp = [(0, 0.9), (28.5, 0.9), (29.0, 0.6), (39.3, 0.4), (39.5, 1.0), (100.5, 1.0), (101, 0.7), (161.4, 0.7), (161.9, 1.1), (222.3, 0.85), (253.2, 0.9), (253.4, 0.0)]
if MODE == 'full':
    p2_drum = [(254.7, 0.0), (255.0, 0.9), (300.5, 0.9), (301.0, 0.0), (305.9, 0.0), (306.0, 0.5), (332.2, 0.5), (332.7, 1.05), (342.8, 1.05), (343.2, 0.0), (347.2, 0.0), (347.3, 1.1), (HIT2 - 0.11, 1.1), (HIT2 - 0.1, 0.0), (DUR, 0.0)]
    p2_bass = [(254.7, 0.0), (254.8, 1.0), (300.9, 1.0), (301.0, 0.55), (305.9, 0.55), (306.0, 0.75), (332.6, 0.75), (332.7, 1.0), (342.9, 1.0), (343.2, 0.55), (347.2, 0.55), (347.3, 1.0), (HIT2 - 0.11, 1.0), (HIT2 - 0.1, 0.0), (DUR, 0.0)]
    p2_pad = [(256.0, 1.0), (300.0, 1.0), (301.0, 1.2), (306.0, 1.05), (332.0, 1.0), (332.7, 1.1), (343.0, 1.0), (343.2, 1.3), (347.2, 1.3), (347.3, 1.0), (HIT2 - 0.2, 1.5), (HIT2 + 1.4, 1.5), (DUR, 0.0)]
    p2_arp = [(254.7, 0.0), (254.8, 0.9), (300.9, 0.9), (301.0, 0.4), (305.9, 0.4), (306.0, 0.0), (332.6, 0.0), (332.7, 1.0), (342.9, 1.0), (343.2, 0.3), (347.2, 0.3), (347.3, 0.9), (HIT2 - 0.11, 0.9), (HIT2 - 0.1, 0.0), (DUR, 0.0)]
    # Part 1 tails run into Part 2 as plain continuations
    p1_drum = p1_drum + [(254.6, 0.0)]; p1_bass = p1_bass + [(254.6, 0.0)]; p1_arp = p1_arp + [(254.6, 0.0)]
    g_drum, g_bass, g_pad, g_arp = curve(p1_drum + p2_drum), curve(p1_bass + p2_bass), curve(p1_pad + p2_pad), curve(p1_arp + p2_arp)
else:
    g_drum, g_bass, g_pad, g_arp = curve(p1_drum), curve(p1_bass), curve(p1_pad + [(DUR, 0.0)]), curve(p1_arp)
for key, g in (('drum', g_drum), ('bass', g_bass), ('pad', g_pad), ('arp', g_arp)): bus[key] *= g

# ---------- FX ----------
def riser(d, lo=250, hi=9000, g=1.0):
    n = int(d * SR); x = sweep_noise(d, lambda u: lo * (hi / lo) ** (u ** 1.5)); return x * (np.linspace(0, 1, n) ** 2.2) * g
def impact(g=1.0, d=1.6, cr=0.28):
    n = int(d * SR); it = np.arange(n) / SR
    boom = np.sin(2 * np.pi * np.cumsum(34 + 90 * np.exp(-it * 9)) / SR) * np.exp(-it * 2.6)
    crash = hp(rng.standard_normal(n), 2500) * np.exp(-it * 3.2) * cr; thud = bp(rng.standard_normal(n), 90, 700) * np.exp(-it * 12) * 0.6
    ring = np.zeros(n)
    for f, dd, a in ((1760, 5, .05), (2640, 6, .04), (3520, 7, .03)): ring += np.sin(2 * np.pi * f * it) * np.exp(-it * dd) * a
    return (boom + crash + thud + ring) * g
for c in CH:
    ct = c['t']; r = riser(1.1, g=0.5); placeS(bus['fx'], r, ct - 0.8, 1.0)
placeS(bus['fx'], impact(1.0, 1.4), 1.98, 0.35)
placeS(bus['fx'], riser(2.4, g=0.6), END_HIT - 2.4, 1.0); placeS(bus['fx'], impact(1.3, 3.0), END_HIT, 1.0)
if MODE == 'full':
    placeS(bus['fx'], riser(2.6, g=0.6), HIT2 - 2.6, 1.0); placeS(bus['fx'], impact(1.4, 3.0), HIT2, 1.0)

# ---------- SFX from cues ----------
def blip(f0, f1, d=0.09):
    n = int(d * SR); it = np.arange(n) / SR; f = f0 + (f1 - f0) * np.minimum(1, it / 0.05); return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-it * 38)
PENT = [880.0, 988.0, 1175.0, 1318.0, 1480.0, 1760.0, 1976.0]
def sfx_pop(t, i):
    f = PENT[(i * 3 + int(t * 7)) % len(PENT)]; x = mixs(blip(f * 0.78, f, 0.10) * 0.55, blip(210, 130, 0.07) * 0.55, hp(noise(0.012), 3000) * 0.05)
    placeS(bus['sfx'], x, t, 0.20, rng.uniform(-0.35, 0.35))
def sfx_strike(t):
    n = int(0.3 * SR); it = np.arange(n) / SR; x = bp(rng.standard_normal(n), 1100, 7000) * np.minimum(1, it / 0.03) * np.exp(-it * 7) * (0.6 + 0.4 * np.sign(np.sin(2 * np.pi * 55 * it)))
    placeS(bus['sfx'], x, t, 0.22, -0.2); placeS(bus['sfx'], tone(300, 0.1, 30), t + 0.28, 0.1, 0.0)
def sfx_tick(t, d):
    tt = t
    while tt < t + d:
        f = 650 + 1500 * ((tt - t) / d); placeS(bus['sfx'], mixs(tone(f, 0.02, 120) * 0.8, hp(noise(0.01), 4000) * 0.1), tt, 0.16, 0.2); tt += 1 / 26
    placeS(bus['sfx'], mixs(tone(1568, 0.4, 7) * 0.5, tone(2349, 0.35, 8) * 0.3), t + d, 0.16, 0.0)
def sfx_click(t):
    x = hp(noise(0.012), 2500) * np.exp(-np.arange(int(0.012 * SR)) / SR * 300) * 0.7; placeS(bus['sfx'], x, t, 0.5); placeS(bus['sfx'], x, t + 0.09, 0.3)
    placeS(bus['sfx'], mixs(tone(1318, 0.9, 4.5) * 0.5, tone(1975, 0.9, 5) * 0.4, tone(2637, 0.7, 7) * 0.2), t + 0.1, 0.28)
def sfx_whoosh(t0, direction):
    d = 0.95; n = int(d * SR); out = sweep_noise(d, lambda u: 350 + 3200 * np.sin(np.pi * u) ** 1.5, bw=1.7) * np.sin(np.pi * np.linspace(0, 1, n)) ** 2
    pan = np.linspace(-0.7 * direction, 0.7 * direction, n); l = np.cos((pan + 1) * np.pi / 4); r = np.sin((pan + 1) * np.pi / 4)
    i = int(t0 * SR); j = min(N, i + n)
    if 0 <= i < N: bus['sfx'][0][i:j] += out[:j - i] * l[:j - i] * 0.20; bus['sfx'][1][i:j] += out[:j - i] * r[:j - i] * 0.20
def sfx_bump(t):
    placeS(bus['sfx'], impact(1.0, 1.4), t + 0.25, 0.6)
    for k, f in enumerate((1180, 1580)):
        n = int(0.09 * SR); x = tone(f, 0.09, 6) * np.minimum(1, np.arange(n) / (0.004 * SR)); placeS(bus['sfx'], x, t + 0.62 + k * 0.1, 0.22, 0.0)
    placeS(bus['sfx'], hp(noise(0.08), 1500) * np.exp(-np.arange(int(0.08 * SR)) / SR * 40) * 0.5, t + 0.6, 0.18)
def sfx_alarm(t, d):
    tt = t
    while tt < t + d:
        for k in range(4):
            n = int(0.06 * SR); x = np.sign(np.sin(2 * np.pi * 2100 * np.arange(n) / SR)) * 0.35 * np.minimum(1, (n - np.arange(n)) / (0.01 * SR)); placeS(bus['sfx'], lp(x, 5200), tt + k * 0.11, 0.28, -0.4)
        tt += 0.62
def sfx_type(t, d):
    tt = t
    while tt < t + d:
        n = int(0.02 * SR); placeS(bus['sfx'], hp(rng.standard_normal(n), 1800) * np.exp(-np.arange(n) / SR * 160), tt, 0.30, -0.25); tt += 1 / 30
npop = 0
for c in CUES:
    tc, kind, v = c[0], c[1], c[2]
    if tc > DUR - 0.05: continue
    if kind == 'pop': sfx_pop(tc, npop); npop += 1
    elif kind == 'slam': placeS(bus['sfx'], impact(1.0, 0.9, 0.12), tc, 0.40)
    elif kind == 'strike': sfx_strike(tc)
    elif kind == 'tick': sfx_tick(tc, v)
    elif kind == 'click': sfx_click(tc)
    elif kind == 'bump': sfx_bump(tc)
    elif kind == 'alarm': sfx_alarm(tc, v)
    elif kind == 'type': sfx_type(tc, v)
for i, (s0, s1) in enumerate(SCENES):
    if i: sfx_whoosh(s0 - 0.32, 1 if (i % 5) else -1)

# ---------- mix ----------
vo, sr_v = sf.read(vo_path, always_2d=True); assert sr_v == SR, sr_v
vo = vo.T.astype(np.float64); vo = np.pad(vo[:, :N], ((0, 0), (0, max(0, N - vo.shape[1]))))
if MODE == 'full':
    v2, sr2 = sf.read(VO2_PATH, always_2d=True); assert sr2 == SR
    v2 = v2.T.astype(np.float64); v2[:, -1500:] *= np.linspace(1, 0, 1500)      # the script's audio is clipped mid-word: de-click the cut
    i0 = int(round(D2 * SR)); vo[:, i0:i0 + v2.shape[1]] += v2[:, :max(0, N - i0)]
venv = np.abs(vo).max(axis=0)[::100]; venv = signal.sosfilt(signal.butter(2, 10 / (SR / 100 / 2), 'low', output='sos'), venv)       # 480 Hz envelope
thr = np.percentile(venv[venv > 1e-4], 70); x = np.clip(venv / thr, 0, 1); s = 0.0; sm = np.zeros_like(x); ka = 1 - np.exp(-1 / (0.05 * 480)); kr = 1 - np.exp(-1 / (0.45 * 480))
for i, v in enumerate(x):
    s += (v - s) * (ka if v > s else kr); sm[i] = s
sm = np.interp(np.arange(N) / SR, np.arange(len(sm)) / 480, sm)
mus = bus['drum'] * 0.62 + bus['bass'] * 0.80 + bus['pad'] * 0.95 + bus['arp'] * 0.78
IR = make_ir(2.2); mus_rev = reverb(bus['pad'].sum(0) * 0.5 + bus['arp'].sum(0) * 0.5, IR) * 0.35
fx = bus['fx'] + reverb(bus['fx'].sum(0), IR) * 0.3
sfxm = bus['sfx'] + reverb(bus['sfx'].sum(0), make_ir(1.1, 0.01, 7000)) * 0.12
bed = mus + mus_rev + fx * 0.8
# calibrate the bed against the voice: bed sits ~17 dB below the voice (integrated), ducking pulls it ~7.5 dB further under speech
sf.write(out_prefix + '_vo.wav', vo.T.astype(np.float32), SR); sf.write(out_prefix + '_bed.wav', bed.T.astype(np.float32), SR)
Lvo, Lbed = lufs(out_prefix + '_vo.wav'), lufs(out_prefix + '_bed.wav'); gbed = 10 ** ((Lvo - 17.0 - Lbed) / 20)
print('VO LUFS', Lvo, 'bed LUFS', Lbed, 'bed gain', round(20 * np.log10(gbed), 2), 'dB')
mg = 1 - (1 - 10 ** (-7.5 / 20)) * sm; sg = 1 - (1 - 10 ** (-2.5 / 20)) * sm
tail = np.clip((DUR - np.arange(N) / SR) / 0.6, 0, 1)       # gentle fade of bed/SFX at the very end
mix = vo + (bed * gbed * mg + sfxm * sg * 0.9) * tail
peak = np.abs(mix).max(); print('dry peak', round(20 * np.log10(peak), 2), 'dBFS')
sf.write(out_prefix + '_dry.wav', mix.T[: int(DUR * SR)].astype(np.float32), SR)
sf.write(out_prefix + '_bedonly.wav', (bed * gbed * tail).T[: int(DUR * SR)].astype(np.float32), SR)
import numpy as _np
bo=(bed*gbed*tail).T
for a,b,nm in ((0,29,'hook'),(29,39.4,'tease'),(39.4,100.9,'numbers'),(100.9,161.9,'people'),(161.9,222.3,'buildup'),(222.3,252,'verdict')):
    seg=bo[int(a*SR):int(b*SR)]; print(nm, round(20*_np.log10(_np.sqrt(_np.mean(seg**2))+1e-9),1),'dB rms')
print('done')
