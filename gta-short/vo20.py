import json,subprocess
segs=json.load(open("segs.json")); keep=[0,1,2,3,4,7,9,15,16]
gap={3:0.30}  # pre-drop silence after "It wasn't"
fixes={"Al,":"AI,","rockstar":"Rockstar"}
parts=[];chain="";t=0;out=[];n=0
for k,i in enumerate(keep):
    s=segs[i]; d=s["e"]-s["s"]; txt=s["text"]
    for a,b in fixes.items(): txt=txt.replace(a,b)
    out.append(dict(seg=i,start=round(t,3),end=round(t+d,3),text=txt))
    parts.append(f"[0:a]atrim={s['s']}:{s['e']},asetpts=PTS-STARTPTS,afade=t=in:d=0.015,afade=t=out:st={d-0.03:.3f}:d=0.03[a{k}]")
    chain+=f"[a{k}]"; n+=1
    if k<len(keep)-1:
        g=gap.get(i,0.07); parts.append(f"anullsrc=r=44100:cl=mono,atrim=0:{g}[g{k}]"); chain+=f"[g{k}]"; n+=1; t+=d+g
    else: t+=d
TOT=20.0; tail=TOT-t
parts.append(f"anullsrc=r=44100:cl=mono,atrim=0:{tail:.3f}[tail]"); chain+="[tail]"; n+=1
fc=";".join(parts)+";"+chain+f"concat=n={n}:v=0:a=1,loudnorm=I=-14:TP=-1.5,aresample=48000[out]"
subprocess.run(["ffmpeg","-v","error","-y","-i","vo.mp3","-filter_complex",fc,"-map","[out]","-ac","1","vo20.wav"],check=True)
json.dump(out,open("phr20.json","w"),indent=1); print("speech end",round(t,2),"tail",round(tail,2))
for o in out: print(o)
