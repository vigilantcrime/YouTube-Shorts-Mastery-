import numpy as np, soundfile as sf
from scipy import signal
SR=48000; DUR=69.7; N=int(SR*DUR); t=np.arange(N)/SR
BPM=120; B=60/BPM
DROPOUTS=[(35.53,36.71),(42.27,43.45)]; DROPS=[43.45]; IMPACTS=[6.15,16.25,59.75]
DROPOUT=DROPOUTS[0]; DROP=DROPS[0]
WHIPS=[4.42,6.98,9.22,14.26,17.42,22.45,26.57,29.71,32.81,36.71,40.94,47.79,51.58,53.35,56.2,61.88,65.02]
rng=np.random.default_rng(7)
def env(n,a,d):
    e=np.ones(n); na=int(a*SR); e[:na]=np.linspace(0,1,na) if na else 1
    e*=np.exp(-np.arange(n)/SR/d); return e
def place(buf,x,at,g=1.0):
    i=int(at*SR); j=min(N,i+len(x)); 
    if i<N: buf[i:j]+=g*x[:j-i]
mus=np.zeros(N); sfx=np.zeros(N)
# kick
kn=int(0.35*SR); kt=np.arange(kn)/SR; f=45+120*np.exp(-kt*28); kick=np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-kt*7)
# hat
hn=int(0.06*SR); hat=signal.lfilter(*signal.butter(2,7000/(SR/2),'high'),rng.standard_normal(hn))*np.exp(-np.arange(hn)/SR*60)
# snare/clap
sn=int(0.25*SR); snare=signal.lfilter(*signal.butter(2,[1200/(SR/2),6000/(SR/2)],'band'),rng.standard_normal(sn))*np.exp(-np.arange(sn)/SR*18)
prog=[43,38,40,36]  # A F C G (midi bass roots)
def m2f(m): return 440*2**((m-69)/12)
def saw(f,n,ph=0):
    tt=np.arange(n)/SR; return 2*((f*tt+ph)%1)-1
nbeats=int(DUR/B)+2
for k in range(nbeats):
    bt=k*B
    if bt>=DUR: break
    inout = any(a<=bt<b for a,b in DROPOUTS)
    pre = bt<0.5          # hook: lighter intro (no kick until first cut)
    bar=k//4; root=prog[bar%4]
    if not inout and not pre: place(mus,kick,bt,0.9)
    if not inout: place(mus,hat,bt+B/2,0.25)
    if not inout and not pre and k%2==1: place(mus,snare,bt,0.35)
    # bass 8ths
    if not inout:
        for h in (0,0.5):
            n=int(B/2*SR*0.95); x=saw(m2f(root),n)+0.5*saw(m2f(root)*1.003,n)
            x=signal.lfilter(*signal.butter(2,(500 if not pre else 250)/(SR/2)),x)*env(n,0.004,0.18)
            place(mus,x,bt+h*B,0.35)
# pad (always on, quieter in dropout)
padn=N; pad=np.zeros(N)
for bar in range(int(DUR/(4*B))+1):
    root=prog[bar%4]; s=bar*4*B; n=int(4*B*SR)
    chord=[root+24,root+28 if root in(41,48) else root+27,root+31]
    x=sum(saw(m2f(m),n,rng.random())+saw(m2f(m)*1.004,n,rng.random()) for m in chord)
    x=signal.lfilter(*signal.butter(2,1800/(SR/2)),x)*np.minimum(1,np.minimum(np.arange(n)/(0.08*SR),(n-np.arange(n))/(0.08*SR)))
    place(pad,x,s,0.05)
mask=np.ones(N)
for a,b in DROPOUTS: mask[int(a*SR):int(b*SR)]=0.35
mus+=pad*mask
# sfx: whooshes (filtered noise sweep, 0.25s centred on cut)
for w in WHIPS:
    n=int(0.3*SR); x=rng.standard_normal(n); fc=np.linspace(800,6000,n)
    y=np.zeros(n); b,a=signal.butter(2,[300/(SR/2),2500/(SR/2)],'band'); y=signal.lfilter(b,a,x)
    e=np.sin(np.linspace(0,np.pi,n))**2; place(sfx,y*e,w-0.15,0.35)
