'use strict'
// --------------------------Functions for the utils CONSIDER DELETE WHEN START------------------------------

// var gMat = createMat(3, 3);
// console.log('mat', gMat);
// printMat(gMat, 'table');
// renderBoard(gMat, 'table');
// console.log('finding empty array', findEmptyCells());
// addNum();

// var arr = [1, 2, 3, 4, 5, 6, 7, 8];
// console.log('the original array is:', arr);
// console.log('creating shuffled array', createShuffledArr(arr));

// --------------------------CONSTANT VARS------------------------------
const BOMB = '💣';
const FLAG = '🚩';
const EMPTY = ' ';
// --------------------------Global Vars------------------------------
var gBoard;
var gTimerInterval;
var gLives = 3;
var gHintMode = false;
var gClickCount = 0;
var gCountFlags = 0;
var gSafeClicks = 3;
var gSafeCells = [];
var gBestScoreBaby;
var gBestScorePro;
var gBestScoreSquad;
var gBombs = [];
var gLevels = {
    'EASY': {
        SIZE: 4,
        MINES: 2
    },
    'MEDIUM': {
        SIZE: 8,
        MINES: 12
    },
    'HARD': {
        SIZE: 12,
        MINES: 30
    }
};
var gLevel = {
    SIZE,
    MINES
};

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
};

// -----------------------------RUNNING CODE--------------------------------

// -----------------------------main Functions--------------------------------
function chosenLevel(btn) {
    playLevelSound()
    document.querySelector('.smiley').innerHTML = '😁';
    gLevel = gLevels[btn]
    gSafeClicks = 3;
    document.querySelector('.safeCount').innerHTML = gSafeClicks;
    init()
}

function init() {
    gCountFlags = 0;
    gSafeClicks = 3;
    document.querySelector('.safeCount').innerHTML = gSafeClicks;
    gLives = 3;
    gBoard = buildBoard(); //building the board (without bombs)
    createBomb(gBoard); // another method for creating bombs
    printBoard(gBoard, 'table'); //prints the board
    calcMinesNegs(gBoard);
}

function resetGame() {
    gSafeClicks = 3;
    document.querySelector('.safeCount').innerHTML = gSafeClicks;
    gClickCount = 0;
    gCountFlags = 0;
    gLives = 3;
    document.querySelector('.hintSign1').style.visibility = 'visible';
    document.querySelector('.hintSign2').style.visibility = 'visible';
    document.querySelector('.hintSign3').style.visibility = 'visible';
    document.querySelector('.lifeCount').innerHTML = gLives
    document.querySelector('.smiley').innerHTML = '😁';
    chosenLevel('EASY');
    clearTimeout(gTimerInterval);
}

function win() {
    playVictorySound();
    clearTimeout(gTimerInterval);
    gCountFlags = 0;
    document.querySelector('.smiley').innerHTML = '😎';
    console.log('function win triggered this win messege');  //DELETE when done
    bestScore();
}

function loose() {
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            gBoard[i][j].isShown = true
            if (gBoard[i][j].isMine) {
                renderCell(i, j, BOMB);
                var elBomb = document.querySelector(`.cell${i}-${j}`);
                elBomb.style.backgroundColor = 'red';
            }
            else if (gBoard[i][j].minesAroundCount === 0) {
                document.querySelector(`.cell${i}-${j}`).classList.add('clicked');
                renderCell(i, j, EMPTY);
            } else {
                document.querySelector(`.cell${i}-${j}`).classList.add('clicked');
                renderCell(i, j, gBoard[i][j].minesAroundCount);
            }

        }
    }
    playBombSound();
    document.querySelector('.smiley').innerHTML = '😵';
    clearTimeout(gTimerInterval);
    gCountFlags = 0;
}
// -----------------------------Functions--------------------------------
function calcMinesNegs(board) {
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            gBoard[i][j].minesAroundCount = setMinesNegsCount(board, i, j)
        }
    }
}

