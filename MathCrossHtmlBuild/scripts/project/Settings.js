// noinspection JSDeprecatedSymbols
import Color from "./game/color.js";
const colorPresetsHexes = {
    DEFAULT_BUTTONS: "455CA7",
    BG: "F9F6F9",
    BOARD_BG: "FFFFFF",
    CELL_POOL_BG: "FFFFFF",
    BOX_DEFAULT_FIXED: "FFF1B7",
    BOX_TEXT_DEFAULT_FIXED: "000000",
    BOX_BORDER_DEFAULT_FIXED: "000000",
    BOX_SATISFY_FIXED: "E4F8FA",
    BOX_TEXT_SATISFY_FIXED: "66B080",
    BOX_BORDER_SATISFY_FIXED: "000000",
    BOX_DEFAULT_FREE: "E4F8FA",
    BOX_TEXT_DEFAULT_FREE: "66B080",
    BOX_BORDER_DEFAULT_FREE: "000000",
    BOX_RIGHT_FREE: "E4F8FA",
    BOX_TEXT_RIGHT_FREE: "66B080",
    BOX_BORDER_RIGHT_FREE: "000000",
    BOX_WRONG_FREE: "FFC4C4",
    BOX_TEXT_WRONG_FREE: "A42427",
    BOX_BORDER_WRONG_FREE: "000000",
    BOX_HIGHLIGHT: "FFFFFFF1",
    BOX_HOLDER_BG_DEFAULT: "FFF1B7",
    BOX_HOLDER_BORDER_DEFAULT: "161616",
    BOX_HOLDER_BG_DEACTIVE: "DDDDDD12",
    BOX_HOLDER_BORDER_DEACTIVE: "00000000",
};
export const sounds = {
    CELL_ADD: "cell_add", COMPLETE: "complete"
};
export const storeUrl = "https://codecanyon.net/user/darssoft/portfolio";
// export const testHints = true;
//Score will calculate based on the linear graph based on points below
export const scoreCurve = [
    {
        levelsCount: 100,
        baseOffset: 0.2,
        normScore: 250
    }
];
export const hintSettings = { hintForLevel: 300 };
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
export const numbersCountCurve = [
    {
        levelsCount: 100,
        baseOffset: 0.3,
        count: 100
    }
];
export function getScoreForLevel(level) {
    return Math.round(getValueInCurve(level, scoreCurve));
}
export function numbersCountForLevel(level) {
    return Math.round(getValueInCurve(level, numbersCountCurve, "count"));
}
export function getValueInCurve(level, curve, valueKey = "normScore") {
    const levelAndSegment = getSegmentAndBaseLevelForLevel(level, curve);
    const segment = levelAndSegment.segment;
    return curve.slice(0, Math.max(curve.indexOf(segment) - 1, 0)).reduce((acc, val) => acc + val[valueKey], 0) + (level - levelAndSegment.baseLevel) * segment[valueKey] / (segment.levelsCount * (1 - segment.baseOffset)) + segment[valueKey] * segment.baseOffset;
}
function hexToVBColor(rrggbb) {
    const hasAlpha = rrggbb.length === 8;
    const b = rrggbb.slice(4, 4 + 2);
    const g = rrggbb.slice(2, 2 + 2);
    const r = rrggbb.slice(0, 2);
    const a = hasAlpha ? rrggbb.slice(6, 6 + 2) : "FF";
    return [parseInt(r, 16) / 255, parseInt(g, 16) / 255, parseInt(b, 16) / 255, parseInt(a, 16) / 255];
}
function hexToColor(rrggbb) {
    const [r, g, b, a] = hexToVBColor(rrggbb);
    return new Color(r, g, b, a);
}
export const colorPresets = createColorPresets();
// {
// 	BOX_DEFAULT : [0,0,1],
// 	BOX_TEXT_DEFAULT : [0,0,0],
// 	BOX_TEXT_DEACTIVE : [0.6,0.6,0.6],
// };
function createColorPresets() {
    const presets = {};
    Object.keys(colorPresetsHexes).forEach(k => presets[k] = hexToColor(colorPresetsHexes[k]));
    return presets;
}
function getSegmentAndBaseLevelForLevel(level, curve) {
    let baseLevel = 0;
    for (const segment of curve.slice(0, Math.max(0, curve.length - 1))) {
        if (segment.levelsCount + baseLevel > level)
            return { segment: segment, baseLevel: baseLevel };
        baseLevel += segment.levelsCount;
    }
    return { segment: curve[curve.length - 1], baseLevel: baseLevel };
}
