import numpy as np, soundfile as sf
from scipy import signal
SR=48000; DUR=51.0; N=int(SR*DUR); t=np.arange(N)/SR
BPM=140; B=60/BPM
DROPOUTS=[(9.85,11.9),(26.2,27.45)]; DROPS=[11.92,27.47]; IMPACTS=[0.02,2.1,23.7]
DROPOUT=DROPOUTS[0]; DROP=DROPS[0]
WHIPS=[2.51, 5.28, 9.91, 11.92, 12.84, 14.09, 19.38, 20.87, 23.13, 26.25, 27.47, 28.67, 32.9, 33.86, 39.08, 41.67, 44.46, 46.7]
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
prog=[45,41,43,40]  # A F C G (midi bass roots)
def m2f(m): return 440*2**((m-69)/12)
def saw(f,n,ph=0):
    tt=np.arange(n)/SR; return 2*((f*tt+ph)%1)-1
nbeats=int(DUR/B)+2
for k in range(nbeats):
    bt=k*B
    if bt>=DUR: break
    inout = any(a<=bt<b for a,b in DROPOUTS)
    pre = False          # hook: lighter intro (no kick until first cut)
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
for D in [x for x in DROPS+IMPACTS if x>0.9]:
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
for k in range(6): place(sfx,tone(2600+k*300,0.12,25),0.2+k*0.03,0.12)          # emblem glint
place(sfx,tone(1320,0.12,20)+tone(1980,0.12,20),2.1,0.3)                          # REAL check ding
n=int(0.35*SR); place(sfx,noise(0.35,300,3000)*np.hanning(n),3.9,0.3)             # folder slide
place(sfx,tone(660,0.08,30),7.0,0.3)                                              # pause click
for k in range(4): place(sfx,noise(0.05,1500,6000)*np.hanning(int(0.05*SR)),10.9+k*0.25,0.2)   # pencil scratches
for k in range(28): place(sfx,tone(3000,0.012,300),15.0+k*0.03,0.14)             # odometer 90.4M
place(sfx,tone(1047,0.3,8)+tone(1568,0.3,8),18.3,0.25)                            # certificate chime
n=int(0.3*SR); it=np.arange(n)/SR; place(sfx,np.sin(2*np.pi*np.cumsum(70+80*np.exp(-it*30))/SR)*np.exp(-it*14),23.7,0.6)   # LOST stamp
place(sfx,tone(2093,0.5,5)+tone(2637,0.5,5)+0.6*tone(3136,0.5,5),27.6,0.3)       # cash register
for k in range(28): place(sfx,tone(3000,0.012,300),29.6+k*0.06,0.14)             # odometer 815.7M
for t in (33.75,34.65,37.75): place(sfx,tone(1500,0.06,40),t,0.25)               # equation pops
n=int(1.6*SR); it=np.arange(n)/SR; place(sfx,np.sin(2*np.pi*np.cumsum(500+300*np.sin(it*40))/SR)*0.2*np.hanning(n),39.1,0.3)  # rewind warble
place(sfx,noise(0.03,2000,8000)*np.exp(-np.arange(int(0.03*SR))/SR*120),48.7,0.5)  # follow tap

# fade out ending
fo=np.ones(N); fo[int(50.4*SR):]=np.linspace(1,0,N-int(50.4*SR)); mus*=fo
mus/=np.abs(mus).max(); sfx/=max(1e-9,np.abs(sfx).max())
sf.write("music_jig.wav",mus.astype(np.float32),SR); sf.write("sfx_jig.wav",sfx.astype(np.float32),SR)
print("ok")
