/*
Miscellaneous utility functions.
*/

var Utils = {
	//https://en.wikipedia.org/wiki/Pairing_function#Cantor_pairing_function
	cantorHash(v1,v2){
		// Sort to account for either order of points
		if(v1 >= v2){
			let temp = v1;
			v1 = v2;
			v2 = temp;
		}

		return 0.5 * (v1 + v2) * (v1 + v2 + 1) + v2;
	},

	/**	This provides the determinant of three 2D points. 
		If positive, they are in counterclockwise order/p is to the left of qr, 
		if negative, they are in clockwise order/p is to the right of qr,
		if 0, they are collinear.

		@param p the first point in the triangle
		@param q the second point in the triangle
		@param r the third point in the triangle, either 
				on the line formed by p ->q, to its left, or to its right
	*/
	determinant(p, q, r){
		return (p[0]*q[1] + q[0]*r[1] + r[0]*p[1]
            - p[1]*q[0] - q[1]*r[0] - r[1]*p[0]);
	}
};