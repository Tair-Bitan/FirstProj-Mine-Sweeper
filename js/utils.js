'use strict'
//---------------- CREATING A MAT\BOARD---------------------
function buildBoard() {
    var board = [];
    for (var i = 0; i < gLevel.SIZE; i++) {
        board[i] = [];
        for (var j = 0; j < gLevel.SIZE; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
            };
            // if (i === getRandomInt(0,4) && j === getRandomInt(0,4) || i === getRandomInt(0,4) && j === getRandomInt(0,4)) {
            //     board[i][j] = {
            //         minesAroundCount: 0,
            //         isShown: false,
            //         isMine: true,
            //         isMarked: false,
            //     };
            // }
        }
    }
    return board;
}

//---------------- PRINTING\RENDERING-(SAME) A MAT\BOARD---------------------
function printBoard(mat, selector) {
    var strHTML = '<tbody>';
    for (var i = 0; i < mat.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < mat[0].length; j++) {
            var cell = mat[i][j];
            var className = `cell cell${i}-${j}`;
            var cellValue;
            if (!cell.isShown) {
                cellValue = EMPTY;
            } else {
                if (cell.isMine) cellValue = BOMB;
                else {
                    if (cell.minesAroundCount = 0) cellValue = '';
                    else cellValue = cell.minesAroundCount;
                }
            }
            strHTML += `<td class="${className}" onclick="cellClicked(this, ${i}, ${j})" oncontextmenu="placeFlag(${i},${j})";>${cellValue}</td>`;
        }
        strHTML += '</tr>';
    }
    strHTML += '</tbody></table>';
    var elMat = document.querySelector(selector);
    elMat.innerHTML = strHTML;
}


function renderBoard(board, selector) {
    var strHtml = '<tbody>';
    for (var i = 0; i < board.length; i++) {
        var row = board[i];
        strHtml += '<tr>';
        for (var j = 0; j < row.length; j++) {
            var cell = row[j];
            var className = `cell cell${i}-${j}`;
            strHtml += `<td onclick="cellClicked(this)" class="${className}">${cell}</td>`;
        }
        strHtml += '</tr>';
    }
    strHtml += '</tbody></table>';
    var elBoard = document.querySelector(selector);
    elBoard.innerHTML = strHtml;
}

function getClassName(location) {
    var cellClass = `cell-${location.i}-${location.j}`;
    return cellClass;
}

//---------------- PRINTING\RENDERING-(SAME) A SINGLE CELL---------------------
// location such as: {i: 2, j: 7}
function renderCell(location, value) {
    // Select the elCell and set the value
    var elCell = document.querySelector(`.cell${location.i}-${location.j}`);
    elCell.innerHTML = value;
}


//---------------- SHUFFEL A GIVEN ARRAY---------------------
function createShuffledArr(array) {
    var copyArray = array.slice() //מעתיק את כל המערך כדי ששינויים שנבצע לא ידרסו את המערך הקיים
    var shuffledArr = [];
    for (var i = 0; i < array.length; i++) {
        shuffledArr[i] = copyArray.splice(getRandomInt(0, copyArray.length), 1)[0]
    }
    return shuffledArr;
}

//---------------- FIND EMPTY CELLS AND GETS THEM INTO AN ARRAY---------------------
function findSafeCells(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            var currCell = board[i][j].isMine;
            if (!currCell) { //it could be any condition to compair to. right now it finds nothing because every cell in the mat contains 'aaa'
                var pos = { i, j }
                gSafeCells.push(pos);
            }
        }
    }
    return gSafeCells;
}

//using the empty array to add num randomly using the shuffled array:
var gEmptyCells;
var gShuffledArr;
function addNum() {
    gEmptyCells = findEmptyCells();
    gShuffledArr = createShuffledArr(gEmptyCells);
    var randomNum = gShuffledArr.pop();
    console.log('randNum is:', randomNum, 'take a look at the html');
    gMat[randomNum.i][randomNum.j] = 'the randNum';
    renderCell(randomNum, 'the randNum')
}

//-------------------------------- MODAL---------------------------------------
function openModal() {
    // just show modal
    var elModal = document.querySelector('.modal');
    elModal.style.display = 'block';
    // show the modal and schedule its closing
    setTimeout(closeModal, 5000);

}

function closeModal() {
    var elModal = document.querySelector('.modal');
    elModal.style.display = 'none';
}

//hadleKey: close modal by clicking on a key on the keyboard:
function handleKey(ev) {
    // TODO: close the modal if escape is pressed
    // console.log('ev:', ev);
    if (ev.key === 'Escape') closeModal();
    console.log('ev:', ev);
}
//this ex is Ex1 on day 09.

//-------------------------------- MOVE PLAYER ---------------------------------------

