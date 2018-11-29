// Used and modified from
// https://github.com/mrdoob/three.js/blob/master/examples/misc_controls_trackball.html


if ( WEBGL.isWebGLAvailable() === false ) {
	document.body.appendChild( WEBGL.getWebGLErrorMessage() );
}

// threejs globals
var camera, controls, scene, renderer;

// the rubber plane, and its properties
var plane;
var planeParticles;
var planeSprings;
var planeLevels;

// the object pushing into the plane, and associated data
var objectGeometry;
var objectBottom; //location of lowest point in object. for use with cube object
var objectDescendRate = 1; //speed, in pixels, that the object descends
var objectStopPoint = -30;
var possibleCollisions; //points on the plane that can collide with object

// constants
var timeStep = 0.01;

var dampingOff = false;
var paused = true;
var startButton = document.getElementById( 'startButtonId' );
startButton.onclick = function() {paused = !paused;}
var dampButton = document.getElementById( 'dampButtonId' );
dampButton.onclick = function() {dampingOff = !dampingOff;}

initPhysics();
initScene();
animate();

function initPhysics(){
	//planeLevels = 2;
	planeLevels = 5;
	plane = crossTesselatedPlane(50, planeLevels);

	planeParticles = [];
	planeSprings = [];

	// Register each verticy as a particle.
	for(let i = 0; i < plane.vertices.length; i++){
		let p = new Particle(plane.vertices[i]);

		//Hackish code to pin points on edge of plane. There are
		//2n+1 columns per "row" including cross points, but n+1 cols for a row
		//of box points.
		//so check if current verticy is at top row, bottom row, or left/right column.
		
		let colModulus = (2*planeLevels) + 1; //Modulus using this yields current column in array
		if(
			(i <= planeLevels) //Bot row
			|| ((plane.vertices.length - i - 1) < planeLevels) //top row, see if in last n points
			|| (i % colModulus == 0) //Left column
			|| (i % colModulus == planeLevels) //Right column
		){
			p.pin();
		}

		// if(i >= plane.vertices.length - planeLevels -1)
		// 	p.pin();

		planeParticles.push(p);
	}

	// Create a spring for every edge. Use a set
	// and hash each pair to ensure no duplicates are added.
	let addedPairs = new Set();

	//https://en.wikipedia.org/wiki/Pairing_function#Cantor_pairing_function
	let cantorHash = function(v1,v2){
		// Sort to account for either order of points
		if(v1 >= v2){
			let temp = v1;
			v1 = v2;
			v2 = temp;
		}

		return 0.5 * (v1 + v2) * (v1 + v2 + 1) + v2;
	}

	for(let i = 0; i < plane.faces.length; i++){
		let v1 = plane.faces[i].a,
			v2 = plane.faces[i].b,
			v3 = plane.faces[i].c;

		let p1 = planeParticles[v1],
			p2 = planeParticles[v2],
			p3 = planeParticles[v3];

		let hash12 = cantorHash(v1,v2),
			hash23 = cantorHash(v2,v3),
			hash31 = cantorHash(v3,v1);

		if(!addedPairs.has(hash12)){
			planeSprings.push(new Spring(p1,p2));
			addedPairs.add(hash12);
		}

		if(!addedPairs.has(hash23)){
			planeSprings.push(new Spring(p2,p3));
			addedPairs.add(hash23);
		}

		if(!addedPairs.has(hash31)){
			planeSprings.push(new Spring(p3,p1));
			addedPairs.add(hash31);
		}
		
	}

	//planeParticles[0].isfirst = true;
	//planeParticles[0].position.x -=10;
	//planeParticles[0].position.y -=5;
	//planeParticles[0].position.x -=15;
}

function initScene() {

	// Camera and controls
	camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
	
	
	camera.up = new THREE.Vector3(0,-10,100);
	camera.position.y = -100;
	camera.position.z = 10;

	camera.lookAt(new THREE.Vector3(0,0,0));

	
	controls = new THREE.TrackballControls( camera );
	controls.rotateSpeed = 1.0;
	controls.zoomSpeed = 1.2;
	controls.panSpeed = 0.8;
	controls.noZoom = false;
	controls.noPan = false;
	controls.staticMoving = true;
	controls.dynamicDampingFactor = 0.3;
	controls.keys = [ 65, 83, 68 ];
	controls.addEventListener( 'change', render );
	
	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0xcccccc );
	//scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );

	// lights
	var light = new THREE.DirectionalLight( 0xffffff );
	light.position.set( 1, 1, 1 );
	scene.add( light );
	var light = new THREE.DirectionalLight( 0x002288 );
	light.position.set( -1, -1, -1 );
	scene.add( light );
	var light = new THREE.AmbientLight( 0x222222 );
	scene.add( light );

	// renderer
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
	//
	window.addEventListener( 'resize', onWindowResize, false );

	initGeometry();
	initCubeObject(10, 20);
	

	render();
}

function initGeometry(){
	
	var planeMaterial = new THREE.MeshPhongMaterial( { 
		color: 0xff00ff, flatShading: true, wireframe: true
	} );

	var planeMesh = new THREE.Mesh( plane, planeMaterial );
	planeMesh.position = new THREE.Vector3(0,0,0);
	planeMesh.updateMatrix();
	planeMesh.matrixAutoUpdate = false;
	scene.add( planeMesh );

	
}

function initCubeObject(size,startHeight=20){

	// First, determine points on plane that can potentially
	// collide with cube. Rubber plane starts at z = 0, so create
	// bounding box around plane and find collisions.
	let bound = size/2;
	let boundingBox = new THREE.Box3(
		new THREE.Vector3((-1)*bound,(-1)*bound,-1),
		new THREE.Vector3(bound,bound,1)
	);

	let collisions = [];
	for(let p of planeParticles){
		if(boundingBox.containsPoint(p.position))
			collisions.push(p);
	}

	// Now, initialize cube object in scene
	var objectMaterial = new THREE.MeshPhongMaterial( {
		color: 0x000000, flatShading: true
	});

	objectGeometry = new THREE.BoxGeometry(size,size,size);
	objectGeometry.translate(0,0,startHeight);
	var objectMesh = new THREE.Mesh(objectGeometry, objectMaterial);
	scene.add(objectMesh);

	// set globals, for use later
	possibleCollisions = collisions;
	objectBottom = startHeight - bound;
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
	controls.handleResize();
	//render();
}

function animate() {
	requestAnimationFrame( animate );
	if(paused==true) return;

	controls.update();
	updateObject();
	updatePhysics(planeParticles, planeSprings, plane);
	renderer.render( scene, camera );
}

function render() {
	renderer.render( scene, camera );
}