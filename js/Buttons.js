var Buttons = {

	startButton: document.getElementById('startButtonId'),
	dampButton: document.getElementById('dampButtonId'),
	tearButton: document.getElementById('tearButtonId'),
	tearVisibleButton: document.getElementById('tearVisibleButtonId'),
	// cubeVisibleButton: document.getElementById('cubeVisibleButtonId'),
	cameraButton: document.getElementById('cameraButtonId'),
	// wireframeButton: document.getElementById('wireframeButtonId'),

	// planeLevelBox: document.getElementById('planeLevelInputId'),
	// cubeWidthBox: document.getElementById('cubeWidthInputId'),
	// stopPointBox: document.getElementById('stopPointInputId'),
	// maxStretchBox: document.getElementById('maxStretchInputId'),

	allElements: null,

	registerButtonsAndForms(){
		Buttons.dampButton.onclick = function() {CONF.dampingOff = !CONF.dampingOff;};
		Buttons.startButton.onclick = function() {paused = !paused;}
		Buttons.tearButton.onclick = function() {CONF.tearable = !CONF.tearable;}
		Buttons.tearVisibleButton.onclick = function() {CONF.tornFacesVisible = !CONF.tornFacesVisible;}
		// Buttons.cubeVisibleButton.onclick = function() {CONF.cubeVisible = !CONF.cubeVisible;}
		Buttons.cameraButton.onclick = function() {Update.toggleCamera();}
		// Buttons.wireframeButton.onclick = function() {Update.toggleCamera();}

		Buttons.allElements = [Buttons.startButton, Buttons.dampButton];
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