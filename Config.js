/*
Definition of constants that alter simulation.
*/

var CONF = {

	//
	//Physics
	//
	timeStep: 0.05, //time that passes each frame of animation. Used to update particle positions
	dampingOff: false, //true to disable damping of spring energy
	dampConstant: .25, //how heavily to damp spring energy
	springConstant: 1.5,
	pixelsPerMeter: 50,

	//
	//Plane and object properties
	//
	planeLevels: 60, //How many levels the plane is tesselated to
	planeWidth: 50, //width of the plane in pixels
	objectDescendRate: 0.015625, //speed, in pixels, that the object descends
	objectStopPoint: -20, //Where to stop object movement. null indicates no stop
	maxStretchFactor: 10,
	cubeWidth: 10,
	cubeStartHeight: 10,
	//showWireframe: false,
	showWireframe: true,
	cubeVisible: true,
	delaunayTriangulation: false,
	tornFacesVisible: true,
	gapOnCubeBottom: .1,
	
	//
	//Misc
	//
	startPaused: true,
	cameraBottomView: false //set camera view to be below the plane
}