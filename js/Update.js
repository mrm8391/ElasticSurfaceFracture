/*
Update physics and objects in simulation.
*/

var Update = {

	updatePhysics(){

		var i=0;
		for(let s of planeSprings){
			let p1 = s.p1,
				p2 = s.p2;

			s.updateValues();

			// Get spring force depending on spring displacement
			let springForce = CONF.springConstant * (s.length - s.restingLength);

			let springForceVec = s.unitVec.clone().multiplyScalar(springForce);

			// Dampen vectors, based on each point's velocity. 
			let p1dampen = p1.velocity.clone().multiplyScalar(CONF.dampConstant),
			p2dampen = p2.velocity.clone().multiplyScalar(CONF.dampConstant);

			// Set damping to zero if disabled
			if(CONF.dampingOff){
				p1dampen.set(0,0,0);
				p2dampen.set(0,0,0);
			}

			// Dampen force in each direction, then apply
			let p1force = springForceVec.clone().sub(p1dampen),
			p2force = springForceVec.clone().negate().sub(p2dampen);

			p1.applyForce(p1force);
			p2.applyForce(p2force);

			i++;
		}

		i=0;
		for(let p of planeParticles){
			p.updatePosition(CONF.timeStep);
			i++;
		}

		planeGeometry.verticesNeedUpdate = true;
	},

	updateObject(){

		//If stopping point designated and reached, don't update position.
		if(CONF.objectStopPoint != null && objectBottom <= CONF.objectStopPoint)
			return;

		//Shift object down	
		objectGeometry.translate(0,0,(-1)*CONF.objectDescendRate);
		objectBottom -= (CONF.objectDescendRate);

		//Handle particles colliding with object. With simplified cube object,
		//we know there is a collision if cube bottom is below position 0
		//on z-axis.
		if(objectBottom <= 0){
			//Stick particle to bottom of object by pinning it there.
			for(let p of possibleCollisions){
				p.position.z = objectBottom;
				p.pin();
			}
		}

		//If object not colliding with plane, unpin points
		else{
			for(let p of possibleCollisions){
				p.unpin();
			}
		}
	}

}




