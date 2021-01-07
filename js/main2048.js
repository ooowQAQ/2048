var board = new Array();//游戏数据以数组呈现
var score = 0;//游戏分数
var hasConflicted = new Array();//有数字已经做过一次加法了不能再加了
var startx = 0;
var starty = 0;
var endx = 0;
var endy = 0;
$(document).ready(function () {
    prepareForMobile();
    newgame();
});

function prepareForMobile() {
    if (documentWidth > 500) {//在大网页上
        gridContainerWidth = 500;//大格子
        cellSpace = 20;//间隔
        cellSideLength = 100;//格子大小
    }
    $("#grid-container").css("width", gridContainerWidth - 2 * cellSpace);
    $("#grid-container").css("height", gridContainerWidth - 2 * cellSpace);
    $("#grid-container").css("padding", cellSpace);
    $("#grid-container").css("border-randius", 0.02 * gridContainerWidth);
    $('.grid-cell').css('width', cellSideLength);
    $('.grid-cell').css('height', cellSideLength);
    $('.grid-cell').css('border-radius', 0.02 * cellSideLength);
}

function newgame() {
    //初始化棋盘
    init();
    //随机生成两个数字
    generateOneNumber();//在空白随机生成一个数字
    generateOneNumber();
}

function init() {
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            var gridCell = $("#grid-cell-" + i + "-" + j);           //获得每一个小格子里的元素
            gridCell.css("top", getPosTop(i, j));          //定义小格子top属性,见support2048.js
            gridCell.css("left", getPosLeft(i, j));       //定义小格子left属性
        }
    }

    for (var i = 0; i < 4; i++) {
        board[i] = new Array();               //board为二维数组
        hasConflicted[i] = new Array();
        for (var j = 0; j < 4; j++) {
            board[i][j] = 0;                  //初始化为0
            hasConflicted[i][j] = false;          //初始化为false
        }
    }
    updateBoardView();                      //设定格子中的数字
    score = 0;                              //分数初始化
}

function updateBoardView() {
    $(".number-cell").remove();
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            $("#grid-container").append("<div class='number-cell' id='number-cell-" + i + "-" + j + "'></div>");
            var theNumberCell = $('#number-cell-' + i + '-' + j);//
            if (board[i][j] == 0) {//值为零不显示
                theNumberCell.css("width", "0px");//高度和宽度为0为动画效果做准备
                theNumberCell.css("height", "0px");
                theNumberCell.css("top", getPosTop(i, j) + cellSideLength / 2);
                theNumberCell.css("left", getPosLeft(i, j) + cellSideLength / 2);
                //theNumberCell.css('font-size',"40px" );
            }
            else {//值不为0,显示
                theNumberCell.css("width", cellSideLength);
                theNumberCell.css("height", cellSideLength);
                theNumberCell.css("top", getPosTop(i, j));
                theNumberCell.css("left", getPosLeft(i, j));
                theNumberCell.css("background-color", getNumberBackgroundColor(board[i][j]));//背景颜色
                theNumberCell.css('color', getNumberColor(board[i][j]));//字体颜色
                //theNumberCell.css('font-size',"40px" );//字体出格子了
                theNumberCell.text(getText(board[i][j]));
            }
            hasConflicted[i][j] = false;//每次数字更新后状态更新
        }
    }
    $('.number-cell').css('line-height', cellSideLength + 'px');
    $('.number-cell').css('font-size', 0.5 * cellSideLength + 'px');
}

function generateOneNumber() {
    if (nospace(board))//4*4中无空间了,无法生成随机数
        return false;
    else {
        var randx = parseInt(Math.random() * 4);//随机位置
        var randy = parseInt(Math.random() * 4);
        while (true) {//判断位置有无数字
            if (board[randx][randy] == 0) {//这个位置没有数字
                break;
            }
            else {
                randx = parseInt(Math.random() * 4);
                randy = parseInt(Math.random() * 4);
            }
        }
        //生成随机数字
        var randNumber = Math.random() < 0.5 ? 2 : 4;
        board[randx][randy] = randNumber;//随机数字到随机位置上
        showNumberWithAnimation(randx, randy, randNumber);//动画效果
        return true;
    }
}

$(document).keydown(function (event) {//玩家按下按键发生的具体事件
    switch (event.keyCode) {      //event事件的具体判断
        case 37:                //left键
            event.preventDefault();//取消默认效果
            if (moveLeft()) {     //向左移动，函数中会返回是否能向左移动进行判断,同时生成一个新数字,判断是否游戏结束!!
                setTimeout("generateOneNumber()", 205);//延时生成新数字
                setTimeout("isgameover()", 300);
            }
            break;
        case 38:                //up向上
            event.preventDefault();
            if (moveUp()) {
                setTimeout("generateOneNumber()", 200);
                setTimeout("isgameover()", 300);
            }
            break;
        case 39:                //right向右
            event.preventDefault();
            if (moveRight()) {
                setTimeout("generateOneNumber()", 200);
                setTimeout("isgameover()", 300);
            }
            break;
        case 40:                //down向下
            event.preventDefault();
            if (moveDown()) {
                setTimeout("generateOneNumber()", 200);
                setTimeout("isgameover()", 300);
            }
            break;
        default:                //其他按键，无关
            break;
    }
});

