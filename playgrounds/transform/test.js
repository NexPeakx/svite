export function foo() {
  console.log("foo");
}

foo();

const ws = new WebSocket("ws://localhost:8080");

ws.onopen = () => {
  console.log("connected");
};

ws.onmessage = (e) => {
  console.log(e.data);
};

ws.onclose = () => {
  console.log("disconnected");
};
