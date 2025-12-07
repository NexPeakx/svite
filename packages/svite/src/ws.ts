import { WebSocketServer } from "ws";
// import type { WebSocket } from "ws";

export function createWsServer() {
  const ws = new WebSocketServer({ port: 8080 });

  ws.on("connection", (socket) => {
    console.log("connected");

    socket.on("message", (raw) => {
      console.log("received: %s", JSON.parse(String(raw)));
    });

    socket.send(JSON.stringify({ type: "connect" }));
  });
  return ws;
}