function moveTo(i, j) {

    // setting a condition in which it will not move
    if ('משהו') return;

    // Adding passages:
    if (i === -1) i = 9;
    if (i === 10) i = 0;
    if (j === -1) j = 11;
    if (j === 12) j = 0;

    var targetCell = gBoard[i][j];  // could be gMat instead of gBoard. Depends

    // Calculate distance to make sure we are moving to a neighbor cell
    var iAbsDiff = Math.abs(i - gGamerPos.i);
    var jAbsDiff = Math.abs(j - gGamerPos.j);

    // If the clicked Cell is one of the four allowed --------ALSO ADDING PASSAGES---------
    if ((iAbsDiff === 1 && jAbsDiff === 0) || (jAbsDiff === 1 && iAbsDiff === 0) ||
        (iAbsDiff === 9 && jAbsDiff === 0) || (iAbsDiff === 0 && jAbsDiff === 11)) {

        if (targetCell.gameElement === BALL) { //setting a condition in which something happens 
            // DELETE ALL INSIDE WHEN IMPLEMENT
            playSound();
            gBallCollectCount++;
            var strHtml = `${gBallCollectCount}`;
            var elSpan = document.querySelector('span');
            elSpan.innerText = `score: ${strHtml}`;
            gameOver();
        }

        if (targetCell.gameElement === GLUE) {
            playGlueSound();
            gSticky = true;
            setTimeout(removeGlue, 3000);
        }

        // MOVING from current position
        // Model:
        gBoard[gGamerPos.i][gGamerPos.j].gameElement = null;
        // Dom:
        renderCell(gGamerPos, '');

        // MOVING to selected position
        // Model:
        gGamerPos.i = i;
        gGamerPos.j = j;
        gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
        // DOM:
        renderCell(gGamerPos, GAMER_IMG);

    } // else console.log('TOO FAR', iAbsDiff, jAbsDiff);

}

// move player via keyboard
function handleKey(event) {

    var i = gGamerPos.i;
    var j = gGamerPos.j;


    switch (event.key) {
        case 'ArrowLeft':
            moveTo(i, j - 1);
            break;
        case 'ArrowRight':
            moveTo(i, j + 1);
            break;
        case 'ArrowUp':
            moveTo(i - 1, j);
            break;
        case 'ArrowDown':
            moveTo(i + 1, j);
            break;

    }
}

//-------------------------- CHECK ROWS COLUMNS AND DIAGONALS-------------------------------------
function checkIfEvenDiagonals(gMat) {
    var sumPrimaryDiagonal = 0;
    var sumSecondaryDiagonal = 0;
    for (var i = 0; i < gMat.length; i++) {
        sumPrimaryDiagonal += gMat[i][i];
        sumSecondaryDiagonal += (gMat[i][gMat.length - 1 - i]);
    }
    if (sumPrimaryDiagonal !== sumSecondaryDiagonal) return false;
    else var diagonalsVal = sumPrimaryDiagonal;
    return diagonalsVal;
}

function checkIfEvenCols(gMat) {
    var sum = 0;
    var calculateCols = [];
    for (var i = 0; i < gMat.length; i++) {
        for (var j = 0; j < gMat[i].length; j++) {
            sum += gMat[j][i];
        }
        calculateCols.push(sum);
        sum = 0;
    }
    for (var i = 0; i < calculateCols.length; i++) {
        var colsVal = calculateCols[0];
        if (colsVal !== calculateCols[i]) return false;
    }
    return colsVal;
}

function checkIfEvenRows(mat) {
    var sum = 0;
    var calculateRows = [];
    for (var i = 0; i < mat.length; i++) {
        for (var j = 0; j < mat[i].length; j++) {
            sum += mat[i][j];
        }
        calculateRows.push(sum);
        sum = 0;
    }
    for (var i = 0; i < calculateRows.length; i++) {
        var rowsVal = calculateRows[0];
        if (rowsVal !== calculateRows[i]) return false
    }
    return rowsVal;
}


//-------------------------- RANDOM NUMS-------------------------------------
// לא כולל המקסימום
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min); // Min is inclusive, Max is Exclusive
}


// כולל המקסימום
function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//---------------- RANDOM COLORS---------------------
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

//---------------- PLAY SOUND---------------------
//!IMPORTANT you need a  sounds folder and place sounds inside for it to work
function playLevelSound() {
    var levelSound = new Audio('sounds/level.wav');
    levelSound.play();
}

function playVictorySound() {
    var victorySound = new Audio('sounds/Ta-Da.wav');
    victorySound.play();
}

function playBombSound() {
    var bombSound = new Audio('sounds/bomb.wav');
    bombSound.play();
}

function playlessLifeSound() {
    var lessLifeSound = new Audio('sounds/less-life.wav');
    lessLifeSound.play();
}

function playLightBulbSound() {
    var lightBulbSound = new Audio('sounds/light.wav');
    lightBulbSound.play();
}