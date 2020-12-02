var mole = document.getElementsByClassName('mole');
var x = 0, y = 0, timer, lives, score, rand, repeatTimer, highScore = 0, canAttack;
function initialize() {
	activity("hide");
	canAttack = true;
	highScore = parseInt(document.cookie.split("=")[1]);
	highScore = isNaN(highScore)? 0: highScore;
	document.getElementById('highscore').innerText = "High Score: "+highScore;
	lives = 3;
	score = 0;
	document.getElementById('score').innerText = score;
	document.getElementById('lives').innerHTML = '<img src="assets/heart.svg"> '+lives;
	rand = Math.floor(Math.random()*9);
	repeatTimer = setInterval(()=> {
		show(rand);
	}, 1200);
}
function show(holeIndex = 0) {
	animator(holeIndex, 0, 7);
}

function getFrameXY(frameNumber) {
	let w1 = 1140/6;
	let h1 = 1152/8;
	let frameX = w1 * (frameNumber % 6);
	let frameY = h1 * (Math.floor(frameNumber / 6));
	return [frameX, frameY];
}

function hit(holeIndex = 0) {
	clearInterval(repeatTimer);
	animator(holeIndex, 34, 41);
	score += 1;
	document.getElementById('score').innerText = score;
}

function escaped(holeIndex = 0) {
	clearInterval(repeatTimer);
	animator(holeIndex, 8, 18);
	lives -= 1;
	document.getElementById('lives').innerHTML = '<img src="assets/heart.svg"> '+(lives == -1? 0: lives);
	if(lives < 0) {
		activity("end");
	}
}

function activity(screen) {
	let  scrn = document.getElementById('screens');
	scrn.style.display = "block";
	let innerContent;
	if(screen == "menu") {
		innerContent = `<h2>Whack A Mole</h2>
						<button class="btn-green" onclick="initialize()">Start</button>`;
	}
	else if(screen == "hide") {
		scrn.style.display = "none";
	}
	else {
		innerContent = `<h2>Game Over</h2>
						<button class="btn-green" onclick="initialize()">Start Again?</button>`;
		saveScore();
	}
	document.getElementById('screen').innerHTML = innerContent;
}

function saveScore() {
	if(score > highScore) {
		document.cookie = "score="+score;
	}
}

function animator(holeIndex, initializeFrame, endFrame) {
	let xy = getFrameXY(initializeFrame);
	clearTimeout(timer);
	initializeFrame++;
	timer = setTimeout(()=>animator(holeIndex, initializeFrame, endFrame), 200);
	if(initializeFrame > endFrame) {
		clearTimeout(timer);
		mole[holeIndex].style.backgroundPosition = '0px 0px';
		rand = Math.floor(Math.random()*9);
		canAttack = true;
		return true;
	}
	else {
		mole[holeIndex].style.backgroundPosition = -xy[0]+'px '+ -xy[1]+'px';
		initializeFrame++;
		return false;
	}
}
function onTap(id) {
	if(canAttack) {
		attack(id);
	}
	canAttack = false;
}

document.addEventListener('keydown', function(e) {
	let key = e.key;
	let keyMap = [6, 7, 8, 3, 4, 5, 0, 1, 2];
	if(canAttack)
		attack(keyMap[key - 1]);
	canAttack = false;
});
function attack(index) {
	if(index == rand) {
		hit(rand);
		repeatTimer = setInterval(()=> {
			show(rand);
		}, 1200);
	}
	else {
		escaped(rand);
		if(lives >= 0) {
			repeatTimer = setInterval(()=> {
				show(rand);
			}, 1200);
		}
	}
}
activity("menu");
