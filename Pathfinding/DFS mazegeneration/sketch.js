const {rows,cols,w} = JSON.parse(localStorage.getItem("grid"));

var grid = new Array(cols);
let info = new Array(cols)

var start;
var end;

let done = false;

class Spot {
  constructor(i,j) {
  this.i = i;
  this.j = j;
  this.color = "black"
  this.neighbors = []
  this.wall = true;

  this.draw_spot = function() {
    fill(color(this.color))
    stroke(0)
    rect(this.i*w,this.j*w,w,w);
  }

  this.findNeighbors = function() {
    if (this.j > 2 )  {
      this.neighbors.push(grid[this.j-2][this.i]);
    }
    if (this.i < rows-3) {
      this.neighbors.push(grid[this.j][this.i+2]);
    }
    if (this.j < cols-3) {
      this.neighbors.push(grid[this.j+2][this.i]);
    } 
    if (this.i > 2 ) {
      this.neighbors.push(grid[this.j][this.i-2]);
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
}

function draw_grid() {
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[j][i].draw_spot();
      if (grid[j][i].wall === true){
        grid[j][i].color = "black";
      } else {
        grid[j][i].color = "white";
      }
    } 
  }
  for (let i = 0; i < openSet.length; i++) {
    openSet[i].color = "Green";
  }
  if (!openSet.length == 0) {
    current.color = "aqua";
  }
  start.color = "Yellow"
  end.color = "Yellow";
}

var startY = 1;
var startX = 1;
if (rows % 2 == 1) {
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

class ci {
  constructor () {
    this.wall = undefined
    this.color = ""
  }
}

function createinfo() {
for (let i = 0; i < rows; i++) {
  info[i] = new Array(rows)
}
for (let i = 0; i < rows; i++) {
  for (let j = 0; j < cols; j++) {
    info[i][j] = new ci(i,j)
    info[i][j].wall = grid[i][j].wall
    info[i][j].color = grid[i][j].color
  }
}
}

var start = grid[startY][startX];
var end = grid[endY][endX];
var openSet = [start];
var currentneighbors = [];
var current = grid[startY][startX];

function draw() {
  if (openSet.length == 0) {
    stopTimer()
    noLoop()
    createinfo()
    localStorage.setItem("info", JSON.stringify(info))
  } else {
  current.wall = false;
  for (let i = 0; i < current.neighbors.length; i++) {
    let neighbor = current.neighbors[i]
    if (neighbor.wall) {
      currentneighbors.push(neighbor)
    }
  }
    if (currentneighbors.length == 0) {
      openSet.shift()
      openSet.shift()
      current = openSet[0]
    } else {
      let cho = Math.floor(Math.random(1)*currentneighbors.length)
      let temp = currentneighbors[cho];
      if (current.j == temp.j-2) {
        grid[current.j+1][current.i].wall = false
        openSet.unshift(grid[current.j+1][current.i])
      } else if (current.i == temp.i+2) {
        grid[current.j][current.i-1].wall = false
        openSet.unshift(grid[current.j][current.i-1])
      } else if (current.j == temp.j+2) {
        grid[current.j-1][current.i].wall = false
        openSet.unshift(grid[current.j-1][current.i])
      } else if (current.i == temp.i-2) {
        grid[current.j][current.i+1].wall = false
        openSet.unshift(grid[current.j][current.i+1])
      }
      current = currentneighbors[cho]
      openSet.unshift(current)
    }
 }
 currentneighbors = [];
 draw_grid();
 }