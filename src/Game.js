import { useEffect, useRef, useState } from "react"

export default function Game() {
  const cellSize = 50;
  const simulationPeriodMs = 1000;
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

  useEffect(() => { //redraw immediately on cells change
    if (cells) {
      draw();
    }
  }, [cells]);

  useEffect(() => { //simulate next cycle simulationPeriodMs after cells change
    let simulationTimeout;
    if (runSimulation) {
      simulationTimeout = setTimeout(() => {
        simulateCycle();
      }, simulationPeriodMs);
    }

    return () => {
      clearTimeout(simulationTimeout); //clear timeout if user paused the simulation
    }
  }, [runSimulation, cells]);

  const simulateCycle = () => { //iterate through cells to determine next state
    let nextState = new Array(cells.length);
    for (let i = 0; i < cells.length; i++) {
      nextState[i] = new Array(cells[i].length).fill(false); //assume all are dead next state
      for (let j = 0; j < cells[i].length; j++) {
        let neighbours = getNeighbours(i, j);
        if (cells[i][j] === true) { //cell alive
          if (neighbours === 2 || neighbours === 3) { //2 or 3 neighbours, stay alive 
            nextState[i][j] = true;
          }
        }
        else { //cell dead
          if (neighbours === 3) { //3 neighbours, alive by reproduction
            nextState[i][j] = true;
          }
        }
      }
    }
    setCells(nextState);
  }

  const getNeighbours = (x, y) => { //get alive (true) neighbours of cell at index x, y
    let neighbours = 0;
    let minI = Math.max(x - 1, 0);
    let maxI = Math.min(x + 1, cells.length - 1);
    let minJ = Math.max(y - 1, 0);
    let maxJ = Math.min(y + 1, cells[x].length - 1);
    for (let i = minI; i <= maxI; i++) {
      for (let j = minJ; j <= maxJ; j++) {
        if (i == x && j == y) {
          continue;
        }
        if (cells[i][j] == true) {
          neighbours++;
        }
      }
    }
    return neighbours;
  }

  const draw = () => {
    let context = canvas.current.getContext("2d");
    let { height, width } = canvas.current.getBoundingClientRect();
    context.clearRect(0, 0, width, height);
    drawCells(context);
    drawGrid(context, width, height);
  }

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

  const canvasClick = (e) => { //if simulation not running, allow user to add a cell at the clicked location
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

  const toggleRunSimulation = () => {
    setRunSimulation(!runSimulation);
  }

  return (
    <div className="gameArea">
      <div className="game">
        <canvas ref={canvas} onClick={canvasClick} className="gameCanvas" width="1000px" height="500px"></canvas>
        <span className="gameControls">
          <button className="controlButton" disabled={!runSimulation} onClick={toggleRunSimulation}>Stop</button>
          <button className="controlButton" disabled={runSimulation} onClick={toggleRunSimulation}>Play</button>
        </span>
      </div>
    </div>
  )
}
