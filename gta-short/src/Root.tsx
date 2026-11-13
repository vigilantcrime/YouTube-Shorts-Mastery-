import {Composition} from 'remotion';
import {GtaShort} from './GtaShort';
import {GtaShort40} from './GtaShort40';

export const FPS = 30;
export const Root = () => (
  <>
    <Composition id="GtaShort40" component={GtaShort40} durationInFrames={40 * FPS} fps={FPS} width={1080} height={1920} />
    <Composition id="GtaShort" component={GtaShort} durationInFrames={20 * FPS} fps={FPS} width={1080} height={1920} />
  </>
);
