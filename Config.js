/*
Definition of constants that alter simulation.
*/

var CONF = {

	//
	//Physics
	//
	timeStep: 0.05, //time that passes each frame of animation. Used to update particle positions
	dampingOff: false, //true to disable damping of spring energy	######################################
	dampConstant: .75, //how heavily to damp spring energy
	springConstant: .25,
	pixelsPerMeter: 50,

	//
	//Plane and object properties
	//
	planeLevels: 80, //How many levels the plane is tesselated to
	planeWidth: 50, //width of the plane in pixels
	objectDescendRate: 0.125, //speed, in pixels, that the object descends
	objectStopPoint: -50, //Where to stop object movement. null indicates no stop
	maxStretchFactor: 100,
	cubeWidth: 10,
	cubeStartHeight: 20,
	showWireframe: false,
	cubeVisible: true,
	delaunayTriangulation: true,
	tornFacesVisible: false,
	tearable: false,
	
	//
	//Misc
	//
	startPaused: true,
	cameraBottomView: false //set camera view to be below the plane
}