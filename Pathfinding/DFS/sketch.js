//Number of columns and rows
const {rows,cols,w,walls} = JSON.parse(localStorage.getItem("grid"));

const useMaze = localStorage.getItem("useMaze") == "true"
const useOwnGrid = localStorage.getItem("useOwnGrid") == "true"

const info = JSON.parse(localStorage.getItem("info"))
const owngrid = JSON.parse(localStorage.getItem("OwnGrid"))

//Variable grid is an array of all spots. Right here the array is created containing all columns
var grid = new Array(cols);

//Declare start and end
var start;
var end;

let TotalWeight = 0;

//Variable used to stop draw()
let done = false;

//Constructor function that declares each square or node
class Spot {
  constructor(i,j) {
  //i & j is the position of the node. J is x-axis and I is y-axis
  this.i = i;
  this.j = j;
  this.color = "white"
  //Empty array that will contain neighbors
  this.neighbors = []
  //Undefinded at the beginning. It will later contain the shortest path
  this.prev = undefined;
  //Random generated walls
  this.wall = false;
  this.weight = Math.floor(Math.random(1)*5+1)
  if (Math.random(1) < walls/100) {
    this.wall = true;
    this.weight = 0;
  }

  //P5 function for drawing squares. Initialized in the draw_grid function
  this.draw_spot = function() {
    fill(color(this.color))
    stroke(0);
    rect(this.i*w,this.j*w,w,w);
    if (done && !useMaze) {
      text(this.weight,this.i*w,(this.j+1)*w)
    }
  }

  //Find neighbors for each spot
  this.findNeighbors = function() {
    //If the spot doesn't hit the right wall it got a neighbor to the right
    if (this.j < cols-1 ) {
      this.neighbors.push(grid[this.j+1][this.i]);
    }
    if (!useMaze) {if (this.i < cols-1 && this.j < rows-1 ) {
      this.neighbors.push(grid[this.j+1][this.i+1]);
    }}
    //If the spot doesn't hit the bottom wall it got a neighbor under it
    if (this.i < rows-1) {
      this.neighbors.push(grid[this.j][this.i+1]);
    }
    if (!useMaze) {if (this.i < cols-1 && this.j > 0 ) {
      this.neighbors.push(grid[this.j-1][this.i+1]);
    }}
    //If the spot doesn't hit the left wall it got a neighbor to the left
    if (this.j > 0 )  {
      this.neighbors.push(grid[this.j-1][this.i]);
    }
    if (!useMaze) {if (this.i > 0 && this.j > 0) {
      this.neighbors.push(grid[this.j-1][this.i-1]);
    }}
    //If the spot doesn't hit the top wall it got a neighbor over it
    if (this.i > 0 ) {
      this.neighbors.push(grid[this.j][this.i-1]);
    }
    if (!useMaze) {if (this.i > 0 && this.j < rows-1 ) {
      this.neighbors.push(grid[this.j+1][this.i-1]);
    }} 
  }
}
}

//Function that iterates through all nodes and makes objects for them
function make_grid() {
for (let i = 0; i < rows; i++) {
  //All rows are added to each column. This way all spots are created
  grid[i] = new Array(rows);
  }
  //The spots are assigned to their coordinates
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[j][i] = new Spot(i,j);
    }
  }
  //Neighbors are found for each spot
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[j][i].findNeighbors();
    } 
  }
  //This creates some space around start and end so there is a smaller chance to get an unsolvable maze
  for (let i = 0; i < grid[startX][startY].neighbors.length; i++) {
    grid[startX][startY].neighbors[i].wall = false
    } 
  for (let i = 0; i < grid[endX][endY].neighbors.length; i++) {
    grid[endX][endY].neighbors[i].wall = false
  }
  if (useMaze) {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        grid[j][i].wall = info[j][i].wall == true
        grid[j][i].color = info[j][i].color
        grid[j][i].weight = 0
      }
    }
  }
  if (useOwnGrid) {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        grid[j][i].wall = owngrid[j][i].wall == true
        grid[j][i].weight = owngrid[j][i].weight
        grid[j][i].color = owngrid[j][i].color
      }
    }
  }
}

function draw_grid() {
  //A square is created for each spot and color is changed if the spot got wall prop
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[j][i].draw_spot();
      if (grid[j][i].wall == true){
        grid[j][i].color = "black";
      }
      if (grid[j][i].weight === 1){
        grid[j][i].color = "rgb(255,255,255)";
      }
      if (grid[j][i].weight === 2){
        grid[j][i].color = "rgb(240,240,240)";
      }
      if (grid[j][i].weight === 3){
        grid[j][i].color = "rgb(225,225,225)";
      }
      if (grid[j][i].weight === 4){
        grid[j][i].color = "rgb(210,210,210)";
      }
      if (grid[j][i].weight === 5){
        grid[j][i].color = "rgb(200,200,200)";
      }
    } 
  }
  //The color for the open set is updated
  for (let i = 0; i < openSet.length; i++) {
    openSet[i].color = "Green";
  }
  //The color for the closed set is updated
  for (let i = 0; i < closedSet.length; i++) {
    closedSet[i].color = "Red";
  }
  //The color for the path is updated
  for (let i = 0; i < path.length; i++) {
    path[i].color = "Blue";
  }
  current.color = "aqua";
  //Start and end is declared with color and without wall prop
  start.color = "Yellow"
  end.color = "Yellow";
  start.wall = false;
  end.wall = false;
}

//Variables that describes start and end positions
var startY = 1;
var startX = 1;
if (rows % 2 == 1 || !useMaze) {
  var endY = rows-2;
  var endX = cols-2;
} else {
  var endY = rows-3;
  var endX = cols-3;
}

//P5 function that creates the canvas. The setup function is initialized when the program starts
function setup() {
  createCanvas(cols*w, rows*w);
}

//The make_grid function is called to make the grid (not draw it)
make_grid();

//Start and end is declared with the coordinates declared above
var start = grid[startY][startX];
var end = grid[endY][endX];
var openSet = [start];
var closedSet = [];
//Path starts as an empty array
var path = [];

//Dijkstra algorithm. The draw function is initialized each frame
function draw() {
  if (openSet.length == 0 || done) {
    stopTimer()
    noLoop()
  } else {
  current = openSet[0];
  TotalWeight += current.weight;
  if (current == end) { 
    path = openSet
    done = true
    console.log(`The path is ${path.length} tiles with a weight of ${TotalWeight}`)
  }
  else { 
    let FoundNeighbor = false
    for (let i = 0; i < current.neighbors.length; i++) {
    let neighbor = current.neighbors[i];
    if (!FoundNeighbor) {
      if (!neighbor.wall && !closedSet.includes(neighbor) && !openSet.includes(neighbor)) {
        openSet.unshift(neighbor)
        FoundNeighbor = true
      }
      if (i == current.neighbors.length - 1 && !FoundNeighbor) {
        closedSet.push(openSet.shift())
        TotalWeight -= current.weight
      }
    } 
    }
  } 
 }
 draw_grid();
 }