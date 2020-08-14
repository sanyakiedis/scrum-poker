import React, { useEffect } from 'react';
import './App.css';

const ws = new WebSocket(`ws://${process.env.IP}:8082`);
function App() {
  console.log('erer', process.env.IP);
  useEffect(() => {
    console.log(ws);
    ws.onmessage = (r) => {
      console.log('r', r);
    };

    ws.onopen = () => {
      console.log('open');
    };
  });


  return (
    <div className="App">
      <input type='text' />
    </div>
  );
}

export default App;
