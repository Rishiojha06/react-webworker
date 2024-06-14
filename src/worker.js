// worker.js
self.onmessage = function(event) {
  const n = event.data;

  function fibonacci(num) {
    if (num <= 1) return num;
    return fibonacci(num - 1) + fibonacci(num - 2);
  }

  const result = fibonacci(n);
  self.postMessage(result);
};
