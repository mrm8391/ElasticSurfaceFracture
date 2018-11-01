
function updatePhysics(particles, springs, geometry){

	var i=0;
	for(let s of springs){
		let p1 = s.p1,
			p2 = s.p2;

		s.updateValues();

		// Get spring force depending on spring displacement
		let springForce = Spring.springConstant * (s.length - s.restingLength);
		let springForceVec = s.unitVec.clone().multiplyScalar(springForce);


		let dampConstant = 2;
		// Dampen force
		let p1dampen = p1.velocity.clone().multiplyScalar(dampConstant),
		p2dampen = p2.velocity.clone().multiplyScalar(dampConstant);

		let p1damped = springForceVec.clone().sub(p1dampen),
		p2damped = springForceVec.clone().multiplyScalar(-1).sub(p2dampen);

		// Multiply by unit vector in both directions
		// to apply to the points on the spring.
		let p1force = s.unitVec.clone().multiply(p1damped),
			p2force = s.unitVec.clone().multiply(p2damped);

		p1.applyForce(p1force);
		p2.applyForce(p2force);

		i++;
	}

	i=0;
	for(let p of particles){
		p.updatePosition(timeStep);
		i++;
	}

	geometry.verticesNeedUpdate = true;
}

// Tessellate a plane with each verticy sharing an
// edge with each of its 8 nearest neighbors (X pattern).
function crossTesselatedPlane(width, levels){

	// End result will look like a bunch of boxes with
	// X's through the middle.

	// This will be tessellated by iterating through all
	// the "box" points, connecting with the "cross" points
	// as the boxes are traversed.

	let plane = new THREE.Geometry();

	// Vertices are stored in a 1D array. Each "row" consists of box points
	// or cross points, with rows alternating. Box or cross points
	// can be found with the following indices:
	// box[row][col] = vertices[(row * (2n + 1)) + col]
	// cross[row][col] = vertices[((row+1)*(n+1)) + (row*n) + col]
	let vertices = plane.vertices;
	let faces = plane.faces;

	let boxStart = 0 - (width / 2),
		boxIncrement = (width / levels)
		crossStart = boxStart + (boxIncrement / 2);

	// Generate points
	for(let i = 0; i < levels + 1; i++){

		// Create row of box points
		for(let j = 0; j < levels + 1; j++){

			let boxPt = new THREE.Vector3(
				boxStart + (j*boxIncrement),
				boxStart + (i*boxIncrement),
				0
			);

			vertices.push(boxPt);

		}

		// Create row of cross points, if not at top level.
		if(i!=levels){
			for(let j = 0; j < levels; j++){
				
					let crossPt = new THREE.Vector3(
						crossStart + (j*boxIncrement),
						crossStart + (i*boxIncrement),
						0
					);

					vertices.push(crossPt);
			}
		}
	}

	// Helpers to get indices easily
	let boxIndex = function(row, col){ return (row * (2*levels + 1)) + col; };
	let crossIndex = function(row, col){ return ((row+1)*(levels+1)) + (row*levels) + col; };

	// Generate faces
	for(let i = 0; i < levels; i++){
		for(let j = 0; j < levels; j++){

			// Get all 5 points in current box
			let b1 = boxIndex(i,j),
				b2 = boxIndex(i,j+1),
				b3 = boxIndex(i+1,j),
				b4 = boxIndex(i+1,j+1),
				cross = crossIndex(i,j);

			// Create all possible faces from these
			faces.push(new THREE.Face3(b1,b2,cross));
			faces.push(new THREE.Face3(b2,b4,cross));
			faces.push(new THREE.Face3(b4,b3,cross));
			faces.push(new THREE.Face3(b3,b1,cross));
		}
	}

	return plane;
}

