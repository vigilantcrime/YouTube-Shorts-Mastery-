import re,subprocess,json,sherpa_onnx,soundfile as sf,numpy as np
o=subprocess.run("ffmpeg -i vo.wav -af silencedetect=n=-35dB:d=0.22 -f null -",shell=True,capture_output=True,text=True).stderr
st=[float(x) for x in re.findall(r"silence_start: ([\d.]+)",o)]; en=[float(x) for x in re.findall(r"silence_end: ([\d.]+)",o)]
a,sr=sf.read("vo.wav",dtype="float32"); dur=len(a)/sr
# speech segments
sil=list(zip(st,en)); segs=[]; cur=0
for s,e in sil:
    if s>cur+0.05: segs.append((cur,s))
    cur=e
if cur<dur-0.05: segs.append((cur,dur))
d="sherpa-onnx-whisper-base.en/"
r=sherpa_onnx.OfflineRecognizer.from_whisper(encoder=d+"base.en-encoder.int8.onnx",decoder=d+"base.en-decoder.int8.onnx",tokens=d+"base.en-tokens.txt",num_threads=4)
# also high-quality 44.1k source
b,sr2=sf.read("vo.mp3",dtype="float32") if False else (None,None)
out=[];pad=0.04
for s,e in segs:
    x=a[int(max(0,s-pad)*sr):int((e+pad)*sr)]
    q=r.create_stream(); q.accept_waveform(sr,x); r.decode_stream(q)
    out.append(dict(s=max(0,s-pad),e=min(dur,e+pad),text=q.result.text.strip()))
    print(f"{s:6.2f}-{e:6.2f} {q.result.text}")
json.dump(out,open("segs.json","w"),indent=1)
