//动画
function showNumberWithAnimation(i, j, randNumber) {
    var numberCell = $("#number-cell-" + i + "-" + j);
    numberCell.css('background-color', getNumberBackgroundColor(randNumber));
    numberCell.css('color', getNumberColor(randNumber));
    numberCell.text(getText(randNumber));
    numberCell.animate({
        width: cellSideLength,
        height: cellSideLength,
        top: getPosTop(i, j),
        left: getPosLeft(i, j)
    }, 50);
}

function showMoveAnimation(fromx, fromy, tox, toy) {
    var numberCell = $('#number-cell-' + fromx + '-' + fromy);//获得fromx,fromy元素的属性top,left
    numberCell.animate({
        top: getPosTop(tox, toy),
        left: getPosLeft(tox, toy)
    }, 200);
}


// 记录分数，分数增加，
function addScore(score) {
	var span = document.getElementsByClassName("number"),
		currentScore = parseInt(span[0].innerText),
		bestScore = parseInt(span[1].innerText);
	span[0].innerText = score + currentScore;
	scoreUpAnimaton("score", score);
	if (span[0].innerText > bestScore) {
		scoreUpAnimaton("best", score);
		span[1].innerText = span[0].innerText;
	}
}

// 分数增加 动画
function scoreUpAnimaton(type, score) {
	var ele,
		score,
		timer,
		count = 0;
	if (type == "score") {
		ele = document.getElementsByClassName("score-animation")[0];
	} else if (type == "best") {
		ele = document.getElementsByClassName("best-animation")[0];
	}
	score = "+" + score;
	ele.innerText = score;
	ele.style.top = "25px";
	ele.style.color = "#8f7a66";
	ele.style.opacity = "1.0"

	timer = setInterval(function() {
		count ++;
		ele.style.display = "inline-block";
		ele.style.top = parseInt(ele.style.top) - 8 + "px";
		ele.style.opacity = parseFloat(ele.style.opacity) - 0.1;
		if (count == 6) {
			clearInterval(timer);
			ele.style.display = "none";
		}
	}, 80);
}

