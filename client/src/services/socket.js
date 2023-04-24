import io from "socket.io-client";

export const socket = await io.connect("https://tictactoe-server-l1xa.vercel.app");