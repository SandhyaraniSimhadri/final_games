import Presets from "./presets/presets.js";
export async function loadPresets(runtime, theme) {
    return {
        colorPresets: await loadColorPreset(runtime, theme),
        gradientPresets: await loadGradientPreset(runtime, theme),
        spritePresets: await loadSpritePreset(runtime, theme),
        audioPresets: await loadAudioPreset(runtime, theme),
        tweenPresets: await loadTweenPreset(runtime, theme),
        valuePresets: await loadValuePreset(runtime, theme),
        boolPresets: await loadBoolPreset(runtime, theme),
        animationPresets: await loadAnimationPreset(runtime, theme)
    };
}
async function loadAnimationPreset(runtime, theme) {
    return await Presets.load(runtime, "Animation", {
        value: `Presets/AnimationPresets-AnimationPresets.json`,
        children: [
            {
                value: `Presets/Library/Animation/AnimationPresets-Library-Commons.json`,
                children: []
            },
            {
                value: `Presets/Library/Animation/AnimationPresets-Library-Equation-Success.json`,
                children: []
            },
            {
                value: `Presets/Library/Animation/AnimationPresets-Library-Cell-Add-To.json`,
                children: []
            },
            {
                value: `Presets/Library/Animation/AnimationPresets-Library-Cell-Return.json`,
                children: []
            },
            {
                value: `Presets/Library/Animation/AnimationPresets-Library-Board-Enter.json`,
                children: []
            },
            {
                value: `Presets/Library/Animation/AnimationPresets-Library-Board-Exit.json`,
                children: []
            },
            {
                value: `Presets/Library/Animation/AnimationPresets-Library-Board-Cells-Enter.json`,
                children: []
            },
            {
                value: `Presets/Library/Animation/AnimationPresets-Library-Board-Cells-Exit.json`,
                children: []
            },
            {
                value: `Presets/Library/Animation/AnimationPresets-Library-Pool-Cells-Enter.json`,
                children: []
            },
            {
                value: `Presets/Library/Animation/AnimationPresets-Library-Pool-Cells-Exit.json`,
                children: []
            },
            {
                value: `Presets/Themes/${theme}/${theme}-AnimationPresets-AnimationPresets.json`,
                children: []
            }
        ]
    });
}
async function loadBoolPreset(runtime, theme) {
    return await Presets.load(runtime, "Bool", {
        value: `Presets/BoolPresets-BoolPresets.json`,
        children: [
            {
                value: `Presets/Themes/${theme}/${theme}-BoolPresets-BoolPresets.json`,
                children: []
            }
        ]
    });
}
async function loadValuePreset(runtime, theme) {
    return await Presets.load(runtime, "Value", {
        value: `Presets/ValuePresets-ValuePresets.json`,
        children: [
            {
                value: `Presets/Themes/${theme}/${theme}-ValuePresets-ValuePresets.json`,
                children: []
            }
        ]
    });
}
async function loadTweenPreset(runtime, theme) {
    return await Presets.load(runtime, "Tween", {
        value: `Presets/TweenAnimationPresets-TweenAnimationPresets.json`,
        children: [
            {
                value: `Presets/Themes/${theme}/${theme}-TweenAnimationPresets-TweenAnimationPresets.json`,
                children: []
            }
        ]
    });
}
async function loadAudioPreset(runtime, theme) {
    return await Presets.load(runtime, "Audio", {
        value: `Presets/AudioPresets-AudioPresets.json`,
        children: [
            {
                value: `Presets/Themes/${theme}/${theme}-AudioPresets-AudioPresets.json`,
                children: []
            }
        ]
    });
}
async function loadSpritePreset(runtime, theme) {
    return await Presets.load(runtime, "Sprite", {
        value: `Presets/SpritePresets-SpritePresets.json`,
        children: [
            {
                value: `Presets/Themes/${theme}/${theme}-SpritePresets-SpritePresets.json`,
                children: []
            }
        ]
    });
}
async function loadGradientPreset(runtime, theme) {
    return await Presets.load(runtime, "Gradient", {
        value: "Presets/GradientPresets-GradientPresets.json",
        children: [
            {
                value: `Presets/Themes/${theme}/${theme}-GradientPresets-GradientPresets.json`,
                children: []
            }
        ]
    });
}
async function loadColorPreset(runtime, theme) {
    return await Presets.load(runtime, "Color", {
        value: "Presets/ColorPresets-ColorPresets.json",
        children: [
            {
                value: `Presets/ColorPresets-BoxColorPresets.json`,
                children: []
            },
            {
                value: `Presets/ColorPresets-GamePlayPanel.json`,
                children: []
            },
            {
                value: `Presets/ColorPresets-LevelCompletePanel.json`,
                children: []
            },
            {
                value: `Presets/ColorPresets-MorePanel.json`,
                children: []
            },
            {
                value: `Presets/ColorPresets-TutorialPanel.json`,
                children: []
            },
            {
                value: `Presets/ColorPresets-TutorialCompletePanel.json`,
                children: []
            },
            {
                value: `Presets/Themes/${theme}/${theme}-ColorPresets-ColorPresets.json`,
                children: [
                    //do it for children
                    {
                        value: `Presets/Themes/${theme}/${theme}-ColorPresets-BoxColorPresets.json`,
                        children: []
                    },
                    {
                        value: `Presets/Themes/${theme}/${theme}-ColorPresets-GamePlayPanel.json`,
                        children: []
                    },
                    {
                        value: `Presets/Themes/${theme}/${theme}-ColorPresets-LevelCompletePanel.json`,
                        children: []
                    },
                    {
                        value: `Presets/Themes/${theme}/${theme}-ColorPresets-MorePanel.json`,
                        children: []
                    },
                    {
                        value: `Presets/Themes/${theme}/${theme}-ColorPresets-TutorialPanel.json`,
                        children: []
                    },
                    {
                        value: `Presets/Themes/${theme}/${theme}-ColorPresets-TutorialCompletePanel.json`,
                        children: []
                    }
                ]
            }
        ]
    });
}
