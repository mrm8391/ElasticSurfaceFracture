/*
Wrapper around a ThreeJS vertex for the Mass-Spring model.

Contains information needed to move the vertex in response to
spring energy.
*/

class Particle{

	// Static ID variable after class declaration

	constructor(verticy){
		this.position = verticy;
		this.velocity = new THREE.Vector3();
		this.mass = 1.0;
		this.force = new THREE.Vector3(0,0,0);
		this.pinned = false;
		this.zLocked = false;
		this.softZLocked = false;
		this.springs = new Set();
		this.faces = new Set();

		this.id = Particle.nextId;
		Particle.nextId++;
	}

	addSpring(s){
		this.springs.add(s);
	}

	addFace(f){
		this.faces.add(f);
	}

	checkNeighborsZLocked(){
		for(let s of this.springs){
			if(s.p1.zLocked || s.p2.zLocked)
				return true;
		}

		return false;
	}

	/*
	Pin this particle, preventing it from moving due to force/velocity.

	@param at Optional parameter to pin the particle at a specific location.
	          Particle remains at its current spot if not specified.
	*/
	pin(at = null){
		this.pinned = true;

		if(at != null){
			this.position.set(at.x,at.y,at.z);
		}
	}

	/*
	Allow this particle to move again.
	*/
	unpin(){
		this.pinned = false;
	}

	/*
	Prevent particle from moving along Z-axis.

	Intended for use for particles colliding with bottom of an object, to
	prevent particle from moving vertically.
	*/
	zLock(){
		this.zLocked = true;
	}

	zUnlock(){
		this.zLocked = false;
	}

	softZLock(){
		this.softZLocked = true;
	}

	softZUnlock(){
		this.softZLocked = false;
	}

	applyForce(f){
		this.force.add(f);
	}

	updatePosition(dt){
		if(this.pinned) return;

		// Change in velocity
		let dv = this.force.clone();
		dv.multiplyScalar(dt);
		dv.divideScalar(this.mass);


		this.velocity.add(dv);

		// Change in position
		let dX = this.velocity.clone();
		dX.multiplyScalar(CONF.pixelsPerMeter);
		dX.multiplyScalar(dt);

		//Disable z movement if particle colliding with object.
		//In addition, if a neighbor is zlocked, cancel z movement
		//to prevent clipping with the cube.
		if(this.zLocked || this.softZLocked){
			let dxLength = dX.length();
			dX.normalize();
			dX.set(dX.x,dX.y,0);
			dX.multiplyScalar(dxLength);
		}

		// Test for and handle collision with object.
		let newPos = new THREE.Vector3();
		newPos.addVectors(this.position, dX);

		if(objectBoundingBox.containsPoint(newPos)){
			//Collision detected. This implies that the point is moving
			//from a non-colliding position to a colliding one.
			//To handle this, cancel out movement in the axis that
			//is pushing the point into the cube.
			let transLine = new THREE.Line3(this.position, newPos);

			for(let face of objectSideFaces){
				//Bingo, found the intersected side
				if(face.intersectsLine(transLine)){
					//Now, negate movement into this axis by rotating
					//movement vector alongside axis of face.
					let dxLength = dX.length();
					
					//Convert to unit vector
					dX.normalize();

					if(face.normal.x != 0)
						dX.set(0,dX.y,dX.z);
					else if(face.normal.y != 0)
						dX.set(dX.x,0,dX.z);
					else if(face.normal.z != 0)
						dX.set(dX.x,dX.y,0);
					else throw "particle-face collision: bad state";

					//now, expand vector along axes of face
					dX.multiplyScalar(dxLength);

					//No need to check other faces.
					break;
				}
			}

			//No intersection found. Find closest face of cube that point should be on.
			let bound = CONF.cubeWidth / 2;
			let relativeZ = (newPos.z - objectBottom.constant - bound);
			let absX = Math.abs(newPos.x), absY = Math.abs(newPos.y), absZ = Math.abs(relativeZ);

			if(Math.max(absX,absY,absZ) > bound){
				// do nothing. particle not actually within any cube bounds
			}else if(absX >= Math.max(absY,absZ)){
				dX.x += (Math.sign(newPos.x) * (bound)) - newPos.x;
			}else if(absY >= Math.max(absX,absZ)){
				dX.y += (Math.sign(newPos.y) * (bound)) - newPos.y;
			}else if(absZ >= Math.max(absX,absY)){
				dX.z += (Math.sign(newPos.z) * (bound)) - (relativeZ);
			}else{
				throw "Invalid state in particle position correction";
			}
		}

		if(Math.abs(dX.z) > 2){
			console.log("tf is going on");
		}

		this.position.add(dX);

		this.force = new THREE.Vector3(0,0,0);
	}
}

Particle.nextId = 0;