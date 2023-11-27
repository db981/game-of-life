import { useEffect, useRef, useState } from "react"

export default function Game() {
  const cellSize = 50;
  const canvas = useRef();
  const [cells, setCells] = useState();
  const [runSimulation, setRunSimulation] = useState(false);

  useEffect(() => { //initialize cells array
    let { height, width } = canvas.current.getBoundingClientRect();
    let rows = Math.floor(height / cellSize);
    let cols = Math.floor(width / cellSize);
    let arr = new Array(cols).fill(false);
    for (let i = 0; i < arr.length; i++) {
      arr[i] = new Array(rows).fill(false);
    }
    setCells(arr);
  }, []);

  useEffect(() => {
    if (!cells) {
      return;
    }
    let context = canvas.current.getContext("2d");
    let { height, width } = canvas.current.getBoundingClientRect();
    context.clearRect(0, 0, width, height);
    drawCells(context);
    drawGrid(context, width, height);
  }, [cells]);

  const drawCells = (context) => {
    for (let i = 0; i < cells.length; i++) {
      for (let j = 0; j < cells[i].length; j++) {
        if (cells[i][j]) {
          let { x, y } = indexToCoordinates(i, j);
          drawRectAt(context, x, y);
        }
      }
    }
  }

  const drawRectAt = (context, x, y) => {
    context.beginPath();
    context.fillStyle = "#33FF00";
    context.fillRect(x, y, cellSize, cellSize);
  }

  const drawGrid = (context, width, height) => {
    context.lineWidth = "2";
    context.strokeStyle = "black";
    context.beginPath();
    for (let x = 0; x <= width; x += cellSize) {
      context.moveTo(x, 0);
      context.lineTo(x, height);
    }
    for (let y = 0; y <= height; y += cellSize) {
      context.moveTo(0, y);
      context.lineTo(width, y);
    }
    context.stroke();
  }

  const canvasClick = (e) => { //if simulation not running, allow user to add a cell at the specified array
    if (!runSimulation) {
      const rect = canvas.current.getBoundingClientRect();
      let x = e.clientX - rect.left;
      let y = e.clientY - rect.top;
      x -= x % cellSize;
      y -= y % cellSize;
      let { i, j } = coordinatesToIndex(x, y);
      let copy = [...cells];
      copy[i][j] = !copy[i][j]
      setCells(copy);
    }
  }

  const coordinatesToIndex = (x, y) => {
    let i = x / cellSize;
    let j = y / cellSize;
    return { i, j };
  }

  const indexToCoordinates = (i, j) => {
    let x = i * cellSize;
    let y = j * cellSize;
    return { x, y };
  }

  return (
    <div className="gameArea">
      <div className="game">
        <canvas ref={canvas} onClick={canvasClick} className="gameCanvas" width="1000px" height="500px"></canvas>
        <span className="gameControls">
          <button></button>
        </span>
      </div>
    </div>
  )
}
