// App.js
import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [workers, setWorkers] = useState([]);
  const [results, setResults] = useState([]);
  const [completedCount, setCompletedCount] = useState(0);
  const workerCount = 4; // Set the number of workers you need
  const fibonacciNumbers = [40, 41, 42, 43]; // Example tasks for each worker

  useEffect(() => {
    if (window.Worker) {
      const newWorkers = [];

      for (let i = 0; i < workerCount; i++) {
        const newWorker = new Worker(new URL('./worker.js', import.meta.url));
        newWorker.onmessage = (event) => {
          console.log(event);
          setResults((prevResults) => {
            const newResults = [...prevResults];
            newResults[i] = event.data;
            return newResults;
          });
          setCompletedCount((prevCount) => prevCount + 1);
        };
        newWorkers.push(newWorker);
      }

      setWorkers(newWorkers);

      return () => {
        newWorkers.forEach(worker => worker.terminate());
      };
    }
  }, []);

  const handleClick = () => {
    setCompletedCount(0);
    setResults(Array(workerCount).fill(null));
    if (workers.length > 0) {
      workers.forEach((worker, index) => {
        worker.postMessage(fibonacciNumbers[index]); // Send data to each worker
      });
    }
  };

  return (
    <div>
      <button onClick={handleClick}>Start Workers</button>
      {results.map((result, index) => (
        <p key={index}>Result from Worker {index + 1}: {result}</p>
      ))}
      {completedCount === workers.length && <p>Finished</p>}
    </div>
  );
}

export default App;
