import {scenesFull, chaptersFull} from './Full';
import {CUES} from './anchors';
const out = {cues: CUES.slice().sort((a, b) => a[0] - b[0]), scenes: scenesFull.map((s) => [s.t0, s.t1, s.y ?? 0, s.zoom ?? 1]), chapters: chaptersFull};
console.log(JSON.stringify(out));
