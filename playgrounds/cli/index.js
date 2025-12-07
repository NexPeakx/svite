const span = document.getElementById("startSpan");
span.textContent = "vite started! change test";
console.log("vite started!");

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
