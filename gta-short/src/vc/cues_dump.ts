import {scenes1, chapters1} from './Part1';
import {CUES} from './anchors';
const out = {cues: CUES.slice().sort((a, b) => a[0] - b[0]), scenes: scenes1.map((s) => [s.t0, s.t1]), chapters: chapters1};
console.log(JSON.stringify(out));
