
var Plane = {

	/*
	Custom plane tessellation that creates boxes with an X pattern.
	The X within each box forms the triangles, causing all verticies
	to share an edge with each of its 8 nearest neighbors.

	A vertex that is on the X of each box is a "cross" vertex, and
	a vertex on the border of a box is a "box" vertex.

	@param width Length of one side of the plane
	@param levels Number of levels to tesselate. Creates one "box" per level.

	@return Threejs geometry object with tessellated faces of the plane
	*/
	crossTessellatedPlane(width, levels){

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
				let b1 = Plane.boxIndex(i,j,levels),
					b2 = Plane.boxIndex(i,j+1,levels),
					b3 = Plane.boxIndex(i+1,j,levels),
					b4 = Plane.boxIndex(i+1,j+1,levels),
					cross = Plane.crossIndex(i,j,levels);

				// Create all possible faces from these
				faces.push(new THREE.Face3(b1,b2,cross));
				faces.push(new THREE.Face3(b2,b4,cross));
				faces.push(new THREE.Face3(b4,b3,cross));
				faces.push(new THREE.Face3(b3,b1,cross));
			}
		}

		return plane;
	},

	/*
	Helper to get index for a 1D array holding vertices for a custom
	tesselated plane. A "box" verticy refers to a point lying on the edge of
	one of the squares.

	@param tessLevels Levels of tesselation on the plane. Determines size of a row
	*/
	boxIndex(row, col, tessLevels){
		return (row * (2*tessLevels + 1)) + col;
	},
	
	/*
	Helper to get index for a 1D array holding vertices for a custom
	tesselated plane. A "cross" verticy refers to a point lying within a square,
	at the center of an X.

	@param tessLevels Levels of tesselation on the plane. Determines size of a row

	@return Index of where (row,col) will be in a 1D array
	*/
	crossIndex(row, col, tessLevels){
		return ((row+1)*(tessLevels+1)) + (row*tessLevels) + col;
	},

	/*
	Convert 1D array index to column of tesselated plane.
	*/
	getBoxColumn(index, tessLevels){
		return index % ((2*tessLevels) + 1);
	},

	/*
	Convert 1D array index to row of tesselated plane.
	*/
	getBoxRow(index, tessLevels){
		return Math.floor(index / ((2*tessLevels)+1));
	},

	/*
	Determine if current index of 1D points is on the edge of the plane.

	Reverse engineers row and column from 1D index to determine this.

	@return True if point is on edge of plane
	*/
	isPointOnEdgeOfPlane(index, tessLevels){
		let row = Plane.getBoxRow(index, tessLevels);
		let col = Plane.getBoxColumn(index, tessLevels);

		//If column greater than levels of tesselation,
		//point is a cross point and can't be on edge of plane
		if(col > tessLevels) return false;

		return row==0 || row==tessLevels || col==0 || col==tessLevels;
	}
}