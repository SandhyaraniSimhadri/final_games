import SpriteInstance from "../base/SpriteInstance.js";
export default class WinParticle extends SpriteInstance {
    velY = 0;
    velX = 0;
    angularVelocity = 0;
    gravity = 0;
    update() {
        this.y += this.runtime.dt * this.velY;
        this.velY += this.gravity * this.runtime.dt;
        this.x += this.runtime.dt * this.velX;
        this.angle += this.angularVelocity * this.runtime.dt * Math.PI / 180;
    }
}
