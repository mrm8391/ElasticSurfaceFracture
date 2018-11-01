class Spring{

	static get springLength(){return 50;}
	static get springConstant(){return 0.5;}

	constructor(p1, p2){
		this.particle1 = p1;
	    this.particle2 = p2;
	    
	    this.length = 0;
	    this.pointVec = new THREE.Vector3();
	    this.unitVec = new THREE.Vector3();
	}

	updateValues(){
		this.length = p1.position.distanceTo(p2.position);
	    this.pointVec = p2.position.clone().sub(p1.position);
		this.unitVec = this.pointVec.clone().divideScalar(this.length);
	}
}