function setMinesNegsCount(board, cellI, cellJ) {
    var negsSum = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= board[i].length) continue;
            if (board[i][j].isMine) negsSum++
        }
    }
    return negsSum;
}

function renderCell(i, j, value) {
    // Select the elCell and set the value
    var elCell = document.querySelector(`.cell${i}-${j}`);
    elCell.innerHTML = value;
}

function hideNegsHintMode(i, j) { //TO FIX: if a cell's value was shown it will remove it
    for (var cellI = i - 1; cellI <= i + 1; cellI++) {
        if (cellI < 0 || cellI >= gBoard.length) continue;
        for (var cellJ = j - 1; cellJ <= j + 1; cellJ++) {
            if (cellJ < 0 || cellJ >= gBoard[cellI].length) continue;
            gBoard[cellI][cellJ].isShown = false;
            renderCell(cellI, cellJ, EMPTY);
        }
    }
    gHintMode = false;
    console.log(gHintMode);
}

function cellClicked(elCell, i, j) {  //dont remove elCell. the function wont work
    gClickCount++
    if (gClickCount === 1) timer();
    if (gHintMode) {
        for (var cellI = i - 1; cellI <= i + 1; cellI++) {
            if (cellI < 0 || cellI >= gBoard.length) continue;
            for (var cellJ = j - 1; cellJ <= j + 1; cellJ++) {
                if (cellJ < 0 || cellJ >= gBoard[cellI].length) continue;
                gBoard[cellI][cellJ].isShown = true;
                if (gBoard[cellI][cellJ].isMine) renderCell(cellI, cellJ, BOMB);
                else if (gBoard[cellI][cellJ].minesAroundCount === 0) renderCell(cellI, cellJ, EMPTY);
                else renderCell(cellI, cellJ, gBoard[cellI][cellJ].minesAroundCount);
            }
        }
        setTimeout(function () {
            hideNegsHintMode(i, j)
        }, 1000);

    } else {
        console.log('the cell is', gBoard[i][j]);
        if (gBoard[i][j].isMarked) alert('can\'t reveal flag');
        else {
            gBoard[i][j].isShown = true; //it works because we gave the i&j parameters in print mat at utils
            document.querySelector(`.cell${i}-${j}`).classList.add('clicked');
            if (gBoard[i][j].isMine) {
                if (gLives > 0) {
                    gLives--;
                    document.querySelector('.lifeCount').innerHTML = gLives
                    playlessLifeSound();
                    renderCell(i, j, BOMB);
                    document.querySelector(`.cell${i}-${j}`).classList.remove('clicked');
                    var hideBomb = setTimeout(function () {
                        renderCell(i, j, EMPTY);
                    }, 500);
                    console.log(gLives);
                } if (gLives === 0) {
                    renderCell(i, j, BOMB);
                    clearTimeout(hideBomb)
                    document.querySelector(`.cell`).classList.add('clicked');
                    loose();
                }
            }
            else {
                if (gBoard[i][j].minesAroundCount === 0) {
                    document.querySelector(`.cell${i}-${j}`).classList.add('clicked');
                    renderCell(i, j, EMPTY);
                    expendNegs(i, j);
                } else {
                    document.querySelector(`.cell${i}-${j}`).classList.add('clicked');
                    renderCell(i, j, gBoard[i][j].minesAroundCount);
                }
            }
            console.log('now cell.isShown set on ', gBoard[i][j].isShown);
        }
    }

}

function expendNegs(cellI, cellJ) {  //reveals only one cell if negs are bombs and all negs if they arent bombs
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue;
            if (i === cellI && j === cellJ) continue;
            if (gBoard[i][j].minesAroundCount === 0) {
                gBoard[i][j].isShown = true;
                document.querySelector(`.cell${i}-${j}`).classList.add('clicked');
                renderCell(i, j, EMPTY);
            }
            else {
                gBoard[i][j].isShown = true;
                document.querySelector(`.cell${i}-${j}`).classList.add('clicked');
                renderCell(i, j, gBoard[i][j].minesAroundCount);
            }
        }
    }
}

