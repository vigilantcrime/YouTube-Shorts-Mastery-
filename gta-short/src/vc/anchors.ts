import {Word, mkA} from './kit';
import words1 from './long_words.json';
export const A = mkA(words1 as Word[]);
/* sound cues: every pop-up registers its time here at module load (P() is a pass-through) → exported to JSON for the SFX mixer */
export const CUES: [number, string, number][] = [];
export const P = (t: number, k = 'pop', v = 1): number => { CUES.push([Math.round(t * 1000) / 1000, k, v]); return t; };
/* standalone cue marker for use inside JSX: {cue(t,'type',0.9)} */
export const cue = (t: number, k: string, v = 1) => { P(t, k, v); return null; };

/* ---- Part 2 (97.9 s VO) sits after Part 1 in the joined cut ---- */
import words2 from './short_words.json';
export const D2 = 254.8, P2_VO = 97.91, FULL_TAIL = 1.2;
export const A2 = mkA((words2 as Word[]).map((w) => ({...w, t: w.t + D2, on: w.on + D2})));
