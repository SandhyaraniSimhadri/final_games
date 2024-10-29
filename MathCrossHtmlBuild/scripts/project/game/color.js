export default class Color {
    r;
    g;
    b;
    a;
    static red = new Color(1, 0, 0);
    static green = new Color(0, 1, 0);
    static blue = new Color(0, 0, 1);
    static white = new Color(1, 1, 1);
    static black = new Color(1, 1, 1);
    static yellow = new Color(1, 0.92156863, 0.015686275);
    static cyan = new Color(0, 1, 1);
    static magenta = new Color(1, 0, 1);
    static gray = new Color(0.5, 0.5, 0.5);
    static clear = new Color(0, 0, 0, 0);
    constructor(r, g, b, a = 1) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
    static fromHex(hex, alpha = 1) {
        if (hex.length === 8) {
            alpha = parseInt(hex.slice(6, 8), 16) / 255;
            hex = hex.slice(0, 6);
        }
        console.log('from hex:', hex, alpha);
        hex = hex.replace(/^#/, '');
        if (hex.length === 3) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
        const num = parseInt(hex, 16);
        return new Color((num >> 16) / 255, (num >> 8 & 255) / 255, (num & 255) / 255, alpha);
    }
    clone() {
        return new Color(this.r, this.g, this.b, this.a);
    }
    toRgb() {
        return [this.r, this.g, this.b];
    }
    withAlpha(number) {
        return new Color(this.r, this.g, this.b, number);
    }
}
