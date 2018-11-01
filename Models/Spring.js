class Spring{

	static get springLength(){return 20;}
	static get springConstant(){return .5;}

	// l = spring resting length. If zero, resting length computed from
	// point positions
	constructor(p1, p2, l = 0){
		this.p1 = p1;
	    this.p2 = p2;
	    
	    this.length = 0;
	    this.restingLength = l;
	    if(l==0)
	    	this.restingLength = p1.position.distanceTo(p2.position);
	    this.pointVec = new THREE.Vector3();
	    this.unitVec = new THREE.Vector3();
	}

	updateValues(){
		this.length = this.p1.position.distanceTo(this.p2.position);
	    this.pointVec = this.p2.position.clone().sub(this.p1.position);
		this.unitVec = this.pointVec.clone().divideScalar(this.length);
	}
}