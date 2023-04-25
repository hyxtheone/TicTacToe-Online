const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {cors: {origin: "*"}})

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

function setPlay(squares, lugar, room) {
  squares[lugar].value = xIsNext ? 'X' : 'O';
  squares[lugar].isActive = true;
  if (draw(squares)) {
    io.to(room).emit("draw");
    io.to(room).emit("receive_play", squares);
    players = []
  } else if (calculateWinner(squares)) {
    io.to(room).emit("winner", xIsNext ? 'X' : 'O');
    io.to(room).emit("receive_play", squares);
    players = []
  } else {
    io.to(room).emit("next_player", xIsNext ? 'O' : 'X');
    io.to(room).emit("receive_play", squares);
  }
  xIsNext = !xIsNext;
}

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
      squares[a] &&
      squares[a].value === squares[b].value &&
      squares[a].value === squares[c].value
    ) {
      return squares[a].value;
    }
  }

  return null;
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
    io.to(room).emit("room", room);
    if (io.sockets.adapter.rooms.get(room).size < 2) {
      io.to(room).emit("waiting");
    }

    if (io.sockets.adapter.rooms.get(room).size <= 2)
      io.sockets.adapter.rooms.get(room).forEach((element) => {
        players = [...players, element];
      });
    
    if (io.sockets.adapter.rooms.get(room).size == 2) {
      io.to(players[0]).emit("set_side", "X");
      io.to(players[1]).emit("set_side", "O");
    }

    if (io.sockets.adapter.rooms.get(room).size > 2) {
      io.to(socket.id).emit("lot", room);
    }

    socket.on("set_played", (lugar, squares) => {

      if (io.sockets.adapter.rooms.get(room).size < 2) return
      
      if (players[0] == socket.id && next() == "X") {
        setPlay(squares, lugar, room)
        console.log(squares)
      } else if (players[1] == socket.id && next() == "O") {
        setPlay(squares, lugar, room)
        console.log(squares)
      }
    });
  });
});

server.listen(port, () => {
  console.log("Server starting...");
});
