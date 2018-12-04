/*
Entry point of simulation.

Defines globals, initializes simulation, and starts render loop.
*/

if ( WEBGL.isWebGLAvailable() === false ) {
	document.body.appendChild( WEBGL.getWebGLErrorMessage() );
}

// threejs globals
var camera, controls, scene, renderer;

// the rubber plane, and its properties
var planeGeometry;
var planeParticles;
var planeSprings;

// the object pushing into the plane, and associated data
var objectGeometry;
var objectBoundingBox; //bounding box for testing collisions
var objectSideFaces; //planes for each side of cube (excluding top)
var objectBottom; //plane associated with bottom of cube object
var possibleCollisions; //points on the plane that can collide with object
var currentCollisions; //points on the plane that are currently colliding (NOT USED YET)

// Configuration constants
paused = CONF.startPaused;


var startButton = document.getElementById( 'startButtonId' );
startButton.onclick = function() {paused = !paused;}
var dampButton = document.getElementById( 'dampButtonId' );
dampButton.onclick = function() {CONF.dampingOff = !CONF.dampingOff;}

initPlane();
initScene();
animate();

function initPlane(){
	let plane = null;
	if(CONF.delaunayTriangulation)
		plane = Plane.DelaunayTriangulatedPlane(CONF.planeWidth, CONF.planeLevels);
	else
		plane = Plane.crossTessellatedPlane(CONF.planeWidth, CONF.planeLevels);
	let particles = [];
	let springs = [];

	// Current design involves a primitive cube as the object.
	// Create bounding box to determine particles that
	// can collide with the cube.
	let collisions = [];
	let bound = CONF.cubeWidth/2;
	let boundingBox = new THREE.Box3(
		new THREE.Vector3((-1)*bound,(-1)*bound,-1),
		new THREE.Vector3(bound,bound,1)
	);

	// Register each verticy as a particle.
	for(let i = 0; i < plane.vertices.length; i++){
		let p = new Particle(plane.vertices[i]);

		//Pin verticy if it is on the edge of the plane, to
		//prevent plane from moving. Disabled for alternative
		//triangulation due to bugs right now
		if(!CONF.delaunayTriangulation)
			if(Plane.isPointOnEdgeOfPlane(i,CONF.planeLevels))
				p.pin();

		//Check if particle will collide with cube
		if(boundingBox.containsPoint(p.position))
			collisions.push(p);

		particles.push(p);
	}

	// Create a spring for every edge.
	// Hash each pair to ensure no duplicates are added.
	let addedPairs = new Set();

	for(let i = 0; i < plane.faces.length; i++){
		let v1 = plane.faces[i].a,
			v2 = plane.faces[i].b,
			v3 = plane.faces[i].c;

		let p1 = particles[v1],
			p2 = particles[v2],
			p3 = particles[v3];

		let hash12 = Utils.cantorHash(v1,v2),
			hash23 = Utils.cantorHash(v2,v3),
			hash31 = Utils.cantorHash(v3,v1);

		if(!addedPairs.has(hash12)){
			let s = new Spring(p1,p2);
			springs.push(s);
			p1.addSpring(s);
			p2.addSpring(s);
			addedPairs.add(hash12);
		}

		if(!addedPairs.has(hash23)){
			let s = new Spring(p2,p3);
			springs.push(s);
			p2.addSpring(s);
			p3.addSpring(s);
			addedPairs.add(hash23);
		}

		if(!addedPairs.has(hash31)){
			let s = new Spring(p3,p1);
			springs.push(s);
			p3.addSpring(s);
			p1.addSpring(s);
			addedPairs.add(hash31);
		}

	}

	//set globals
	planeGeometry = plane;
	planeParticles = particles;
	planeSprings = springs;
	possibleCollisions = collisions;
	currentCollisions = [];

	//particles[0].position.x -=10;
	//particles[0].position.y -=5;
	//particles[0].position.x -=15;
}

function initScene() {

	// Camera and controls
	camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );

	if(!CONF.cameraBottomView){
		camera.up = new THREE.Vector3(0,-10,100);
		camera.position.y = -100;
		camera.position.z = 10;
	}else{
		camera.up = new THREE.Vector3(0,-1,0);
		camera.position.y = 0.5;
		camera.position.z = -75;
	}

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

	let planeMaterial = new THREE.MeshPhongMaterial( {
		color: 0xff80ff, flatShading: true, wireframe: CONF.showWireframe
	} );

	let transparentMaterial = new THREE.MeshBasicMaterial( { transparent: true, opacity: 0 } );
	let materials = [planeMaterial, transparentMaterial];

	planeMaterial.side = THREE.DoubleSide;

	var planeMesh = new THREE.Mesh( planeGeometry, materials );
	planeMesh.position = new THREE.Vector3(0,0,0);
	planeMesh.updateMatrix();
	planeMesh.matrixAutoUpdate = false;
	scene.add( planeMesh );


}

function initCubeObject(){

	//Create global bounding box that moves with cube, to
	//actively test for collisions.
	let bound = CONF.cubeWidth/2;
	let cubeTranslation = new THREE.Vector3(0,0,CONF.cubeStartHeight);
	let boundingBox = new THREE.Box3(
		new THREE.Vector3((-1)*bound,(-1)*bound,(-1)*bound - 1),
		new THREE.Vector3(bound,bound,bound)
	);
	boundingBox.translate(cubeTranslation);

	//Create planes for collision with sides of cube.
	let leftF = new THREE.Plane(new THREE.Vector3(-1,0,0), (-1)*bound);
	let rightF = new THREE.Plane(new THREE.Vector3(1,0,0), bound);
	let frontF = new THREE.Plane(new THREE.Vector3(0,-1,0), (-1)*bound);
	let backF = new THREE.Plane(new THREE.Vector3(0,1,0), bound);
	let bottomF = new THREE.Plane(new THREE.Vector3(0,0,-1), (-1)*bound);
	bottomF.translate(cubeTranslation);

	// Now, initialize cube object in scene
	var objectMaterial = new THREE.MeshPhongMaterial( {
		color: 0x000000, flatShading: true, visible: CONF.cubeVisible
	});

	let geometry = new THREE.BoxGeometry(CONF.cubeWidth,CONF.cubeWidth,CONF.cubeWidth);
	geometry.translate(cubeTranslation.x,cubeTranslation.y,cubeTranslation.z);
	var objectMesh = new THREE.Mesh(geometry, objectMaterial);
	scene.add(objectMesh);

	// set globals
	objectGeometry = geometry;
	objectBoundingBox = boundingBox;
	objectSideFaces = [leftF,backF,rightF,frontF,bottomF];
	objectBottom = bottomF;
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
	Update.updateObject();
	Update.updatePhysics();
	renderer.render( scene, camera );
}

function render() {
	renderer.render( scene, camera );
}
