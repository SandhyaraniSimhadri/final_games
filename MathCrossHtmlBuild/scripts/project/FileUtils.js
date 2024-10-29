export async function loadJsonFileFromPath(runtime, path) {
    const text = await loadTextFileFromPath(runtime, path);
    return JSON.parse(text);
}
export async function loadTextFileFromPath(runtime, path) {
    const url = await runtime.assets.getProjectFileUrl(path);
    console.log(url);
    const response = await fetch(url);
    if (!response.ok)
        throw new Error(`Failed to load file from path ${path}`);
    return await response.text();
}
