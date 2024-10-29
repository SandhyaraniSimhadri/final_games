import { scoreCurve } from './Settings.js';
export class LevelScoreCalculator {
    getSegmentAndBaseLevelForLevel(level) {
        let baseLevel = 0;
        for (const segment of scoreCurve.slice(0, Math.max(0, scoreCurve.length - 1))) {
            if (segment.levelsCount + baseLevel > level)
                return segment;
            baseLevel += segment.levelsCount;
        }
        return scoreCurve[scoreCurve.length - 1];
    }
}
