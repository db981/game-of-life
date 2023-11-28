import { useEffect, useRef, useState } from "react"

export default function Game() {
  const cellSize = 25;
  const simulationPeriodMs = 500;
  const canvas = useRef();
  const [generation, setGeneration] = useState(0);
  const [cells, setCells] = useState();
  const [nextCells, setNextCells] = useState();
  const [runSimulation, setRunSimulation] = useState(false);

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    if (cells && !runSimulation) {
      setNextCells(simulateCycle(cells)); //user making placements, generate next cycle
    }
  }, [cells]);

  useEffect(() => {
    if (nextCells) { //draw whenever nextCells is updated
      draw();
    }
  }, [nextCells])

  useEffect(() => { //simulate next cycle simulationPeriodMs after nextCells is updated
    let simulationTimeout;
    if (runSimulation) {
      simulationTimeout = setTimeout(() => {
        setCells(nextCells); //cells is now next cells
        setNextCells(simulateCycle(nextCells)); //regenerate next cells
        setGeneration(generation + 1);
      }, simulationPeriodMs);
    }

    return () => {
      clearTimeout(simulationTimeout); //clear timeout if user paused the simulation
    }
  }, [runSimulation, nextCells]);

  const initialize = () => { //initialize cells array full of false values and set generation to 0
    let { height, width } = canvas.current.getBoundingClientRect();
    let rows = Math.floor(height / cellSize);
    let cols = Math.floor(width / cellSize);
    let arr = new Array(cols).fill(false);
    for (let i = 0; i < arr.length; i++) {
      arr[i] = new Array(rows).fill(false);
    }
    setCells(arr);
    setGeneration(0);
  }

  const simulateCycle = (seed) => { //create next cycle of the specified "seed" array
    let next = new Array(seed.length);
    for (let i = 0; i < seed.length; i++) {
      next[i] = new Array(seed[i].length).fill(false); //assume all are dead next state
      for (let j = 0; j < seed[i].length; j++) {
        let neighbours = getNeighbours(seed, i, j);
        if (seed[i][j] === true) { //cell alive
          if (neighbours === 2 || neighbours === 3) { //2 or 3 neighbours, stay alive 
            next[i][j] = true;
          }
        }
        else { //cell dead
          if (neighbours === 3) { //3 neighbours, alive by reproduction
            next[i][j] = true;
          }
        }
      }
    }
    return next;
  }

  const getNeighbours = (arr, x, y) => { //get alive (true) neighbours of cell at index x, y
    let neighbours = 0;
    let minI = Math.max(x - 1, 0);
    let maxI = Math.min(x + 1, arr.length - 1);
    let minJ = Math.max(y - 1, 0);
    let maxJ = Math.min(y + 1, arr[x].length - 1);
    for (let i = minI; i <= maxI; i++) {
      for (let j = minJ; j <= maxJ; j++) {
        if (i === x && j === y) {
          continue;
        }
        if (arr[i][j] === true) {
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

  const drawCells = (context) => { //iterate cells and draw alive ones
    for (let i = 0; i < cells.length; i++) {
      for (let j = 0; j < cells[i].length; j++) {
        let { x, y } = indexToCoordinates(i, j);
        if (cells[i][j]) {
          drawRectAt(context, x, y, !nextCells[i][j]);
        }
      }
    }
  }

  const drawRectAt = (context, x, y, isDying) => { //draw cell at location, colour red if it is dead next cycle
    context.beginPath();
    context.fillStyle = isDying ? "#FF0000" : "#33FF00"; //red : green
    context.fillRect(x, y, cellSize, cellSize);
  }

  const drawGrid = (context, width, height) => { //draw grid lines
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

  const canvasClick = (e) => { //if simulation not running, allow user to add or remove a cell at the clicked location
    if (!runSimulation) {
      const rect = canvas.current.getBoundingClientRect();
      let x = e.clientX - rect.left;
      let y = e.clientY - rect.top;
      x -= x % cellSize;
      y -= y % cellSize;
      let { i, j } = coordinatesToIndex(x, y);
      let copy = [...cells];
      copy[i][j] = !copy[i][j];
      setCells(copy);
      setGeneration(0);
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
        <h3 className="generationCounter">Generation: {generation}</h3>
        <canvas ref={canvas} onClick={canvasClick} className="gameCanvas" width="1000px" height="500px"></canvas>
        <span className="gameControls">
          <button className="controlButton" disabled={runSimulation} onClick={initialize}>Clear</button>
          <button className="controlButton" disabled={!runSimulation} onClick={toggleRunSimulation}>Stop</button>
          <button className="controlButton" disabled={runSimulation} onClick={toggleRunSimulation}>Play</button>
        </span>
      </div>
    </div>
  )
}
