var Buttons = {

	initializeButton: document.getElementById('initializeId'),
	startButton: document.getElementById('startId'),
	dampInput: document.getElementById('dampId'),
	tearInput: document.getElementById('tearId'),
	tearVisibleInput: document.getElementById('tearVisibleId'),
	cubeVisibleInput: document.getElementById('cubeVisibleId'),
	cameraButton: document.getElementById('cameraId'),
	wireframeInput: document.getElementById('wireframeId'),

	// planeLevelBox: document.getElementById('planeLevelInputId'),
	// cubeWidthBox: document.getElementById('cubeWidthInputId'),
	// stopPointBox: document.getElementById('stopPointInputId'),
	// maxStretchBox: document.getElementById('maxStretchInputId'),

	allElements: null,

	registerPageInputs(){
		Buttons.initializeButton.onclick = function() {
			if(!simulationRunning){
				initAndStart();
			}else{
				resetSimulation();
			}
		};

		Buttons.startButton.onclick = function() {physicsPause = !physicsPause;};
		Buttons.dampInput.onclick = function() {CONF.dampingOn = this.checked;};
		Buttons.tearInput.onclick = function() {CONF.tearable = this.checked;};
		Buttons.tearVisibleInput.onclick = function() {CONF.tornFacesVisible = this.checked;};
		Buttons.cubeVisibleInput.onclick = function() {CONF.cubeVisible = this.checked; Update.toggleObjectVisibility(this.checked);};
		Buttons.cameraButton.onclick = function() {Update.toggleCamera();};
		Buttons.wireframeInput.onclick = function() {CONF.showWireframe = this.checked; Update.toggleWireframe(this.checked);};

		Buttons.initialize();

		Buttons.allElements = [Buttons.startButton, Buttons.dampButton];
	},

	initialize(){
		Buttons.dampInput.checked = CONF.dampingOn;
		Buttons.tearInput.checked = CONF.tearable;
		Buttons.tearVisibleInput.checked = CONF.tornFacesVisible;
		Buttons.cubeVisibleInput.checked = CONF.cubeVisible;
	},

	disable(element){
		element.disabled = true;
	},

	enable(element){
		element.disabled = false;
	},

	reset(){
		for(let element of allElements){
			Buttons.enable(element);
		}
	}
}