import React, { useEffect, useState, useCallback } from 'react';
import { Header } from './../Header';
import { Login } from './../Login';
import './App.css';


// function getMeta() {
    // return {
        // rooms: Object.keys(rooms).length,
        // users: Object.values(rooms).reduce((acc, users) => acc + users.length, 0),
    // }
// }

interface User {
  user: string;
  rate: null | number;
}

interface Room {
  [detail: string]: User;
}

const ws = new WebSocket(`ws://localhost:8082`);

const getUserName = () => {
  const fromStorage = localStorage.getItem('user');
  return typeof fromStorage ? fromStorage as string : '';
}
// const ws = new WebSocket(`ws://api.gogodev.ru:8082`);
export const App: React.FC<{}> = () => {
  const [isOnline, setOnline] = useState<boolean>(false);
  const [rooms, setRooms] = useState<{ [detail: string]: Room }>({});
  const [room, setRoom] = useState<string | null>(null);
  const [user, setUser] = useState<string>(getUserName());
  const isAuth = useCallback(() => room !== null && user, [room, user]);

  useEffect(() => {
    ws.onmessage = (msg) => {
      setRooms(JSON.parse(msg.data));
    };

    ws.onopen = () => {
      setOnline(true);
      const roomSession = sessionStorage.getItem('room');
      const userSession = sessionStorage.getItem('user');
      
      if (userSession == null || roomSession == null) {
        return;
      }

      setRoom(roomSession);
      setUser(userSession);
    };
  });

  const onLogin = useCallback(({ room, user }) => {
    if (room in rooms && user in rooms[room]) {
      return;
    }
    setRoom(room);
    setUser(user);
    sessionStorage.setItem('room', room);
    sessionStorage.setItem('user', user);
    localStorage.setItem('user', user);
    ws.send(JSON.stringify({room, user, rate: null, command: 'addUser'}));
  }, [rooms]);

  const onLogout = useCallback(() => {    
    ws.send(JSON.stringify({room, user, command: 'deleteUser'}));
    sessionStorage.removeItem('room');
    sessionStorage.removeItem('user');
    setRoom(null);
  }, [room, user]);

  const consoleData = useCallback(() => {
    return (
      <>
        <p>rooms: {Object.keys(rooms).length}</p>
        <p>users: {Object.values(rooms).reduce((acc, users) => acc + Object.keys(users).length, 0)}</p>
      </>
    )
  }, [rooms]);


  return (
    <div className="app">
      <Header online={isOnline} room={room} user={user} onLogout={onLogout} />
      <div className='workspace'>
        {isOnline ? 
        !isAuth() ? <Login name={user} onLogin={onLogin} /> : null
        : <p>We have a problems at server</p>
        }
      </div>
      <div className="console">
        {consoleData()}
      </div>
    </div>
  );
}

export default App;
