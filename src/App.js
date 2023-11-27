import Game from "./Game";
import "./style.css";

function App() {
  return (
    <div className="app">
      <header>
        <h1>Conway's Game Of Life</h1>
      </header>
      <Game></Game>
    </div>
  );
}

export default App;
