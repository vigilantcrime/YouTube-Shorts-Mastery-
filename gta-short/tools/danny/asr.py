"""asr.py SB : word-level transcript of the voiceover per shot (sherpa-onnx zipformer transducer) -> ex/words.json"""
import sys, json, subprocess, numpy as np, sherpa_onnx
SB = sys.argv[1]; IN = SB + '/danny_in/danny.mp4'; M = SB + '/sherpa-onnx-zipformer-gigaspeech-2023-12-12'
import glob
enc = sorted(glob.glob(M + '/encoder*int8.onnx') or glob.glob(M + '/encoder*.onnx'))[0]
dec = sorted(glob.glob(M + '/decoder*.onnx'))[0]; joi = sorted(glob.glob(M + '/joiner*int8.onnx') or glob.glob(M + '/joiner*.onnx'))[0]
rec = sherpa_onnx.OfflineRecognizer.from_transducer(encoder=enc, decoder=dec, joiner=joi, tokens=M + '/tokens.txt', num_threads=2, decoding_method='greedy_search')
p = subprocess.run(['ffmpeg', '-v', 'error', '-i', IN, '-vn', '-ac', '1', '-ar', '16000', '-f', 's16le', '-'], capture_output=True)
audio = np.frombuffer(p.stdout, np.int16).astype(np.float32) / 32768
words = []
CH = 16000 * 20; HOP = 16000 * 18
t0 = 0
while t0 < len(audio):
    seg = audio[t0:t0 + CH]
    st = rec.create_stream(); st.accept_waveform(16000, seg); rec.decode_stream(st)
    r = st.result
    toks, ts = list(r.tokens), list(r.timestamps)
    # rebuild words from BPE pieces (sentencepiece '▁' marks a word start)
    cur = None
    for tk, tt in zip(toks, ts):
        T = t0 / 16000 + tt
        if tk.startswith('▁') or tk.startswith(' ') or cur is None:
            if cur: words.append(cur)
            cur = {'w': tk.replace('▁', '').strip(), 't': round(T, 2)}
        else:
            cur['w'] += tk
    if cur: words.append(cur)
    lo = t0 / 16000 + (1.0 if t0 > 0 else -1); hi = t0 / 16000 + 19.0
    words = [w for w in words if not (w.get('c') is None and (w['t'] < lo or w['t'] >= hi))] if False else words
    for w in words:
        w.setdefault('c', t0)
    t0 += HOP
# de-duplicate the 2 s overlaps: keep words in time order, drop repeats within 0.25 s
# keep each word only from the chunk whose core [start+1, start+19) contains it
words = [w for w in words if (w['t'] >= w['c'] / 16000 + (1.0 if w['c'] > 0 else -1)) and (w['t'] < w['c'] / 16000 + 19.0 or w['c'] + CH >= len(audio))]
words.sort(key=lambda w: w['t']); out = []
for w in words:
    if out and abs(w['t'] - out[-1]['t']) < 0.25 and w['w'] == out[-1]['w']: continue
    if out and w['t'] < out[-1]['t'] + 0.05 and w['w'] == out[-1]['w']: continue
    out.append(w)
json.dump(out, open(SB + '/ex/words.json', 'w'))
print('words', len(out)); print(' '.join(w['w'] for w in out[:80]))
