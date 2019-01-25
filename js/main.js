//Config
config = {
  numLimit: 15,
  gridWidth: 8,
  gridHeight: 8
}

//board vars
currentPosition = 0

//FUNCTIONS!!!

//Move on board
function up(b) {
  console.log("UP")
    b = b-config.gridWidth
      return b
    }
function down(b) {
  console.log("DOWN")
    b = b+config.gridWidth
      return b
    }
function left(b) {
  console.log("LEFT")
    b = b-1
      return b
    }
function right(b) {
  console.log("RIGHT")
    b = b+1
      return b
    }
function stay(b) {
  currentPos(b)
  console.log("STAY")
    return b
}

//DirectionA and DirectionB in a movement "up, up, up, left", up would be dirA and left dirB
function horseMove(dirA,dirB) {
  dirA()
  dirA()
  dirA()
  dirB()
}

function addArrElements(elem,arr,amount) {
  //Add N elements to X array
  //console.log("add ",elem," ",amount," times")
    for (i=0;i<amount;i++) {
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
  for (i=0;i<route.length;i++) {
    currBloq = route[i](currBloq)
    $('#bloque-'+currBloq).text((bloqNum+1).toString())
    $('#bloque-'+currBloq).attr("square",(bloqNum+1).toString())
    bloqNum++
  }
}

function getPossibleSquares(mySquare) {

}

function currentPos(bloq) {
  $('#bloque-'+bloq).attr("currentBloq");
  $('#bloque-'+bloq).addClass("been-there");
  $('#bloque-'+bloq).addClass("toy-aca");
}

//Creates an element X times inside another element
// TODO: Add argument for parameter allowing to select where to repeate and what to repeat
function repeater(cantidad) {
  for (i=0;i<cantidad;i++) {
    $('#canvas').append("<div class='bloque' id='bloque-"+i+"'></div>")
  }
}

//In the beginning...
function init() {
  repeater(config.gridHeight*config.gridWidth)//Creates a grid according to config
  makeSpiral("clockwise")//Creates new clockwise spiral "newSpiral"
  markRoute(35,newSpiral)
}
