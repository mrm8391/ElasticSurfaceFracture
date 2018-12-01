/*
Simulates spring interaction for an edge between two vertices.

Logic manipulating spring objects is contained in Update.js.
*/

class Spring{

	// Static ID variable after class declaration

	static get springLength(){return 20;}

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

	    this.id = Spring.nextId;
		Spring.nextId++;
	}

	updateValues(){
		this.length = this.p1.position.distanceTo(this.p2.position);
	    this.pointVec = this.p2.position.clone().sub(this.p1.position);
		this.unitVec = this.pointVec.clone().divideScalar(this.length);
	}
}

Spring.nextId = 0;