import {Composition} from 'remotion';
import {GtaShort} from './GtaShort';

export const FPS = 30;
export const Root = () => (
  <Composition id="GtaShort" component={GtaShort} durationInFrames={30 * FPS} fps={FPS} width={1080} height={1920} />
);
