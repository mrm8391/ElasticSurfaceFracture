
var CONF = {

	//
	//Physics
	//
	timeStep: 0.01, //time that passes each frame of animation. Used to update particle positions
	dampingOff: false, //true to disable damping of spring energy
	dampConstant: .3, //how heavily to damp spring energy
	springConstant: .5,
	pixelsPerMeter: 50,

	//
	//Plane and object properties
	//
	planeLevels: 5, //How many levels the plane is tesselated to
	planeWidth: 50, //width of the plane in pixels
	objectDescendRate: 1, //speed, in pixels, that the object descends
	objectStopPoint: -30, //Where to stop object movement. null indicates no stop
	cubeWidth: 10,
	cubeStartHeight: 20,
	
	//
	//Misc
	//
	startPaused: true
}