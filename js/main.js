// TODO:
// Speed selector
// calculate farthest travel from center

//Config
config = {
  gridWidth: 61,
  gridHeight: 61,
  maxSteps: 2015,
  maxSquare: 5000,
  minSquare: -1
}

//board vars
var center = Math.floor((Math.floor(config.gridWidth*config.gridHeight/2)))
//console.log("CENTER",center);
var goInterval = ""
var currentPosition = 0
var possibleSquares = []
var possibleBlocks = []
var stepNumba = 0

//FUNCTIONS!!!

//Move on board
function up(b) {
  //console.log("UP")
  b = Math.floor(b)-config.gridWidth
  return b
}
function down(b) {
  //console.log("DOWN")
  b = Math.floor(b)+config.gridWidth
  return b
}
function left(b) {
  //console.log("LEFT")
  b = Math.floor(b)-1
  return b
}
function right(b) {
  //console.log("RIGHT")
  b = Math.floor(b)+1
  return b
}
function stay(b) {
  currentBloq(b)
  //console.log("STAY")
  return b
}

//DirectionA and DirectionB in a movement "up, up, up, left", up would be dirA and left dirB
function horseMove(dirA,dirB) {
  p = currentPosition
  /*
  console.log("Starting in :: ",getSquareFormBloq(p));
  step1 = dirA(p)
  console.log("step1 :: ",getSquareFormBloq(step1));
  step2 = dirA(step1)
  console.log("step2 :: ",getSquareFormBloq(step2));
  step3 = dirB(step2)
  console.log("step3 :: ",getSquareFormBloq(step3));
  horseDestination = step3
  */
  horseDestination = Math.floor(dirA(dirA(dirB(p))))
  return horseDestination
}

function addArrElements(elem,arr,amount) {
  //Add N elements to X array
  //console.log("add ",elem," ",amount," times")
    for (var i=0;i<amount;i++) {
    arr.push(elem)
  }
}

//Make a spiral route

//Spiral array with a defined starting direction
var newSpiral = [up]

//Spiral building function
function makeSpiral(direction) {
  //arguments: Spiral direction counterclockwise or clockwise
  squares = (config.gridWidth*config.gridHeight)
  //which pattern are we going to use for building the route
  // TODO: counterclockwise doesn't work because reasons?
  if (direction == "counterclockwise") {
    direction = [up,left,down,right]
    newSpiral.push(left)
  } else {
    direction = [up,right,down,left]
    newSpiral.push(right)
  }
  var sideSize = 2
  var dir = 1
  while (newSpiral.length <= squares) {
    if (direction[dir] == newSpiral[newSpiral.length-1]) {
      dir++
    }
    dir = dir>3 ? 0 : dir
    addArrElements(direction[dir],newSpiral,sideSize)
    dir++
    addArrElements(direction[dir],newSpiral,sideSize)
    sideSize++
  }
  //Adding a starting movement of stay so we mark the initial square a.k.a. center
  newSpiral.unshift(stay)
  //truncate the route to the amount of squares since we are not hardchecking how many movements we add to the route
  newSpiral = newSpiral.slice(0, squares)
}

//Follows a route using movements
function markRoute(start,route) {
  //35 is center for 8x8
  var bloqNum = 0
  var currBloq = start
  for (var i=0;i<route.length;i++) {
    currBloq = route[i](currBloq)
    //$('#bloque-'+currBloq).text((bloqNum+1).toString())
    //$('#bloque-'+currBloq).attr("square",(bloqNum+1).toString())
    $(document.getElementById('bloque-'+currBloq)).attr("square",(bloqNum+1).toString())
    bloqNum++
  }
}


function getPossibleBlocks() {
  possibleBlocks = [
    horseMove(up,left),
    horseMove(up,right),
    horseMove(down,left),
    horseMove(down,right),
    horseMove(right,up),
    horseMove(right,down),
    horseMove(left,up),
    horseMove(left,down)
  ]
  return possibleBlocks
}

function getPossibleSquares() {
  possibleSquares = [
    /*
    $('#bloque-'+horseMove(down,left)).attr("square"),
    $('#bloque-'+horseMove(down,right)).attr("square"),
    $('#bloque-'+horseMove(up,left)).attr("square"),
    $('#bloque-'+horseMove(up,right)).attr("square"),
    $('#bloque-'+horseMove(right,up)).attr("square"),
    $('#bloque-'+horseMove(right,down)).attr("square"),
    $('#bloque-'+horseMove(left,up)).attr("square"),
    $('#bloque-'+horseMove(left,down)).attr("square")
    */
    $(document.getElementById("bloque-"+horseMove(down,left))).attr("square"),
    $(document.getElementById("bloque-"+horseMove(down,left))).attr("square"),
    $(document.getElementById("bloque-"+horseMove(down,right))).attr("square"),
    $(document.getElementById("bloque-"+horseMove(up,left))).attr("square"),
    $(document.getElementById("bloque-"+horseMove(up,right))).attr("square"),
    $(document.getElementById("bloque-"+horseMove(right,up))).attr("square"),
    $(document.getElementById("bloque-"+horseMove(right,down))).attr("square"),
    $(document.getElementById("bloque-"+horseMove(left,up))).attr("square"),
    $(document.getElementById("bloque-"+horseMove(left,down))).attr("square")
  ]
  return possibleSquares
}

