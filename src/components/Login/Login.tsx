import React, { useState, FormEvent } from 'react';
import './Login.css';

interface LoginProps {
    name: string;
    onLogin: (e: {user: string, room: string}) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin, name }) => {
  const [room, setRoom] = useState<string>('');
  const [user, setUser] = useState<string>(name);

  const setRoomHandler = (e: React.FormEvent<HTMLInputElement>) => {
    setRoom(e.currentTarget.value);
  }

  const setUserHandler = (e: React.FormEvent<HTMLInputElement>) => {
    setUser(e.currentTarget.value);
  }

  const keyPressHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.keyCode === 13) {
      onLoginHandler();
    }
  }

  const onLoginHandler = () => {
    onLogin({ room, user });
  }

  return (
    <div className='login'>
      <input type="text" placeholder='Name' value={user} onKeyPress={keyPressHandler} onChange={setUserHandler} />
      <input type="number" placeholder='Room' value={room} onKeyPress={keyPressHandler} onChange={setRoomHandler} />
      <button onClick={onLoginHandler}>Let's go!</button>
    </div>
  );
}

export default Login;
