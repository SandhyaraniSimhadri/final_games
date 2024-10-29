import Vector from "../Vector.js";
import { randFloat } from "../Utils.js";
import SpriteInstance from "../base/SpriteInstance.js";
import WinParticle from "./win_particle.js";
export default class WinParticles extends SpriteInstance {
    particleCount = 250;
    growRate = 3;
    growRateRandomizer = 2;
    sizeRandomizer = 0.8;
    gravity = 9000;
    lifeTime = 3;
    lifeTimeRandomizer = 1;
    angularVelocity = 0;
    angularVelocityRandomizer = 100;
    speed = 2700;
    speedRandomizer = 2000;
    colors = [[228 / 255, 255 / 255, 0 / 255], [255 / 255, 0 / 255, 128 / 255]];
    particles = [];
    simulating = false;
    timeLeft;
    angleOfSimulation = 360;
    constructor() {
        super();
        this.size = Vector.one.mul(1.1);
        this.timeLeft = this.lifeTime + randFloat(-this.lifeTimeRandomizer, this.lifeTimeRandomizer);
    }
    simulate() {
        if (this.simulating) {
            return;
        }
        for (let i = 0; i < this.particleCount; i++) {
            // @ts-ignore
            const particle = this.runtime.objects.WinParticle.createInstance("GameUI", this.x, this.y);
            particle.zElevation = 2;
            const size = this.size.add(Vector.one.mul(randFloat(-this.sizeRandomizer, this.sizeRandomizer)));
            console.log('win_particles', size, particle.size);
            particle.scale = size;
            particle.colorRgb = [
                randFloat(this.colors[0][0], this.colors[1][0]),
                randFloat(this.colors[0][1], this.colors[1][1]),
                randFloat(this.colors[0][2], this.colors[1][2]),
            ];
            particle.angularVelocity = this.angularVelocity + randFloat(-this.angularVelocityRandomizer, this.angularVelocityRandomizer);
            particle.angle = randFloat(0, 2 * Math.PI);
            const speed = this.speed + randFloat(-this.speedRandomizer, this.speedRandomizer);
            const direction = this.getSimulateDirection();
            particle.velX = direction.x * speed;
            particle.velY = direction.y * speed;
            particle.gravity = this.gravity;
            this.particles.push(particle);
        }
        this.simulating = true;
    }
    getSimulateDirection() {
        let a = randFloat(-this.angleOfSimulation / 2, this.angleOfSimulation / 2);
        a = a < 0 ? a + 360 : a;
        const s = Math.sin(a * Math.PI / 180);
        const c = Math.cos(a * Math.PI / 180);
        const refVec = new Vector(0, 1);
        return new Vector(refVec.x * c - refVec.y * s, refVec.y * c - refVec.x * s);
    }
    update() {
        const dt = this.runtime.dt;
        if (!this.simulating)
            return;
        this.timeLeft -= dt;
        this.particles.forEach(p => {
        });
        if (this.timeLeft <= 0) {
            this.particles.forEach(p => p.destroy());
            this.destroy();
        }
    }
}
