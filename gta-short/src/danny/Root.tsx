import React from 'react';
import {Composition} from 'remotion';
import {ShotClip} from './ShotClip';
import {HandTest} from './HandTest';
import {ShotPhone} from './ShotPhone';
import {ShotFinger} from './ShotFinger';
export const DannyRoot: React.FC = () => (
  <>
    <Composition id="DClipG" component={ShotClip} defaultProps={{v: 'G' as const}} durationInFrames={149} fps={25} width={1920} height={1080} />
    <Composition id="DClipH" component={ShotClip} defaultProps={{v: 'H' as const}} durationInFrames={177} fps={25} width={1920} height={1080} />
    <Composition id="DHandTest" component={HandTest} defaultProps={{k: 0}} durationInFrames={1} fps={25} width={1920} height={1080} />
    <Composition id="DFinger" component={ShotFinger} durationInFrames={69} fps={25} width={1920} height={1080} />
    <Composition id="DP0" component={ShotPhone} defaultProps={{v: 'P0' as const}} durationInFrames={182} fps={25} width={1920} height={1080} />
    <Composition id="DP1" component={ShotPhone} defaultProps={{v: 'P1' as const}} durationInFrames={138} fps={25} width={1920} height={1080} />
    <Composition id="DP2" component={ShotPhone} defaultProps={{v: 'P2' as const}} durationInFrames={139} fps={25} width={1920} height={1080} />
    <Composition id="DP3" component={ShotPhone} defaultProps={{v: 'P3' as const}} durationInFrames={86} fps={25} width={1920} height={1080} />
  </>
);
