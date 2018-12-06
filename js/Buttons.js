var Buttons = {

	startButton: document.getElementById('startButtonId'),
	dampButton: document.getElementById('dampButtonId'),
	planeLevelBox: document.getElementById('planeLevelInputId'),

	allElements: null,

	registerButtonsAndForms(){
		Buttons.dampButton.onclick = function() {CONF.dampingOff = !CONF.dampingOff;};
		Buttons.startButton.onclick = function() {paused = !paused;}

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