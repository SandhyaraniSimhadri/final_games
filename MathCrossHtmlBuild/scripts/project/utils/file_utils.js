export function downloadFile(url, fileName) {
    fetch(url, { method: 'get', mode: 'no-cors', referrerPolicy: 'no-referrer' })
        .then(res => res.blob())
        .then(res => {
        const aElement = document.createElement('a');
        aElement.setAttribute('download', fileName);
        const href = URL.createObjectURL(res);
        aElement.href = href;
        aElement.setAttribute('target', '_blank');
        aElement.click();
        URL.revokeObjectURL(href);
    });
}
//download json file
export function downloadJsonFile(data, fileName) {
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const aElement = document.createElement('a');
    aElement.href = url;
    aElement.download = fileName;
    aElement.click();
    URL.revokeObjectURL(url);
}
