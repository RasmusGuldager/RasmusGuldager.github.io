const {rows,cols,w} = JSON.parse(localStorage.getItem("grid"));

const PrevGrid = JSON.parse(localStorage.getItem("OwnGrid"))

let erase = localStorage.getItem("erase") == "true"
document.getElementById("checkbox").checked = localStorage.getItem("erase") == "true"

document.querySelector("input").addEventListener("click", () => {
    erase = document.getElementById("checkbox").checked
    localStorage.setItem("erase", erase)
})

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
  }

  this.clicked = () => {
      if (mouseX < this.i*w + w && mouseX > this.i*w && mouseY < this.j*w + w && mouseY > this.j*w) {
        if (erase) {
          this.wall = false
          this.weight = Math.floor(Math.random(1)*5+1)
          this.color = "white"
          return
        }
        this.wall = true
        this.weight = 0
        this.color = "black"
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
    this.weight = 0
  }
}

for (let i = 0; i < rows; i++) {
  owngrid[i] = new Array(rows)
} 
for (let i = 0; i < rows; i++) {
  for (let j = 0; j < rows; j++) {
    owngrid[i][j] = new ci(i,j)
  }
}

document.addEventListener("DOMContentLoaded", () => {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].wall = PrevGrid[i][j].wall
      grid[i][j].color = PrevGrid[i][j].color
      grid[i][j].weight = PrevGrid[i][j].weight
    }
  }
})

function reload() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < rows; j++) {
      if (grid[i][j].wall) {
        grid[i][j].weight = Math.floor(Math.random(1)*5+1)
      }
      grid[i][j].wall = false
      grid[i][j].color = "white"
    }
  }
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      owngrid[i][j].wall = grid[i][j].wall
      owngrid[i][j].color = grid[i][j].color
      owngrid[i][j].weight = grid[i][j].weight
    }
  }
  localStorage.setItem("OwnGrid", JSON.stringify(owngrid))
}

function randomize() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < rows; j++) {
      if (!grid[i][j].wall) {
        grid[i][j].weight = Math.floor(Math.random(1)*5+1)
      }
    }
  }
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
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
frameRate(60)
if(mouseIsPressed) {
for (let i = 0; i < rows; i++) {
  for (let j = 0; j < rows; j++) {
      grid[j][i].clicked()
    }
}
for (let i = 0; i < rows; i++) {
  for (let j = 0; j < cols; j++) {
    owngrid[i][j].wall = grid[i][j].wall
    owngrid[i][j].color = grid[i][j].color
    owngrid[i][j].weight = grid[i][j].weight
  }
}
localStorage.setItem("OwnGrid", JSON.stringify(owngrid))
}
draw_grid();
}