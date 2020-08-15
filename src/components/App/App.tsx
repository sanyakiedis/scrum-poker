import React, { useEffect, useState, useCallback } from 'react';
import { Header } from './../Header';
import { Login } from './../Login';
import { Poker } from './../Poker';
import { Rooms } from './../../api';
import './App.css';

const ws = new WebSocket(`ws://localhost:8082`);

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
// const ws = new WebSocket(`ws://api.gogodev.ru:8082`);
export const App: React.FC<{}> = () => {
  const [isOnline, setOnline] = useState<boolean>(false);
  const [rooms, setRooms] = useState<Rooms>({});
  const [room, setRoom] = useState<string | null>(getRoom());
  const [user, setUser] = useState<string>(getUserName());
  const [rate, setRate] = useState<string | null>(null);

  const isAuth = useCallback(() => room !== null && user, [room, user]);

  useEffect(() => {
    ws.onmessage = (msg) => {
      setRooms(JSON.parse(msg.data));
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
    sessionStorage.setItem('room', login.room);
    sessionStorage.setItem('user', login.user);
    localStorage.setItem('user', login.user);
    ws.send(JSON.stringify({...login, rate: '', command: 'addUser'}));
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


  return (
    <div className="app">
      <Header online={isOnline} room={room} user={user} onLogout={onLogout} />
      <div className='workspace'>
        {isOnline ? 
        !isAuth() ? <Login name={user} onLogin={onLogin} /> : <Poker onRate={onRate} rate={rate} users={currentRoom()} />
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
