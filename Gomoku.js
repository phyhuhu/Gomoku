// set up the board size
let WIDTH = 6;
let HEIGHT = WIDTH;
let FINISH = false;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])
let numP = 1;

// change the board size
const event = document.querySelector("#inputSize");
const size = document.querySelector('#boardSize');
event.addEventListener('submit', function(e){
  e.preventDefault();
  if (size.value>5){
    WIDTH=size.value;
  }
  else{
    WIDTH=6;
    alert('Please input Number > 5 !!!');
  }
  HEIGHT=WIDTH;
  size.value='';

  const trList = document.querySelectorAll('#newTr');
  for (let trOne of trList){
    trOne.remove();
  }

  // rebuild board and reset the game
  FINISH=false;
  currPlayer = 1;
  board = [];
  makeBoard();
  makeHtmlBoard();
});

// choose number of players
const eventPlayer = document.querySelector("#numP");
const num2 = document.querySelector('#two');
const num1 = document.querySelector('#one');
eventPlayer.addEventListener('click', function(e){
  e.preventDefault();

  const numText = document.querySelectorAll("#textForP");
  if (numText.length!==0){
    for (let textOne of numText){
      textOne.remove();
    }
  }
  const textP = document.createElement("h1");
  textP.setAttribute('id', 'textForP');
  eventPlayer.append(textP);
  if(e.target.id!=='two'){
    numP=1;
    textP.innerText='Play with Computer!';

    const trList = document.querySelectorAll('#newTr');
    for (let trOne of trList){
      trOne.remove();
    }

    // rebuild board and reset the game
    FINISH=false;
    currPlayer = 1;
    board = [];
    makeBoard();
    makeHtmlBoard();
  }
  else{
    numP=2;
    textP.innerText='Two Players: black first, white second!';

    const trList = document.querySelectorAll('#newTr');
    for (let trOne of trList){
      trOne.remove();
    }

    // rebuild board and reset the game
    FINISH=false;
    currPlayer = 1;
    board = [];
    makeBoard();
    makeHtmlBoard();
  }
});

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */
function makeBoard() {
  for (let y = 0; y < HEIGHT; y++) {
    board.push(Array.from({ length: WIDTH }));
  }
}

/** makeHtmlBoard: make HTML table */

function makeHtmlBoard() {
  // get "htmlBoard" variable from the item in HTML w/ID of "board"
  const htmlBoard = document.getElementById('board')

  // create the whole board with HEIGHT X WIDTH
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    row.setAttribute('id','newTr');
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      cell.addEventListener("click", handleClick);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // make a div and insert into correct table cell
  const piece = document.createElement('div');
  piece.classList.add('piece');
  piece.classList.add(`p${currPlayer}`);
  const pieceImg = document.createElement('img');
  pieceImg.setAttribute('id','myImg');
  if (currPlayer===1){
    pieceImg.src="image/black.png";
  }
  else{
    pieceImg.src="image/white.png";
  }
  piece.append(pieceImg);

  const place = document.getElementById(`${y}-${x}`);
  if (place!==null && piece!==null) place.append(piece);
}

/** endGame: announce game end */
function endGame(msg) {
  alert(msg);
}

/** handleClick: handle click of column top to play piece */
function handleClick(evt) {
  // get x from ID of clicked cell
  let x=0;
  let y=0;
  let xy = evt.target.id.split('-');
  x=parseInt(xy[1]);
  y=parseInt(xy[0]);

  if ((x>=0 && x<WIDTH) && (y>=0 && y<HEIGHT) && !board[y][x]) {
    if (!FINISH){
      board[y][x] = currPlayer;
      placeInTable(y, x);
    }
    else{
      alert('Game FINISHED!!!');
      return;
    }
  }
  else {
    if (!FINISH){
      alert('Please choose another cell!!!');
      return;
    }
    else{
      alert('Game FINISHED!!!');
      return;
    }
  }
  
  // check for win
  if (checkForWin()) {
    FINISH=true;
    return endGame(`Player ${currPlayer} won!`);
  }
  
  // check for tie
  if (board.every(row => row.every(cell => cell))) {
    FINISH=true;
    return endGame('Tie!');
  }
    
  // switch players
  currPlayer = currPlayer === 1 ? 2 : 1;

  if (numP===1){
    setTimeout(() => {
      computerP();
    }, 500);
  }
}

function computerP() {
  // get x from ID of clicked cell
  x = Math.floor(Math.random() * WIDTH);
  y = Math.floor(Math.random() * HEIGHT);

  while (board[y][x]){
    x = Math.floor(Math.random() * WIDTH);
    y = Math.floor(Math.random() * HEIGHT);
  }
  // console.log(x,y, board[y][x]);

  if ((x>=0 && x<WIDTH) && (y>=0 && y<HEIGHT) && !board[y][x]) {
    if (!FINISH){
      board[y][x] = currPlayer;
      placeInTable(y, x);
    }
    else{
      alert('Game FINISHED!!!');
      return;
    }
  }
  else {
    if (!FINISH){
      alert('Please choose another cell!!!');
      return;
    }
    else{
      alert('Game FINISHED!!!');
      return;
    }
  }
  
  // check for win
  if (checkForWin()) {
    FINISH=true;
    return endGame(`Player ${currPlayer} won!`);
  }
  
  // check for tie
  if (board.every(row => row.every(cell => cell))) {
    FINISH=true;
    return endGame('Tie!');
  }
    
  // switch players
  currPlayer = currPlayer === 1 ? 2 : 1;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // check all directions to find winner

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3], [y, x + 4]];
      let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x], [y + 4, x]];
      let diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3], [y + 4, x + 4]];
      let diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3], [y + 4, x - 4]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
