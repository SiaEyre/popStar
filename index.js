var boxWidth = 50;
var rownumber = 10;
var squareSet = [];
var timer = null;
var baseScore = 5;
var currentscore = 0;
var totalScore = 500;

function init() {
    var wrapper = document.getElementsByClassName("wrapper")[0];
    for (var i = 0; i < rownumber; i++) {
        squareSet[i] = new Array();
        for (var j = 0; j < rownumber; j++) {
            var square = creatRect(Math.floor(Math.random() * 5), i, j);

            square.onmouseover = function () {
                mouseOver(this);
            }
            square.onmouseout = function () {
                clearInterval(timer);
                back();
            }
            square.onclick = function () {
                clearInterval(timer);
                click(this);
            }
            squareSet[i][j] = square;
            wrapper.appendChild(square);
            refresh();
        }
    }

}
init();
//随机生成小方块
function creatRect(value, row, col) {
    var temp = document.createElement("div");
    temp.style.width = boxWidth + "px";
    temp.style.height = boxWidth + "px";
    temp.style.borderRadius = "15px";
    temp.style.position = "absolute";
    temp.style.backgroundImage = "url(pic/" + value + ".png)";
    temp.style.backgroundSize = "100% 100%";
    temp.style.boxSizing = "border-box";
    temp.style.transform = "scale(0.95)";
    temp.num = value;
    temp.row = row;
    temp.col = col;
    return temp;
}
//初始化布局
function refresh() {
    for (var i = 0; i < squareSet.length; i++) {
        for (var j = 0; j < squareSet[i].length; j++) {
            if (squareSet[i][j] == null) {
                continue;
            }
            //
            squareSet[i][j].row = i;
            squareSet[i][j].col = j;
            squareSet[i][j].style.left = squareSet[i][j].col * boxWidth + "px";
            squareSet[i][j].style.bottom = squareSet[i][j].row * boxWidth + "px";
            squareSet[i][j].style.transition = "left 0.3s,bottom 0.3s"
        }
    }
}

//鼠标移动方块到上方时
function mouseOver(obj) {
    if (obj == null) {
        return false;
    }
    arr = [];
    chooseSquare(obj, arr);
    if (arr.length <= 1) {
        return false;
    }
    shake(arr);
    showScore(arr);
}

//选中上下左右颜色一致的小方块
function chooseSquare(elem, arr) {
    if (elem == null) {
        return;
    }
    arr.push(elem);
    //向左判断
    if (elem.col > 0 && //所在的列不为第一列
        squareSet[elem.row][elem.col - 1] && //左边小方块存在
        squareSet[elem.row][elem.col - 1].num == elem.num && //与当前小方块颜色相同
        arr.indexOf(squareSet[elem.row][elem.col - 1]) == -1) {//当前数组中不存在此方块
        chooseSquare(squareSet[elem.row][elem.col - 1], arr);
    }
    //向右判断
    if (elem.col < rownumber - 1 &&
        squareSet[elem.row][elem.col + 1] &&
        squareSet[elem.row][elem.col + 1].num == elem.num &&
        arr.indexOf(squareSet[elem.row][elem.col + 1]) == -1) {
        chooseSquare(squareSet[elem.row][elem.col + 1], arr);
    }
    //向下判断 
    if (elem.row > 0 &&
        squareSet[elem.row - 1][elem.col] &&
        squareSet[elem.row - 1][elem.col].num == elem.num &&
        arr.indexOf(squareSet[elem.row - 1][elem.col]) == -1) {
        chooseSquare(squareSet[elem.row - 1][elem.col], arr);
    }
    //向上判断
    if (elem.row < rownumber - 1 &&
        squareSet[elem.row + 1][elem.col] &&
        squareSet[elem.row + 1][elem.col].num == elem.num &&
        arr.indexOf(squareSet[elem.row + 1][elem.col]) == -1) {
        chooseSquare(squareSet[elem.row + 1][elem.col], arr);
    }
}

//使小方块闪烁
function shake(arr) {
    var num = 1;
    timer = setInterval(
        function () {
            for (var i = 0; i < arr.length; i++) {
                arr[i].style.transform = "scale(" + (0.9 + 0.05 * Math.pow(-1, num)) + ")";
                arr[i].style.border = "1px solid #FFF";
            }
            num++;
        }
        , 500)
}

