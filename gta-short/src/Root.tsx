import {Composition} from 'remotion';
import {GtaShort} from './GtaShort';
import {GtaShort40} from './GtaShort40';
import {GtaCountdown} from './GtaCountdown';
import {GlTest} from './GlTest';
import {LaunchNight} from './LaunchNight';
import {EverySin} from './EverySin';
import {BritRules} from './BritRules';
import {BadgeBillboard} from './BadgeBillboard';

export const FPS = 30;
export const Root = () => (
  <>
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
