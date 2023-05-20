import { useEffect, useState } from "react";
import "./play.css";

export function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    console.log(`${a} ${b} ${c}`)

    if (
        squares[a].value !== ''
        && squares[a].value === squares[b].value
        && squares[a].value === squares[c].value
    ) {
      return squares[a].value;
    }
  }
  return null;
}

class Square {
  constructor(isActive = false, value = "") {
    this.isActive = isActive;
    this.value = value;
  }
}

function ResetButton({ onButtonClick }) {
  return (
    <button className="reset" onClick={onButtonClick}>
      Reset
    </button>
  );
}

function SquareComponent({ square, onSquareClick }) {
  return (
    <button
      className={square.isActive ? "square active" : "square"}
      onClick={onSquareClick}
    >
      {square.value}
    </button>
  );
}

export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(new Square()));
  const [status, setStatus] = useState();
  const [end, setEnd] = useState(false);

  useEffect(() => {

    setStatus(`Next Player: ${xIsNext ? "X" : "O"}`)

    if (calculateWinner(squares)) {
      setStatus(`Winner: ${xIsNext ? "O" : "X"}`);
      setEnd(true);
    }

    if (
      !calculateWinner(squares) &&
      squares.every((element) => element.isActive)
    ) {
      setStatus("Draw!");
      setEnd(true);
    }

  }, [xIsNext]);

  function handleClick(i) {

    if (squares[i].value !== "") return;
    if (end) return;

    if (xIsNext) {
      squares[i] = new Square(true, "X");
    } else {
      squares[i] = new Square(true, "O");
    }

    
    setSquares(squares);
    setXIsNext(!xIsNext);
  }

  function handleReset() {
    setSquares(Array(9).fill(new Square(false, "")));
    setXIsNext(true);
    setStatus(`Next Player: X`);
    setEnd(false);
  }

  return (
    <>
      <div className="board-main">
        <div className="status">
          <h1>{status}</h1>
        </div>
        <div className="board-row">
          <SquareComponent
            square={squares[0]}
            onSquareClick={() => handleClick(0)}
          />
          <SquareComponent
            square={squares[1]}
            onSquareClick={() => handleClick(1)}
          />
          <SquareComponent
            square={squares[2]}
            onSquareClick={() => handleClick(2)}
          />
        </div>

        <div className="board-row">
          <SquareComponent
            square={squares[3]}
            onSquareClick={() => handleClick(3)}
          />
          <SquareComponent
            square={squares[4]}
            onSquareClick={() => handleClick(4)}
          />
          <SquareComponent
            square={squares[5]}
            onSquareClick={() => handleClick(5)}
          />
        </div>

        <div className="board-row">
          <SquareComponent
            square={squares[6]}
            onSquareClick={() => handleClick(6)}
          />
          <SquareComponent
            square={squares[7]}
            onSquareClick={() => handleClick(7)}
          />
          <SquareComponent
            square={squares[8]}
            onSquareClick={() => handleClick(8)}
          />
        </div>
        <div>
          <ResetButton onButtonClick={() => handleReset()} />
        </div>
      </div>
    </>
  );
}