# riser into drop
for D in DROPS+IMPACTS:
    n=int(0.9*SR); x=rng.standard_normal(n); y=signal.lfilter(*signal.butter(2,[2000/(SR/2),9000/(SR/2)],'band'),x)*np.linspace(0,1,n)**3
    place(sfx,y,D-0.9,0.25)
# impact on drop
n=int(1.2*SR); it=np.arange(n)/SR; boom=np.sin(2*np.pi*np.cumsum(38+60*np.exp(-it*10))/SR)*np.exp(-it*3)
crash=signal.lfilter(*signal.butter(2,3000/(SR/2),'high'),rng.standard_normal(n))*np.exp(-it*4)
for D in DROPS: place(sfx,boom+0.25*crash,D,0.9)
for D in IMPACTS: place(sfx,boom+0.25*crash,D,0.6)
# small pop for CTA heart + type ticks
for k,tt in enumerate([]):
    n=int(0.03*SR); place(sfx,signal.lfilter(*signal.butter(2,3000/(SR/2),'high'),rng.standard_normal(n))*np.exp(-np.arange(n)/SR*120),tt,0.3)


def tone(fq,d,dec): n=int(d*SR); it=np.arange(n)/SR; return np.sin(2*np.pi*fq*it)*np.exp(-it*dec)
def noise(d,lo,hi): n=int(d*SR); return signal.lfilter(*signal.butter(2,[lo/(SR/2),hi/(SR/2)],'band'),rng.standard_normal(n))
# comic "pow" pops on the 3 panels
for t in (9.25,9.65,10.4): place(sfx,noise(0.12,600,4000)*np.exp(-np.arange(int(0.12*SR))/SR*30),t,0.4)
# scope beep
for t in (11.1,11.5,13.6): place(sfx,tone(1600,0.08,30),t,0.25)
# dashcam beep
place(sfx,tone(880,0.1,20),14.3,0.25)
# teacup clink + ice rattle
place(sfx,tone(3200,0.5,9)+0.5*tone(4700,0.5,12),29.8,0.3)
for k in range(8): place(sfx,tone(2200+rng.random()*1500,0.04,80),32.9+k*0.06,0.2)
# sad trombone-ish for "you will cry"
for k,fq in enumerate((392,370,349,330)): n=int(0.28*SR); it=np.arange(n)/SR; place(sfx,np.sign(np.sin(2*np.pi*fq*it))*0.3*np.exp(-it*3),35.6+k*0.26,0.35)
# funeral organ chord
n=int(1.1*SR); it=np.arange(n)/SR; org=sum(np.sin(2*np.pi*fq*it) for fq in (130.8,164.8,196,261.6))*np.minimum(1,it*8)*np.exp(-it*1.2); place(sfx,org,42.3,0.25)
# rain bed under rule 5 window
i0=int(43.45*SR); i1=int(45.7*SR); r=noise((i1-i0)/SR,1500,9000)*np.linspace(1,0,i1-i0)**0.5; sfx[i0:i1]+=0.15*r
# coin ching + register
place(sfx,tone(2637,0.6,6)+tone(3520,0.6,7),51.65,0.35)
place(sfx,tone(2093,0.5,5)+tone(2637,0.5,5)+0.6*tone(3136,0.5,5),53.4,0.3)
# slot reel ticks + jackpot ding
for k in range(40): place(sfx,tone(2600,0.012,300),61.95+k*0.07,0.18)
for k,fq in enumerate((1047,1319,1568,2093)): place(sfx,tone(fq,0.25,8),64.3+k*0.08,0.25)
# letterbox flap
place(sfx,noise(0.15,200,1500)*np.exp(-np.arange(int(0.15*SR))/SR*25),65.2,0.5)

# fade out ending
fo=np.ones(N); fo[int(68.8*SR):]=np.linspace(1,0,N-int(68.8*SR)); mus*=fo
mus/=np.abs(mus).max(); sfx/=max(1e-9,np.abs(sfx).max())
sf.write("music_brit.wav",mus.astype(np.float32),SR); sf.write("sfx_brit.wav",sfx.astype(np.float32),SR)
print("ok")