function sanitizePossibleSquares(arr) {
  for (var i = 0; i < arr.length; i++) {
    //arr[i] = $('[square='+arr[i]+']').length ? arr[i] : arr[i]=config.maxSquare
    arr[i] = $(document.querySelectorAll('[square="'+arr[i]+'"]')).length ? arr[i] : arr[i]=config.maxSquare
  }
  //console.log("quedaron :: ",arr);
}

function removeVisitedSquares(arr) {
  for (var i = 0; i < arr.length; i++) {
    //arr[i] = $('[square='+arr[i]+']').hasClass('been-there') ? arr[i]=config.maxSquare : arr[i]
    arr[i] = $(document.querySelectorAll('[square="'+arr[i]+'"]')).hasClass('been-there') ? arr[i]=config.maxSquare : arr[i]
  }
  //console.log("quedaron :: ",arr);
}

function nextSquare() {
  getPossibleSquares()
  sanitizePossibleSquares(possibleSquares)
  removeVisitedSquares(possibleSquares)
  nextPos = getLowestSquare()
  try {
    moveToSquare(nextPos)
  }
  catch(err) {
    stahp()
    throw "Oh noes! am I trapped?!"
  }
}

function getLowestSquare() {
  lowestNum = possibleSquares[0]
  //console.log("lowestNum pre loop",lowestNum);
  for (var i=0 ; i<possibleSquares.length-1 ; i++) {
    lowestNum = Math.floor(lowestNum)<0 ? config.maxSquare : Math.floor(lowestNum)
    nextNum =  Math.floor(possibleSquares[i+1])<0 ? config.maxSquare : Math.floor(possibleSquares[i+1])
    lowestNum = Math.floor(lowestNum)<Math.floor(nextNum) ? Math.floor(lowestNum) : Math.floor(nextNum)
    //console.log("comparing ",lowestNum, " to ",possibleSquares[i+1]," lowest was ",lowestNum);
  }
  //console.log("lowestNum",lowestNum);
  return Math.floor(lowestNum)
}

function getHighestSquare() {
  lowestNum = possibleSquares[0]
  //console.log("lowestNum pre loop",lowestNum);
  for (var i=0 ; i<possibleSquares.length-1 ; i++) {
    nextNum = Math.floor(possibleSquares[i+1])
    lowestNum = Math.floor(lowestNum)>Math.floor(nextNum) ? Math.floor(lowestNum) : Math.floor(nextNum)
    console.log("comparing ",lowestNum, " to ",possibleSquares[i+1]," lowest was ",lowestNum);
  }
  console.log("lowestNum",lowestNum);
  return Math.floor(lowestNum)
}

function getSquareFormBloq(bloq) {
  //square = $('#bloque-'+bloq).attr("square");
  square = $(document.getElementById('bloque-'+bloq)).attr("square");
  return square
}

function getBloqFromSquare(square) {
  //bloq = $('[square='+square+']').attr('id').replace('bloque-','');
  bloq = $(document.querySelectorAll('[square="'+square+'"]')).attr('id').replace('bloque-','');
  return bloq
}

function moveToSquare(square) {
  if (stepNumba>=config.maxSteps) {
    stahp()
  }
  nuPosition = getBloqFromSquare(square)
  currentPosition = nuPosition
  currentBloq(nuPosition)
  stepNumba++
  /*
  $('#move').text(stepNumba)
  $('#currentNum').text(square)
  */
  $(document.getElementById('move')).text(stepNumba)
  $(document.getElementById('currentNum')).text(square)

  //console.log("Now we are on :: ",square);
}

function currentBloq(bloq) {
  currentPosition = bloq
  /*
  $('#bloque-'+bloq).addClass("been-there");
  $('#bloque-'+bloq).addClass("cubo");
  $('#bloque-'+bloq).addClass("cubo-up");
  */
  $(document.getElementById('bloque-'+bloq)).addClass("been-there");
  $(document.getElementById('bloque-'+bloq)).addClass("cubo");
  $(document.getElementById('bloque-'+bloq)).addClass("cubo-up");
  color = stepNumba/5.6;
  //console.log("hsl("+Math.floor(color)+",100%,50%)");
  //$('#bloque-'+bloq).css("background-color","hsl("+Math.floor(color)+",100%,50%)");
  $(document.getElementById('bloque-'+bloq)).css("background-color","hsl("+Math.floor(color)+",100%,50%)");
}

//Creates an element X times inside another element
// TODO: Add argument for parameter allowing to select where to repeate and what to repeat
function repeater(cantidad) {
  for (var i=0;i<cantidad;i++) {
    //$('#canvas').append("<div class='bloque' id='bloque-"+i+"'></div>")
    $(document.getElementById('canvas')).append("<div class='bloque' id='bloque-"+i+"'></div>")
  }
}

function stahp() {
  clearInterval(goInterval);
  console.log("STAHPPED");
}

//In the beginning...
function init() {
  $(document.getElementById('canvas')).css("width", config.gridWidth*20+"px");
  repeater(config.gridHeight*config.gridWidth)//Creates a grid according to config
  makeSpiral("clockwise")//Creates new clockwise spiral "newSpiral"
  markRoute(center,newSpiral)//Mark the board using X square as starting point and Y route
  currentBloq(center)//Set current position based on starting bloq
  $(document.getElementById('next')).on('click', function() {
    goInterval = setInterval(function() { nextSquare() }, 50);
  })
  $(document.getElementById('stop')).on('click', function() {
    stahp()
  })
}
