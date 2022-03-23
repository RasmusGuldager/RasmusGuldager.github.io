if (localStorage.getItem("grid") !== null) {
    let {rows,w,walls} = JSON.parse(localStorage.getItem("grid")) 
    document.getElementById("rowsCols").value = rows
    document.getElementById("width").value = Math.round(w*rows)
    document.getElementById("walls").value = walls
} else {
    document.getElementById("rowsCols").value = 30
    document.getElementById("width").value = 450
    document.getElementById("walls").value = 50
}

document.getElementById("checkbox1").checked = localStorage.getItem("useMaze") == "true"
document.getElementById("checkbox2").checked = localStorage.getItem("useOwnGrid") == "true"

document.querySelectorAll('input[type="checkbox"]')[0].addEventListener("click", () => {
    const useMaze = document.getElementById("checkbox1").checked
    localStorage.setItem("useMaze", useMaze)
    if (document.getElementById("checkbox1").checked && document.getElementById("checkbox2").checked) {
      document.getElementById("checkbox2").checked = false
      localStorage.setItem("useOwnGrid", false)
    }
})

document.querySelectorAll('input[type="checkbox"]')[1].addEventListener("click", () => {
  const useOwnGrid = document.getElementById("checkbox2").checked
  localStorage.setItem("useOwnGrid", useOwnGrid)
  if (document.getElementById("checkbox1").checked && document.getElementById("checkbox2").checked) {
    document.getElementById("checkbox1").checked = false
    localStorage.setItem("useMaze", false)
  }
})

for (let i = 0; i <= 5; i++) {
    document.querySelectorAll('a')[i].addEventListener("click", () => {
        if (document.getElementById("rowsCols").value < 5 || document.getElementById("width").value < document.getElementById("rowsCols").value * 4 || document.getElementById("rowsCols").value > 100 || document.getElementById("walls").value < 0 || document.getElementById("walls").value > 100) {
              window.alert("Maze is too large or too small")
              document.getElementById("path1").href = ""
              document.getElementById("path2").href = ""
              document.getElementById("path3").href = ""
              document.getElementById("path4").href = ""
              document.getElementById("maze1").href = ""
              document.getElementById("maze2").href = ""
         } else {
            rows = document.getElementById("rowsCols").value;
            cols = document.getElementById("rowsCols").value;
            w = document.getElementById("width").value/rows;
            walls = document.getElementById("walls").value;
            localStorage.setItem("grid", JSON.stringify({rows:rows,cols:cols,w:w,walls:walls}))
            }
})}

document.querySelectorAll('button')[2].addEventListener("click", () => {
  if (document.getElementById("rowsCols").value < 5 || document.getElementById("width").value < document.getElementById("rowsCols").value * 4 || document.getElementById("rowsCols").value > 100 || document.getElementById("walls").value < 0 || document.getElementById("walls").value > 100) {
      window.alert("Maze is too large or too small")
      window.location.href = ""
  } else {
      rows = document.getElementById("rowsCols").value;
      cols = document.getElementById("rowsCols").value;
      w = document.getElementById("width").value/rows;
      walls = document.getElementById("walls").value;
      localStorage.setItem("grid", JSON.stringify({rows:rows,cols:cols,w:w,walls:walls}))
  }
})

for (let i = 0; i <= 3; i++) {
  document.querySelectorAll(".path")[i].addEventListener("click", () => {
    let {rows} = JSON.parse(localStorage.getItem("grid"))
    if (localStorage.getItem("useMaze") == "true" && rows != JSON.parse(localStorage.getItem("info")).length) {
      window.alert("Generate a maze first")
      document.getElementById("path1").href = ""
      document.getElementById("path2").href = ""
      document.getElementById("path3").href = ""
      document.getElementById("path4").href = ""
    }
  })
}