document.addEventListener('touchstart', function (event) {//监听touchstart事件,捕捉后响应函数
    startx = event.touches[0].pageX;//touches是一个数组，包括多点触控的每个坐标
    starty = event.touches[0].pageY;
});

document.addEventListener('touchend', function (event) {//容易造成点击误触
    endx = event.changedTouches[0].pageX;
    endy = event.changedTouches[0].pageY;
    var deltax = endx - startx;
    var deltay = endy - starty;
    if (Math.abs(deltax) < 0.1 * gridContainerWidth && Math.abs(deltay) < 0.1 * gridContainerWidth) {
        return;
    }
    if (Math.abs(deltax) >= Math.abs(deltay)) {
        if (deltax > 0) {//和按右键一样
            if (moveRight()) {
                setTimeout("generateOneNumber()", 200);
                setTimeout("isgameover()", 300);
            }
        }
        else {
            if (moveLeft()) {
                setTimeout("generateOneNumber()", 200);
                setTimeout("isgameover()", 300);
            }
        }
    }
    else {
        if (deltay > 0) {//↓
            if (moveDown()) {
                setTimeout("generateOneNumber()", 200);
                setTimeout("isgameover()", 300);
            }
        }
        else {//↑
            if (moveUp()) {
                setTimeout("generateOneNumber()", 200);
                setTimeout("isgameover()", 300);
            }
        }

    }
});

function isgameover() {
    if (nospace(board) && nomove(board)) {
        gameover();
    }
}

function gameover() {
    alert("gameover");
}


function moveLeft() {
    if (!canMoveLeft(board))//传入当前情况如果不能移动直接return false退出
        return false;
    for (var i = 0; i < 4; i++) {
        for (var j = 1; j < 4; j++) {
            if (board[i][j] != 0) {//所有不为零的元素都有移动的可能
                for (var k = 0; k < j; k++) {//左侧的所有元素寻找落脚点
                    if (board[i][k] == 0 && noBlockHorizontal(i, k, j, board)) {//元素到落脚点0上没有间隔，移动然后向右找下一个元素
                        showMoveAnimation(i, j, i, k);//动画从（i，j）移动到（i，k）
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if (board[i][k] == board[i][j] && noBlockHorizontal(i, k, j, board) && hasConflicted[i][k] == false && hasConflicted[i][j] == false) {
                        //元素到落脚点相同元素上没有间隔，移动求和然后向右找下一个元素
                        showMoveAnimation(i, j, i, k);
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        //加分
                        score += board[i][k];
                        updateScore(score);
                        hasConflicted[i][k] = true;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()", 200);//刷新数组中的数
    return true;
}

function moveUp() {
    if (!canMoveUp(board))
        return false;
    for (var i = 1; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            if (board[i][j] != 0) {
                for (var k = 0; k < i; k++) {
                    if (board[k][j] == 0 && noBlockVertical(j, k, i, board)) {
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if (board[k][j] == board[i][j] && noBlockVertical(j, k, i, board) && hasConflicted[k][j] == false && hasConflicted[i][j] == false) {
                        showMoveAnimation(i, j, k, j);
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        score += board[k][j];
                        updateScore(score);
                        hasConflicted[k][j] = true;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()", 200);//刷新数组中的数
    return true;
}

function moveRight() {
    if (!canMoveRight(board))
        return false;
    for (var i = 0; i < 4; i++) {
        for (var j = 2; j >= 0; j--) {
            if (board[i][j] != 0) {
                for (var k = 3; k > j; k--) {
                    if (board[i][k] == 0 && noBlockHorizontal(i, j, k, board)) {
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if (board[i][k] == board[i][j] && noBlockHorizontal(i, j, k, board) && hasConflicted[i][k] == false && hasConflicted[i][j] == false) {
                        showMoveAnimation(i, j, i, k);
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        score += board[i][k];
                        updateScore(score);
                        hasConflicted[i][k] = true;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()", 200);//刷新数组中的数
    return true;
}

function moveDown() {
    if (!canMoveDown(board))
        return false;
    for (var j = 0; j < 4; j++) {
        for (var i = 2; i >= 0; i--) {
            if (board[i][j] != 0) {
                for (var k = 3; k > i; k--) {
                    if (board[k][j] == 0 && noBlockVertical(j, i, k, board)) {//从i到k找
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if (board[k][j] == board[i][j] && noBlockVertical(j, i, k, board) && hasConflicted[k][j] == false && hasConflicted[i][j] == false) {
                        showMoveAnimation(i, j, k, j);
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        score += board[k][j];
                        updateScore(score);
                        hasConflicted[k][j] = true;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()", 200);//刷新数组中的数
    return true;
}