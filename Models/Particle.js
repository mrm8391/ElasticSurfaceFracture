class Particle{

	static get PIXELS_PER_METER() {return 50;}

	constructor(verticy){

		this.position = verticy;
		this.velocity = new THREE.Vector3();
		this.mass = 1.0;
		this.force = new THREE.Vector3(0,0,0);
		this.pinned = false;
	}

	pin(){
		this.pinned = true;
	}

	applyForce(f){
		this.force.add(f);
	}

	updatePosition(dt){
		if(this.pinned == true) return;

		// Change in velocity
		let dv = this.force.clone();
		dv.multiplyScalar(dt);
		dv.divideScalar(this.mass);

		this.velocity.add(dv);

		// Change in position
		let dX = this.velocity.clone();
		dX.multiplyScalar(Particle.PIXELS_PER_METER);
		dX.multiplyScalar(dt);

		this.position.add(dX);

		this.force = new THREE.Vector3(0,0,0);
	}
}