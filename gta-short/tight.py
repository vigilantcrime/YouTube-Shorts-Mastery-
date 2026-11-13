import json,subprocess
segs=json.load(open("segs.json")); GAP=0.10; TEMPO=1.2
fixes={"Only in date":"Only In Dade","only in date":"Only In Dade","Al,":"AI,","rockstar":"Rockstar"}
parts=[];t=0;out=[]
for i,s in enumerate(segs):
    txt=s["text"]
    for a,b in fixes.items(): txt=txt.replace(a,b)
    d=s["e"]-s["s"]
    out.append(dict(start=round(t/TEMPO,3),end=round((t+d)/TEMPO,3),text=txt))
    parts.append(f"[0:a]atrim={s['s']}:{s['e']},asetpts=PTS-STARTPTS,afade=t=in:d=0.02,afade=t=out:st={d-0.03}:d=0.03[a{i}]")
    t+=d+GAP
n=len(segs)
sil="".join(f"[a{i}][g{i}]" if i<n-1 else f"[a{i}]" for i in range(n))
gaps=";".join(f"anullsrc=r=44100:cl=mono,atrim=0:{GAP}[g{i}]" for i in range(n-1))
fc=";".join(parts)+";"+gaps+";"+sil+f"concat=n={2*n-1}:v=0:a=1,atempo={TEMPO},loudnorm=I=-14:TP=-1.5[out]"
subprocess.run(["ffmpeg","-v","error","-y","-i","vo.mp3","-filter_complex",fc,"-map","[out]","-ar","48000","vo_tight.wav"],check=True)
json.dump(out,open("captions.json","w"),indent=1)
print(t/TEMPO)
