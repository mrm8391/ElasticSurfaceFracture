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

		//Shift object down, if stopping point not reached.
		if(objectBottom.constant > CONF.objectStopPoint){
			let moveVector = new THREE.Vector3(0,0,(-1)*CONF.objectDescendRate);
			objectGeometry.translate(moveVector.x,moveVector.y,moveVector.z);
			objectBoundingBox.translate(moveVector);
			objectBottom.translate(moveVector);
		}

		//Handle particles colliding with object. With simplified cube object,
		//we know there is a collision if cube bottom is below position 0
		//on z-axis.
		if(objectBottom.constant <= 0){
			for(let p of possibleCollisions){

				//If object collides with point, lock its z coordinate to the object's bottom.
				//This allows points to "slide" along bottom of cube, but prevents clipping with cube.
				//Ignore points that are pinned by other means.
				let min = objectBoundingBox.min;
				let max = objectBoundingBox.max;
				if(objectBoundingBox.containsPoint(p.position) && !p.pinned){
					p.position.z = objectBottom.constant -.1;
					p.zLock();
				}else if(p.checkNeighborsZLocked() && !p.pinned){
					p.position.z = objectBottom.constant -.1;
					p.softZLock();
					p.zUnlock();
				}
				else{
					p.zUnlock();
					p.softZUnlock();
				}
				
			}
		}

		//If object not colliding with plane at all, unpin all points
		else{
			for(let p of possibleCollisions){
				p.zUnlock();
				p.softZUnlock();
			}
		}
	},

	toggleFaceVisibility(faceIndex){
		let face = planeGeometry.faces[faceIndex];

		//Change index of active material. Materials set in Main.initGeometry
		if(face.materialIndex === 0)
			face.materialIndex = 1;
		else
			face.materialIndex = 0;

		planeGeometry.groupsNeedUpdate = true;
	}

}