function createBomb(board) {
    for (var i = 0; i < gLevel.MINES; i++) {
        board[getRandomInt(0, gLevel.SIZE)][getRandomInt(0, gLevel.SIZE)].isMine = true;
    }
}

function placeFlag(i, j) {
    if (!gBoard[i][j].isMarked) {
        console.log('flag');
        gBoard[i][j].isMarked = true;
        renderCell(i, j, FLAG);
        if (gBoard[i][j].isMine && gBoard[i][j].isMarked) gCountFlags++;
        console.log('flags count', gCountFlags)
        if (gCountFlags === gLevel.MINES) {
            win();
        }
    } else {
        console.log('unflag');
        gBoard[i][j].isMarked = false;
        renderCell(i, j, EMPTY);
        if (gBoard[i][j].isMine && !gBoard[i][j].isMarked) gCountFlags--;
        console.log('flags count', gCountFlags)
    }
}

//---------------- HINT FUNCTION---------------------

function removeHint(elBulb) {
    gHintMode = true;
    console.log(gHintMode);
    playLightBulbSound();
    elBulb.style.visibility = 'hidden';
}

//---------------- SAFE CLICK FUNCTION---------------------

function safeClick() {
    if (gSafeClicks > 0) {
        findSafeCells(gBoard);
        var randCell = gSafeCells[getRandomInt(0, gSafeCells.length - 1)];
        var randI = randCell.i;
        var randJ = randCell.j;
        document.querySelector(`.cell${randI}-${randJ}`).style.backgroundColor = 'green';
        setTimeout(function () {
            document.querySelector(`.cell${randI}-${randJ}`).style.backgroundColor = 'transparent';
        }, 500);
        gSafeClicks--;
        document.querySelector('.safeCount').innerHTML = gSafeClicks;
    }
}

//---------------- TIMER FUNCTION---------------------
// צריך לוודא שיש כפתור שמפעיל את הטיימר, אחרת זה מתפקשש

function timer() {
    var startTime = Date.now();
    gTimerInterval = setInterval(function () {
        var elapsedTime = Date.now() - startTime;
        document.querySelector('.timer').innerHTML = (elapsedTime / 1000).toFixed(1);
    }, 100);
}

function stopTimer() {
    clearInterval(gTimerInterval);
    document.querySelector('.timer').innerText = '0.0';
}

//---------------- BEST SCORE FUNCTION---------------------
function bestScore() {
    var currScore = document.querySelector('.timer').innerHTML;
    if (!gBestScoreBaby) gBestScoreBaby = '9999'
    if (gLevel.SIZE === 4 && currScore < gBestScoreBaby) {
        gBestScoreBaby = currScore;
        localStorage.setItem('baby', gBestScoreBaby);
        document.querySelector('.baby').innerText = localStorage.baby;
    }

    if (gLevel.SIZE === 8 && currScore < gBestScorePro) {
        gBestScorePro = currScore;
        localStorage.setItem('pro', gBestScorePro);
        document.querySelector('.pro').innerText = localStorage.pro;
    }

    if (gLevel.SIZE === 12 && currScore < gBestScoreSquad) {
        gBestScoreSquad = currScore;
        localStorage.setItem('squad', `${gBestScoreSquad} <br>`);
        document.querySelector('.squad').innerText = localStorage.squad;
    }
    console.log(currScore);
    // console.log('local storage:', localStorage.bestScoreSquad);
}

function resetBestScore() {
    localStorage.clear();
    gBestScoreBaby = localStorage.baby;
    gBestScorePro = localStorage.pro;
    gBestScoreSquad = localStorage.squad;
    document.querySelector('.baby').innerText = '---------';
    document.querySelector('.pro').innerText = '---------';
    document.querySelector('.squad').innerText = '---------';
}