
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
	}
};