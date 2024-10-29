const fs = require('fs');

const path = 'Presets\\Book\\Book-ColorPresets-BoxColorPresets.json';

fs.readFile(path, 'utf8', (err, json) => {
if (err) {
    console.error(err);
    return;
}
const data = JSON.parse(json);
const cData = {
    keyAndValues: data.keyAndValues.map((item) => {
        return {
            key: item.key,
            useAnotherPreset: item.useAnotherPreset,
            sourcePresetKey: item.sourcePresetKey,
            value: {hex:toHex(item.value.r)+toHex(item.value.g)+toHex(item.value.b),
                a: item.value.a
            }
           
        }
    })
};

console.log(JSON.stringify(cData));
fs.writeFile(path, JSON.stringify(cData), 'utf8', (err) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log('File has been created');
});
});

function toHex(val) {
    return Math.floor(val * 255).toString(16).padStart(2, '0');
}

