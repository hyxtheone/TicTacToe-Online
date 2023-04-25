const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server, { cors: { origin: "*"}})

app.get("/", (req, res) => {
  return res.json("Hello, World!");
});

const port = process.env.PORT || 3001;
let xIsNext = true;

function next() {
  if (xIsNext) {
    return "X";
  } else {
    return "O";
  }
}

function draw(squares) {
  if (
    !calculateWinner(squares) &&
    squares.every((element) => element.isActive)
  ) {
    return true;
  }
}

io.on("connection", (socket) => {
  socket.on("set_channel", (room) => {
    let players = [];
    socket.join(room);
    if (io.sockets.adapter.rooms.get(room).size <= 2) {
      io.sockets.adapter.rooms.get(room).forEach((element) => {
        players = [...players, element];
      });
      io.to(players[0]).emit("set_side", "X");
      io.to(players[1]).emit("set_side", "O");
      io.to(room).emit("room", room);
      socket.on("set_played", (lugar, squares) => {
        if (players[0] === socket.id && next() === "X") {
          squares[lugar].value = "X";
          squares[lugar].isActive = true;
          xIsNext = false;
          if (draw(squares)) {
            io.to(room).emit("draw");
            io.to(room).emit("receive_play", squares);
          } else if (calculateWinner(squares)) {
            io.to(room).emit("winner", "X");
            io.to(room).emit("receive_play", squares);
          } else {
            io.to(room).emit("next_player", "O");
            io.to(room).emit("receive_play", squares);
          }
        } else if (players[1] === socket.id && next() === "O") {
          squares[lugar].value = "O";
          squares[lugar].isActive = true;
          xIsNext = true;
          if (draw(squares)) {
            io.to(room).emit("draw");
            io.to(room).emit("receive_play", squares);
          } else if (calculateWinner(squares)) {
            io.to(room).emit("winner", "O");
            io.to(room).emit("receive_play", squares);
          } else {
            io.to(room).emit("next_player", "X");
            io.to(room).emit("receive_play", squares);
          }
        }
      });
    } else if (io.sockets.adapter.rooms.get(room).size > 2) {
      io.to(socket.id).emit("lot", room);
    }
  });
});

server.listen(port, () => {
  console.log("Server starting...");
});


function calculateWinner(squares) {
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
