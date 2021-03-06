const {rows,cols,w,walls,fps} = JSON.parse(localStorage.getItem("grid"));

const useMaze = localStorage.getItem("useMaze") == "true"
const useOwnGrid = localStorage.getItem("useOwnGrid") == "true"

const info = JSON.parse(localStorage.getItem("info"))
const owngrid = JSON.parse(localStorage.getItem("OwnGrid"))

var grid = new Array(cols);

var start;
var end;

let done = false;

class Spot {
  constructor(i,j) {
  this.distance = Infinity;
  this.i = i;
  this.j = j;
  this.color = "white"
  this.neighbors = []
  this.prev = undefined;
  this.wall = false;
  this.weight = Math.floor(Math.random(1)*5+1)
  if (Math.random(1) < walls/100) {
    this.wall = true;
    this.weight = 0;
  }

  this.draw_spot = function() {
    fill(color(this.color))
    stroke(0);
    rect(this.i*w,this.j*w,w,w);
    if (done && !useMaze) {
      text(this.weight,this.i*w,(this.j+1)*w)
    }
  }

  this.findNeighbors = function() {
    if (this.j > 0 )  {
      this.neighbors.push(grid[this.j-1][this.i]);
    }
    if (this.i < rows-1) {
      this.neighbors.push(grid[this.j][this.i+1]);
    }
    if (this.j < cols-1 ) {
      this.neighbors.push(grid[this.j+1][this.i]);
    } 
    if (this.i > 0 ) {
      this.neighbors.push(grid[this.j][this.i-1]);
    }
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

function make_grid() {
for (let i = 0; i < rows; i++) {
  grid[i] = new Array(rows);
  }
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[j][i] = new Spot(i,j);
    }
  }
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[j][i].findNeighbors();
    } 
  }
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
  for (let i = 0; i < openSet.length; i++) {
    openSet[i].color = "Green";
  }
  for (let i = 0; i < closedSet.length; i++) {
    closedSet[i].color = "Red";
  }
  for (let i = 0; i < path.length; i++) {
    path[i].color = "Blue";
  }
  current.color = "aqua";
  start.color = "Yellow"
  end.color = "Yellow";
}

function get_path(current) {
 let temp = current;
 path.push(temp);
 while (temp.prev) {
   path.push(temp.prev);
   temp = temp.prev;
 }
}

var startY = 1;
var startX = 1;
if (rows % 2 == 1 || !useMaze) {
  var endY = rows-2;
  var endX = cols-2;
} else {
  var endY = rows-3;
  var endX = cols-3;
}

function setup() {
  createCanvas(cols*w, rows*w);
}

make_grid();

var start = grid[startY][startX];
var end = grid[endY][endX];
var openSet = [start];
var closedSet = [];
var path = [];
start.distance = 0;
start.weight = 0;

document.addEventListener("DOMContentLoaded", () => {
  begynd = performance.now()
  start.wall = false;
  end.wall = false;
 while (true) {
  if (openSet.length == 0 || done) {
    document.getElementById("Stopwatch").innerHTML = `Execution time: ${Math.round(slut-begynd)}ms`
    sto = true
    return
  } else {
   current = openSet.shift()
  if (current == end) {
    get_path(current); 
    document.getElementById("Stats1").innerHTML = `Shortest path is: ${path.length} tiles`
    document.getElementById("Stats2").innerHTML = `Total weight is: ${end.distance}`
    done = true
  } else {
    closedSet.push(current)
    for (let i = 0; i < current.neighbors.length; i++) {
      let neighbor = current.neighbors[i];
      if(!neighbor.wall && !closedSet.includes(neighbor) && !openSet.includes(neighbor)) {
      openSet.push(neighbor)
      }
      if (current.distance + neighbor.weight < neighbor.distance) {
        neighbor.distance = current.distance + neighbor.weight
        neighbor.prev = current
      }
    }
  }
}
slut = performance.now()
}
})

function draw() {
draw_grid();
 if (sto) {
  noLoop()
  draw_grid()
}
}