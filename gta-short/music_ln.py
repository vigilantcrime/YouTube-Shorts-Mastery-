import numpy as np, soundfile as sf
from scipy import signal
SR=48000; DUR=30.1; N=int(SR*DUR); t=np.arange(N)/SR
BPM=96; B=60/BPM
DROPOUTS=[(15.01,16.89)]; DROPS=[16.89]; IMPACTS=[14.44]
DROPOUT=DROPOUTS[0]; DROP=DROPS[0]
WHIPS=[0.73,3.73,8.37,13.65,18.93,20.49,24.89]
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
prog=[50,46,53,48]  # A F C G (midi bass roots)
def m2f(m): return 440*2**((m-69)/12)
def saw(f,n,ph=0):
    tt=np.arange(n)/SR; return 2*((f*tt+ph)%1)-1
nbeats=int(DUR/B)+2
for k in range(nbeats):
    bt=k*B
    if bt>=DUR: break
    inout = any(a<=bt<b for a,b in DROPOUTS)
    pre = bt<3.73          # hook: lighter intro (no kick until first cut)
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
for k,tt in enumerate([25.62,25.72,25.82,25.92]):
    n=int(0.03*SR); place(sfx,signal.lfilter(*signal.butter(2,3000/(SR/2),'high'),rng.standard_normal(n))*np.exp(-np.arange(n)/SR*120),tt,0.3)
n=int(0.15*SR); place(sfx,np.sin(2*np.pi*880*np.arange(n)/SR)*np.exp(-np.arange(n)/SR*25),26.05,0.25)

# heartbeat (shot 7), lub-dub
for b in [12.49,12.92,13.29,13.59]:
    for off,g in ((0,1.0),(0.14,0.7)):
        n=int(0.18*SR); it=np.arange(n)/SR; x=np.sin(2*np.pi*np.cumsum(55+25*np.exp(-it*30))/SR)*np.exp(-it*22); place(sfx,x,b+off,0.9*g)
# CRT power-off zip
n=int(0.5*SR); it=np.arange(n)/SR; x=np.sin(2*np.pi*np.cumsum(9000*np.exp(-it*9)+80)/SR)*np.exp(-it*6); place(sfx,x,15.01,0.35)
# neon buzz on "pink neon"
n=int(1.0*SR); it=np.arange(n)/SR; x=signal.lfilter(*signal.butter(2,[100/(SR/2),400/(SR/2)],'band'),np.sign(np.sin(2*np.pi*120*it)))*np.exp(-it*2.5); place(sfx,x,16.89,0.25)
# clock tick (bedroom)
for k in range(6):
    n=int(0.02*SR); place(sfx,signal.lfilter(*signal.butter(2,4000/(SR/2),'high'),rng.standard_normal(n))*np.exp(-np.arange(n)/SR*200),0.9+k*0.5,0.35)
# accept click + whip pan whoosh
n=int(0.04*SR); place(sfx,signal.lfilter(*signal.butter(2,2500/(SR/2),'high'),rng.standard_normal(n))*np.exp(-np.arange(n)/SR*90),23.77,0.5)
n=int(0.35*SR); x=signal.lfilter(*signal.butter(2,[400/(SR/2),5000/(SR/2)],'band'),rng.standard_normal(n))*np.sin(np.linspace(0,np.pi,n))**2; place(sfx,x,24.05,0.6)
# rain bed in the alley
i0=int(24.89*SR); n=N-i0; x=signal.lfilter(*signal.butter(2,[1500/(SR/2),9000/(SR/2)],'band'),rng.standard_normal(n))*np.minimum(1,np.arange(n)/(0.3*SR)); sfx[i0:]+=0.12*x

# fade out ending
fo=np.ones(N); fo[int(29.4*SR):]=np.linspace(1,0,N-int(29.4*SR)); mus*=fo
mus/=np.abs(mus).max(); sfx/=max(1e-9,np.abs(sfx).max())
sf.write("music_ln.wav",mus.astype(np.float32),SR); sf.write("sfx_ln.wav",sfx.astype(np.float32),SR)
print("ok")
