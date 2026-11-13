import numpy as np, soundfile as sf
from scipy import signal
SR=48000; DUR=57.7; N=int(SR*DUR); t=np.arange(N)/SR
BPM=88; B=60/BPM
DROPOUTS=[(15.24,15.45),(31.57,34.2),(51.13,52.6)]; DROPS=[34.2,52.6]; IMPACTS=[3.25,17.45]
DROPOUT=DROPOUTS[0]; DROP=DROPS[0]
WHIPS=[6.87,8.53,11.75,22.75,25.04,28.27,35.89,41.37,47.6,51.13,53.73]
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
prog=[52,48,55,50]  # A F C G (midi bass roots)
def m2f(m): return 440*2**((m-69)/12)
def saw(f,n,ph=0):
    tt=np.arange(n)/SR; return 2*((f*tt+ph)%1)-1
nbeats=int(DUR/B)+2
for k in range(nbeats):
    bt=k*B
    if bt>=DUR: break
    inout = any(a<=bt<b for a,b in DROPOUTS)
    pre = bt<4.04          # hook: lighter intro (no kick until first cut)
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
# self-checkout error beeps
for t in (4.15,4.45,4.75): place(sfx,tone(1250,0.16,6)+0.5*tone(940,0.16,6),t,0.35)
# record scratch (comedic stop) at "same woman"
n=int(0.35*SR); it=np.arange(n)/SR; sc=signal.lfilter(*signal.butter(2,[300/(SR/2),3000/(SR/2)],'band'),rng.standard_normal(n))*np.abs(np.sin(2*np.pi*9*it))*np.exp(-it*4); place(sfx,sc,15.3,0.6)
# candles blown out
n=int(0.5*SR); place(sfx,signal.lfilter(*signal.butter(2,[200/(SR/2),2500/(SR/2)],'band'),rng.standard_normal(n))*np.hanning(n),11.1,0.35)
# glass clink "twice"
place(sfx,tone(2650,0.6,7)+0.6*tone(3970,0.6,9),17.15,0.35)
# odometer ticks
for k in range(24): place(sfx,tone(3000,0.015,300),22.8+k*0.045,0.2)
# CCTV servo whirr + camera wall clicks
n=int(0.6*SR); it=np.arange(n)/SR; place(sfx,np.sign(np.sin(2*np.pi*(180+80*it)*it))*0.3*np.hanning(n),31.6,0.25)
for k in range(10): place(sfx,tone(1800,0.03,120),32.75+k*0.07+rng.random()*0.03,0.25)
# cha-ching (money)
place(sfx,tone(2093,0.5,5)+tone(2637,0.5,5)+0.6*tone(3136,0.5,5),34.25,0.35)
# pendulum tick-tock
for k in range(6): place(sfx,tone(2400 if k%2 else 1800,0.03,150),44.35+k*0.37,0.3)
# mirror squeak while writing
n=int(1.0*SR); it=np.arange(n)/SR; place(sfx,np.sin(2*np.pi*(900+300*np.sin(it*14))*it)*0.15*np.hanning(n),54.0,0.3)

# fade out ending
fo=np.ones(N); fo[int(56.6*SR):]=np.linspace(1,0,N-int(56.6*SR)); mus*=fo
mus/=np.abs(mus).max(); sfx/=max(1e-9,np.abs(sfx).max())
sf.write("music_sin.wav",mus.astype(np.float32),SR); sf.write("sfx_sin.wav",sfx.astype(np.float32),SR)
print("ok")
