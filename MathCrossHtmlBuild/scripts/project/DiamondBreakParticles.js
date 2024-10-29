"use strict";
// import {randFloat} from './Utils.js';
// import Vector from './Vector.js';
// export default class DiamondBreakParticles extends ISpriteInstance{
// 	particleCount:number = 10;
// 	growRate:number = 0;
// 	growRateRandomizer:number = 0;
// 	size:number = 1;
// 	sizeRandomizer:number = .8;
// 	gravity:number = 6000;
// 	angle:number = 30;
// 	lifeTime:number = 3;
// 	lifeTimeRandomizer:number = 1;
// 	angularVelocity:number = 60;
// 	angularVelocityRandomizer:number = 40;
// 	speed:number = -500;
// 	speedRandomizer:number = 300;
// 	particles:ISpriteInstance[] = [];
// 	simulating:boolean = false;
// 	timeLeft:number;
// 	color:number=1;
// 	constructor()
// 	{
// 		super();
// 		this.timeLeft = this.lifeTime + this.lifeTimeRandomizer;	
// 	}
// 	simulate()
// 	{
// 		if(this.simulating)
// 		return;
// 		for(let i=0;i< this.particleCount;i++)
// 		{
// 			const particle = this.runtime.objects.TileBreakEffectSprite.createInstance(0,this.x,this.y) as DiamondBreakParticle;
// 			particle.setAnimation(this.color+'');
// 			const size = this.size + randFloat(-this.sizeRandomizer,this.sizeRandomizer);
// 			particle.width *= size;
// 			particle.height *= size;
// 			particle.size = size;
// 			const angularVelocity = this.angularVelocity + randFloat(-this.angularVelocityRandomizer,this.angularVelocityRandomizer);
// 			particle.angularVelocity = angularVelocity;
// 			particle.angle = randFloat(0,2*Math.PI);
// 			const speed = this.speed + randFloat(-this.speedRandomizer,this.speedRandomizer);
// 			const direction = this.getSimulateDirection();
// 			particle.velX = direction.x * speed;
// 			particle.velY = direction.y *speed;
// 			this.particles.push(particle);
// 		}
// 		this.simulating = true;
// 	}
// 	getSimulateDirection()
// 	{
// 			const a = randFloat(-this.angle/2,this.angle/2);
// 			const s = Math.sin(a);
// 			const c = Math.cos(a);
// 			const refVec = new Vector(0,1);
// 			return new Vector(refVec.x*c - refVec.y*s,
// 			refVec.y*c - refVec.x*s);
// 	}
// 	update(dt)
// 	{
// 		if(!this.simulating)
// 			return;
// 		this.timeLeft -= dt;
// 		this.particles.forEach(p=>{
// 			p.y += dt*p.velY;
// 			p.velY += this.gravity*dt;
// 			p.x += dt*p.velX;
// 			p.angle += p.angularVelocity*dt*Math.PI/180;
// 		});
// 		if(this.timeLeft<=0)
// 		{
// 			this.particles.forEach(p=>p.destroy());
// 			this.destroy();
// 		}
// 	}
// }
