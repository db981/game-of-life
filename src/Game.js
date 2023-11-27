import { useEffect, useRef, useState } from "react"

export default function Game() {
  const cellSize = 50;
  const canvas = useRef();
  const [cells, setCells] = useState();
  const [runSimulation, setRunSimulation] = useState(false);

  useEffect(() => {
    let { height, width } = canvas.current.getBoundingClientRect();
    console.log(height, width, cellSize);
    let rows = height / cellSize;
    let cols = width / cellSize;
    console.log(rows, cols);
  }, [])

  const drawCells = () => {
    let context = canvas.current.getContext("2d");
    let { height, width } = canvas.current.getBoundingClientRect();
    context.clearRect(0, 0, width, height);
    //draw cells
    drawGrid(context, width, height);
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

  return (
    <div className="gameArea">
      <div className="game">
        <canvas ref={canvas} className="gameCanvas" width="1000px" height="500px"></canvas>
        <span className="gameControls">
          <button onClick={drawCells}>Draw</button>
        </span>
      </div>
    </div>
  )
}
