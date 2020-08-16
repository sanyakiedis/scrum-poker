import React from 'react';
import './Header.css';

interface HeaderProps {
    online: boolean;
    room: string | null;
    user: string;
    onLogout: () => void;
    onConsole: () => void;
    onSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({ online, user, room, onLogout, onConsole, onSettings }) => {
  return (
    <header className="header">
        <h1>Scrum Poker</h1>
        <div className="controls">

            {room !== null ? (
              <>
                <p className='about-user'>{user}</p>
                <p className='about-user'>Room: {room}</p>
                <button title='Console' className='top-button code' onClick={onConsole}></button>
                <button title='Settings' className='top-button gear' onClick={onSettings}></button>
                <button title='Logout' className='top-button logout' onClick={onLogout}></button>
              </>
            ) : null}

            <div className={`status ${online ? 'online' : 'offline'}`}>
                {online ? 'Online' : 'Offline'}
            </div>
        </div>
    </header>
  );
}

export default Header;
