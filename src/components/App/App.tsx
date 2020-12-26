import React, { useEffect, useState, useCallback } from 'react';
import { Header } from './../Header';
import { Login } from './../Login';
import { Poker } from './../Poker';
import { Admin } from './../Admin';
import { Rooms } from './../../api';
import './App.css';

const url = process.env.REACT_APP_WS || 'localhost';
const ws = new WebSocket(`ws://${url}:9000`);

const getUserName = () => {
  const userSession = sessionStorage.getItem('user');
  if (userSession) {
    return userSession;
  }
  const fromLocal = localStorage.getItem('user');
  return typeof fromLocal ? fromLocal as string : '';
}

const getRoom = () => {
  const roomSession = sessionStorage.getItem('room');
  return roomSession || null;
}

export const App: React.FC<{}> = () => {
  const [showConsole, setConsole] = useState<boolean>(false);
  const [showAdmin, setAdmin] = useState<boolean>(false);
  const [isOnline, setOnline] = useState<boolean>(false);
  const [rooms, setRooms] = useState<Rooms>({});
  const [room, setRoom] = useState<string | null>(getRoom());
  const [user, setUser] = useState<string>(getUserName());
  const [rate, setRate] = useState<string | null>(null);

  const isAuth = useCallback(() => room !== null && user, [room, user]);

  useEffect(() => {
    ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      setRooms(data);
      if (room && room in data && user in data[room]) {
        setRate(data[room][user].rate);
      }
    };

    ws.onopen = () => {
      setOnline(true);    
      if (room !== null && user !== '') {
        
        ws.send(JSON.stringify({room, user, rate: null, command: 'addUser'}));
      }
    };

    ws.onclose = () => {
      setOnline(false);
    };
  });

  const currentRoom = useCallback(() => {
    return room && room in rooms? rooms[room]: {};
  }, [rooms, room]);

  const onLogin = useCallback((login) => {
    if (login.room in rooms && login.user in rooms[login.room]) {
      return;
    }
    setRoom(login.room);
    setUser(login.user);
    setRate(null);
    sessionStorage.setItem('room', login.room);
    sessionStorage.setItem('user', login.user);
    localStorage.setItem('user', login.user);
    ws.send(JSON.stringify({...login, rate: null, command: 'addUser'}));
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

  const onRate = useCallback((r) => {
    const prepared = r === rate ? null : r;
    setRate(prepared);
    ws.send(JSON.stringify({room, user, rate: prepared, command: 'setRate'}));
  }, [room, user, rate]);

  const onDelete = useCallback((u) => {
    ws.send(JSON.stringify({room, user: u, command: 'deleteUser'}));
  }, [room]);

  const onReset = useCallback(() => {
    ws.send(JSON.stringify({room, user, command: 'resetRates'}));
  }, [room, user]);

  return (
    <div className="app">
      <Header
        online={isOnline}
        room={room}
        user={user}
        onLogout={onLogout}
        onSettings={() => setAdmin(!showAdmin)}
        onConsole={() => setConsole(!showConsole)} />
      <div className='workspace'>
        {isOnline ? 
        !isAuth() ? <Login name={user} onLogin={onLogin} /> : <Poker onRate={onRate} rate={rate} users={currentRoom()} />
        : <p>We have a problems at server</p>
        }
      </div>
      {showAdmin ? <Admin users={currentRoom()} onDelete={onDelete} onReset={onReset} /> : null}
      {showConsole ? <div className="console">{consoleData()}</div> : null}
    </div>
  );
}

export default App;
