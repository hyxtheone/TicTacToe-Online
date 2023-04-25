import { useEffect, useState } from "react";
import "./online.css";
import { socket } from "../../services/socket";

class Square {
  constructor(isActive = false, value = "") {
    this.isActive = isActive;
    this.value = value;
  }
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
  const [squares, setSquares] = useState(Array(9).fill(new Square()));
  const [status, setStatus] = useState("Next Player: X");
  const [played, setPlayed] = useState(false);
  const [end, setEnd] = useState(false);
  const [side, setSide] = useState("");
  const [room, setRoom] = useState("")
  const newSquares = [...squares];

  useEffect(() => {
    socket.on("receive_play", (play) => {
      setSquares(play);
    });

    socket.on("next_player", (next) => {
      setStatus(`Next Player: ${next}`);
    });

    socket.on("winner", (winner) => {
      setStatus(`Winner: ${winner}`);
      setEnd(true);
    });

    socket.on("draw", () => {
      setStatus("Draw!");
      setEnd(true);
    });

  }, [played]);

  useEffect(() => {

    socket.on("waiting", () => {
      setSide("Waiting Players")
    })

    socket.on("set_side", (side) => {
      setSide(`Your side is: ${side}`);
    });
    socket.on("room", (room) => {
      setRoom(`Connected on ${room}`)
    })
    
    socket.on("lot", (room) => {
      setRoom(`A sala ${room} está cheia`)
    })

  }, [])

  function handleClick(i) {
    if (newSquares[i].value !== "") return;

    if (end) return;

    socket.emit("set_played", i, newSquares);
    setPlayed(!played);
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
          <h2 className="side">{side}</h2>
          <h2 className="side">{room}</h2>
        </div>
      </div>
    </>
  );
}
