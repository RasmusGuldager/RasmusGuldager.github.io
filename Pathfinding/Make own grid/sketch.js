const {rows,cols,w} = JSON.parse(localStorage.getItem("grid"));

var grid = new Array(cols);
let owngrid = new Array(cols);

var start;
var end;

let done = false;

class Spot {
  constructor(i,j) {
  this.i = i;
  this.j = j;
  this.color = "white"
  this.wall = false;
  this.weight = Math.floor(Math.random(1)*5+1);
  this.draw_spot = function() {
    fill(color(this.color))
    stroke(0)
    rect(this.i*w,this.j*w,w,w);
    if (done) {
      text(this.weight,this.i*w,(this.j+1)*w)
    }
  }

  this.clicked = () => {
      if (mouseX < this.i*w + w && mouseX > this.i*w && mouseY < this.j*w + w && mouseY > this.j*w) {
        this.wall = true
        this.weight = 0
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
  start.color = "Yellow";
  end.color = "Yellow";
}

function mousePressed() {
  }

var startY = 1;
var startX = 1;
var endY = rows-2;
var endX = cols-2;

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

function createowngrid() {
for (let i = 0; i < rows; i++) {
  owngrid[i] = new Array(rows)
}
for (let i = 0; i < rows; i++) {
  for (let j = 0; j < cols; j++) {
    owngrid[i][j] = new ci(i,j)
    owngrid[i][j].wall = grid[i][j].wall
    owngrid[i][j].color = grid[i][j].color
    owngrid[i][j].weight = grid[i][j].weight
  }
}
localStorage.setItem("OwnGrid", JSON.stringify(owngrid))
}

var start = grid[startY][startX];
var end = grid[endY][endX];

function draw() {
frameRate(30)
if(mouseIsPressed) {
for (let i = 0; i < rows; i++) {
  for (let j = 0; j < rows; j++) {
      grid[j][i].clicked()
    }
}
}
draw_grid();
}