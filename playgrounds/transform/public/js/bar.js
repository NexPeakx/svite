// import { foo } from "../../test";

export function bar() {
  console.log("bar");
  const span = document.getElementById('startSpan');
  span.textContent = 'bar vite started!';
  // foo();
}

bar();