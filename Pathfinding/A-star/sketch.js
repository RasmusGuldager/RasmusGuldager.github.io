//Number of columns and rows
const {rows,cols,w,walls} = JSON.parse(localStorage.getItem("grid"));

const useMaze = localStorage.getItem("useMaze") == "true"

const info = JSON.parse(localStorage.getItem("info"))

//Variable grid is an array of all spots. Right here the array is created containing all columns
var grid = new Array(cols);

//Declare start and end
var start;
var end;

//Variable used to stop draw()
let done = false;

//Constructor function that declares each square or node
class Spot {
  constructor(i,j) {
  //h, g & f variables are used later
  this.h = 0;
  this.g = 0;
  this.f = 0;
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
  if (Math.random(1) < walls/100) {
    this.wall = true;
  }

  //P5 function for drawing squares. Initialized in the draw_grid function
  this.draw_spot = function() {
    fill(color(this.color))
    stroke(0);
    rect(this.i*w,this.j*w,w,w);
  }

  //Find neighbors for each spot
  this.findNeighbors = function() {
    //If the spot doesn't hit the left wall it got a neighbor to the left
    if (this.j > 0 )  {
      this.neighbors.push(grid[this.j-1][this.i]);
    }
    //If the spot doesn't hit the bottom wall it got a neighbor under it
    if (this.i < rows-1) {
      this.neighbors.push(grid[this.j][this.i+1]);
    }
    //If the spot doesn't hit the right wall it got a neighbor to the right
    if (this.j < cols-1 ) {
      this.neighbors.push(grid[this.j+1][this.i]);
    } 
    //If the spot doesn't hit the top wall it got a neighbor over it
    if (this.i > 0 ) {
      this.neighbors.push(grid[this.j][this.i-1]);
    }
    //Diagonal neighbors. Same pricipe as horisontal and vertical neighbors.
    if (!useMaze) {
    if (this.i > 0 && this.j > 0) {
      this.neighbors.push(grid[this.j-1][this.i-1]);
    }
    if (this.i < cols-1 && this.j > 0 ) {
      this.neighbors.push(grid[this.j-1][this.i+1]);
    }
    if (this.i < cols-1 && this.j < rows-1 ) {
      this.neighbors.push(grid[this.j+1][this.i+1]);
    }
    if (this.i > 0 && this.j < rows-1 ) {
      this.neighbors.push(grid[this.j+1][this.i-1]);
    }
  } 
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
}

function draw_grid() {
  //A square is created for each spot and color is changed if the spot got wall prop
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[j][i].draw_spot();
      if (grid[j][i].wall == true){
        grid[j][i].color = "black";
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

function deleteElement(elt,arr) {
  for (let i = arr.length; i >= 0; i--) {
    if (arr[i] == elt) {
      arr.splice(i,1);
    }
  }
}

function findCurrentNode() {
  let curr = openSet[0];
  for (let i =  1; i < openSet.length; i++) {
    if (curr.f > openSet[i].f) {
      curr = openSet[i];
  }
 }
  return curr
}

//Function that returns distance from neighbor to end
function distance(a,b) {
  let d = dist(a.i,a.j,b.i,b.j);
  return d;
}

function get_path(current) {
 let temp = current;
 path.push(temp);
 while (temp.prev) {
   path.push(temp.prev);
   temp = temp.prev;
 }
  done = true
}

//Variables that describes start and end positions
var startY = 1;
var startX = 1;
if (rows % 2 == 1) {
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
//At the beginning the current node is start and is declared here

//A* algorithm. The draw function is initialized each frame
function draw() {
  if (openSet.length == 0 || done) {
    stopTimer()
    noLoop()
  } else {
   current = findCurrentNode();
  if (current == end) { 
    get_path(current);
    console.log(`Shortest path is ${path.length} tiles`)
  }
  else { 
  deleteElement(current,openSet);
  closedSet.push(current);
  for (let i = 0; i < current.neighbors.length; i++) {
    let neighbor = current.neighbors[i];
    if (!closedSet.includes(neighbor) && !neighbor.wall) {
        let temp_g = current.g + 1;
        if (openSet.includes(neighbor)) {
          if (temp_g < neighbor.g) {
            neighbor.g = temp_g;
            neighbor.prev = current;
            neighbor.h = distance(neighbor,end);
            neighbor.f = neighbor.g + neighbor.h;
          }
         } else {
            neighbor.g = temp_g;
            openSet.push(neighbor);
            neighbor.prev = current;
            neighbor.h = distance(neighbor,end);
            neighbor.f = neighbor.g + neighbor.h;
          }
        }
   }
  } 
 }
 draw_grid();
 }