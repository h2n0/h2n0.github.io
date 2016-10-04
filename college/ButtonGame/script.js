var cont = null; // The container element
var button1 = null;
var button2 = null;

var started = false;
var score = 0;
var bestScore = 0;
var gameOverTimeout = null;

var baseW, baseH;

function $(id){ // The same as the jQuery function '$'
	return document.getElementById(id);
}

window.onload = function(){ // Event
	cont = $("container")
	startScreen()
}


function startScreen(){ // Starts the game
	cont.innerHTML = "<h1>Button game</h1>"+"<div><button id='btn1'>One</button><button id='btn2'>Two</button></div>"; // Puts elements inside of the container
	button1 = $("btn1"); // Assigns the btn1 element to this var
	button2 = $("btn2"); // Assigns the btn2 element to this var

	baseW = cont.clientWidth / 2 - 1;
	baseH = (baseW / 4) * 3;

	console.log(baseW + ":" + baseH)

	// Assign event handlers
	button1.onclick = function(e){
		e.preventDefault();
		btn1();
	}
	button2.onclick = function(e){
		e.preventDefault();
		btn2();
	}

	// Initialise the buttons
	initButtonSize();
}


// Called when button one is pressed
function btn1(){
	if(!started){
		start();
	}

	toggle(button1, button2);
}

// Called when button two is pressed
function btn2(){
	if(!started){
		start();
	}

	toggle(button2, button1);
}

// Called when either on of the buttons are pressed, toggles their disabled
// state and increases score
function toggle(c, nc){
	c.disabled = true;
	nc.disabled = false;
	score++;
	clearTimeout(gameOverTimeout);

	var newTime = 1000 - (score*5);

	gameOverTimeout = setTimeout(gameOver, newTime);
	changeButtonSize();
}

// Called when the player dosen't click the right button on time
function gameOver(){
	alert("Game over:\n You scored " + score + " points");
	if(score > bestScore){
		bestScore = score;
		$("best").innerHTML = "Highest score: " + bestScore;
	}

	score = 0;
	started = false;
}

// Called when the first button is pushed
function start(){
	started = true;
	gameOverTimeout = setTimeout(gameOver, 1000);
	initButtonSize();
}

// Sets the size of the buttons
function initButtonSize(){
	var width = baseW;
	var height = baseH;

	button1.style.width = width+"px";
	button2.style.width = width+"px";

	button1.style.height = height+"px";
	button2.style.height = height+"px";
}

// Sets the size of the buttons to increase the difficulty
// of the game
function changeButtonSize(){
	var width = window.getComputedStyle(button1).width;
	var height = window.getComputedStyle(button1).height;

	width = width.substring(0, width.length-2);
	height = height.substring(0, height.length-2);

	width = parseInt(width);
	height = parseInt(height);

	width -= score / 10;
	height -= score / 10;

	button1.style.width = width + "px";
	button2.style.width = width + "px";

	button1.style.height = height + "px";
	button2.style.height = height + "px";

}
