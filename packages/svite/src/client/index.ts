// 创建客户端websocket，将这段代码注入打开的html中，用于js代码修改后，会自动刷新页面
function createClientWebSocket() {
  const ws = new WebSocket("ws://localhost:8080/ws");

  ws.addEventListener("open", function (event) {
    // ws.send(JSON.stringify({ type: "connected" }));
  });

  ws.addEventListener("message", function (event) {
    const data = JSON.parse(event.data);
    if (data.type === "change") {
      // 刷新
      location.reload();
    }
  });
}

createClientWebSocket();
