var mole = document.getElementsByClassName('mole');
var x = 0, y = 0, timer, lives, score, rand, repeatTimer, highScore = 0, isPressed = true;
function start() {
	activity("hide");
	isPressed = false;
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
						<button class="btn-green" onclick="start()">Start</button>`;
	}
	else if(screen == "hide") {
		scrn.style.display = "none";
	}
	else {
		innerContent = `<h2>Game Over</h2>
						<button class="btn-green" onclick="start()">Start Again?</button>`;
		saveScore();
	}
	document.getElementById('screen').innerHTML = innerContent;
}

function saveScore() {
	if(score > highScore) {
		document.cookie = "score="+score;
	}
}

function animator(holeIndex, startFrame, endFrame) {
	let xy = getFrameXY(startFrame);
	animated = false;
	clearTimeout(timer);
	startFrame++;
	timer = setTimeout(()=>animator(holeIndex, startFrame, endFrame), 200);
	if(startFrame > endFrame) {
		clearTimeout(timer);
		mole[holeIndex].style.backgroundPosition = '0px 0px';
		rand = Math.floor(Math.random()*9);
		isPressed = false;
		return animated = true;
	}
	else {
		mole[holeIndex].style.backgroundPosition = -xy[0]+'px '+ -xy[1]+'px';
		startFrame++;
		return animated = false;
	}
}

document.addEventListener('keydown', function(e) {
	let key = e.key;
	let keyMap = [7, 8, 9, 4, 5, 6, 1, 2, 3];
	if((key == keyMap[rand]) && !isPressed) {
		isPressed = true;
		hit(rand);
		repeatTimer = setInterval(()=> {
			show(rand);
		}, 1200);
	}
	else if(!isPressed){
		isPressed = true;
		escaped(rand);
		if(lives >= 0) {
			repeatTimer = setInterval(()=> {
				show(rand);
			}, 1200);
		}
	}
});
activity("menu");