//还原样式
function back() {
    for (var i = 0; i < squareSet.length; i++) {
        for (var j = 0; j < squareSet[i].length; j++) {
            if (squareSet[i][j] == null) {
                continue;
            }
            squareSet[i][j].style.transform = "scale(0.95)";
            squareSet[i][j].style.border = "none";
        }
    }
}

//选中小方块时，显示分数
function showScore(arr) {
    var score = 0;
    var len = arr.length;
    for (var i = 0; i < arr.length; i++) {
        score += baseScore + baseScore * i;
    }
    document.getElementsByClassName("promot")[0].innerHTML = len + " 块" + score + " 分";
    document.getElementsByClassName("promot")[0].style.transition = null;
    document.getElementsByClassName("promot")[0].style.opacity = 0.9;
    setTimeout(function () {
        document.getElementsByClassName("promot")[0].style.transition = "opacity 1s";
        document.getElementsByClassName("promot")[0].style.opacity = 0;
    }, 100)
}

//点击事件时
function click(elem) {
    if (elem == null) {
        return false;
    }
    var arr = [];
    chooseSquare(elem, arr);
    if (arr.length <= 1) {
        return false;
    }
    for (var i = 0; i < arr.length; i++) {
        squareSet[arr[i].row][arr[i].col] = null;
        document.getElementsByClassName("wrapper")[0].removeChild(arr[i]);
    }
    move();
    showCurrentscore(arr);
    if(gameOver()){
        if(currentscore >= totalScore){
            document.getElementsByClassName("clearance")[0].style.transition = null;
            document.getElementsByClassName("clearance")[0].style.opacity = 1;
            setTimeout(function(){
                document.getElementsByClassName("clearance")[0].style.transition = "opacity 2s";
                document.getElementsByClassName("clearance")[0].style.opacity = 0;
            } ,2000);
        }else{
            window.alert("游戏结束");
        }
    }
    
}

function move() {//方块纵向下落与横向合并
    for (var i = 0; i < rownumber; i++) {//纵向移动
        var pointer = 0;
        for (var j = 0; j < rownumber; j++) {
            if (squareSet[j][i] != null) {
                if (j != pointer) {
                    squareSet[pointer][i] = squareSet[j][i];
                    squareSet[j][i].row = pointer;
                    squareSet[j][i] = null;
                }
                pointer++;
            }
        }
    }
    for (var i = 0; i < squareSet[0].length;) {//横向移动
        if (squareSet[0][i] == null) {
            for (var j = 0; j < rownumber; j++) {
                squareSet[j].splice(i, 1);
            }
            continue;
        }
        i++;
    }
    refresh();
}

//显示当前分数
function showCurrentscore(arr) {
    var score = 0;
    for (var i = 0; i < arr.length; i++) {
        score += baseScore + baseScore * i;
    }
    if(score > 20 && score < 100 ){
        document.getElementsByClassName("good")[0].style.transition = null;        
        document.getElementsByClassName("good")[0].style.opacity = 1;
        setTimeout (function(){
            document.getElementsByClassName("good")[0].style.transition = "opacity 1s";
            document.getElementsByClassName("good")[0].style.opacity = 0;
        } ,2000);
    }else if(score > 100){
        document.getElementsByClassName("excelent")[0].style.transition = null;        
        document.getElementsByClassName("excelent")[0].style.opacity = 1;
        setTimeout(function(){
            document.getElementsByClassName("excelent")[0].style.transition = "opacity 1s";
            document.getElementsByClassName("excelent")[0].style.opacity = 0;
        } ,2000);
    }
    currentscore += score;
    document.getElementsByClassName("currentscore")[0].innerHTML = "当前分数：" + currentscore + "分";
}

//判断游戏结束

function gameOver() {
    var flag = true;
    for (var i = 0; i < squareSet.length; i++) {
        for (var j = 0; j < squareSet[i].length; j++) {
            var temp = [];
            chooseSquare(squareSet[i][j], temp);
            if(temp.length > 1){
                flag = false
            }
        }
    }
    return flag;
}

