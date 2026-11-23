import {Composition} from 'remotion';
import {GtaShort} from './GtaShort';
import {GtaShort40} from './GtaShort40';
import {GtaCountdown} from './GtaCountdown';
import {GlTest} from './GlTest';
import {LaunchNight} from './LaunchNight';
import {EverySin} from './EverySin';
import {BritRules} from './BritRules';
import {BadgeBillboard} from './BadgeBillboard';
import {SaVsSix, SA6_FRAMES} from './SaVsSix';
import {FiveVsSix, V56_FRAMES} from './FiveVsSix';
import {JackOfHearts, JOH_FRAMES} from './JackOfHearts';
import {JigglePhysics, JIG_FRAMES} from './JigglePhysics';
import {VigilantCase, VC1_FRAMES} from './VigilantCase';
import {BarsBreakdown, BARS_FRAMES} from './BarsBreakdown';
import {SjTally, SJ_FRAMES} from './SjTally';
import {ZkNews, ZK_FRAMES} from './ZkNews';
import {PwLong, PW_FRAMES} from './PwLong';
import {PwThumb} from './PwThumb';
import {MandyShort, MD_FRAMES} from './MandyShort';
import {M24Lyrics, M24_FRAMES} from './M24Lyrics';
import {FbSplit, FB_FRAMES} from './FbSplit';
import {FbSplit2, FB2_FRAMES} from './FbSplit2';
import {FbSplit3, FB3_FRAMES} from './FbSplit3';
import {FbSplit4, FB4_FRAMES} from './FbSplit4';
import {LeonidaEp1, EP1_FRAMES} from './ls/Ep1';
import {AgentReel, AB_FRAMES} from './AgentReel';

export const FPS = 30;
export const Root = () => (
  <>
    <Composition id="AgentReel" component={AgentReel} durationInFrames={AB_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="LeonidaEp1" component={LeonidaEp1} durationInFrames={EP1_FRAMES} fps={30} width={1920} height={1080} />
    <Composition id="FbSplit4" component={FbSplit4} durationInFrames={FB4_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="FbSplit3" component={FbSplit3} durationInFrames={FB3_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="FbSplit2" component={FbSplit2} durationInFrames={FB2_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="FbSplit" component={FbSplit} durationInFrames={FB_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="M24Lyrics" component={M24Lyrics} durationInFrames={M24_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="MandyShort" component={MandyShort} durationInFrames={MD_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="PwThumb" component={PwThumb} durationInFrames={1} fps={30} width={1280} height={720} defaultProps={{v: 'A' as const}} />
    <Composition id="PwLong" component={PwLong} durationInFrames={PW_FRAMES} fps={30} width={1920} height={1080} />
    <Composition id="ZkNews" component={ZkNews} durationInFrames={ZK_FRAMES} fps={FPS} width={1080} height={1920} />
    <Composition id="SjTally" component={SjTally} durationInFrames={SJ_FRAMES} fps={FPS} width={1080} height={1920} />
    <Composition id="BarsBreakdown" component={BarsBreakdown} durationInFrames={BARS_FRAMES} fps={FPS} width={1080} height={1920} />
    <Composition id="VigilantCase" component={VigilantCase} durationInFrames={VC1_FRAMES} fps={FPS} width={1080} height={1920} />
    <Composition id="JigglePhysics" component={JigglePhysics} durationInFrames={JIG_FRAMES} fps={FPS} width={1080} height={1920} />
    <Composition id="JackOfHearts" component={JackOfHearts} durationInFrames={JOH_FRAMES} fps={FPS} width={1080} height={1920} />
    <Composition id="FiveVsSix" component={FiveVsSix} durationInFrames={V56_FRAMES} fps={FPS} width={1080} height={1920} />
    <Composition id="SaVsSix" component={SaVsSix} durationInFrames={SA6_FRAMES} fps={FPS} width={1080} height={1920} />
    <Composition id="BadgeBillboard" component={BadgeBillboard} durationInFrames={2340} fps={FPS} width={1080} height={1920} />
    <Composition id="BritRules" component={BritRules} durationInFrames={2091} fps={FPS} width={1080} height={1920} />
    <Composition id="EverySin" component={EverySin} durationInFrames={1731} fps={FPS} width={1080} height={1920} />
    <Composition id="LaunchNight" component={LaunchNight} durationInFrames={903} fps={FPS} width={1080} height={1920} />
    <Composition id="GlTest" component={GlTest} durationInFrames={30} fps={30} width={540} height={960} />
    <Composition id="GtaCountdown" component={GtaCountdown} durationInFrames={35 * FPS} fps={FPS} width={1080} height={1920} />
    <Composition id="GtaShort40" component={GtaShort40} durationInFrames={40 * FPS} fps={FPS} width={1080} height={1920} />
    <Composition id="GtaShort" component={GtaShort} durationInFrames={20 * FPS} fps={FPS} width={1080} height={1920} />
  </>
);
