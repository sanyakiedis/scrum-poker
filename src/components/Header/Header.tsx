import React from 'react';
import './Header.css';

interface HeaderProps {
    online: boolean;
    room: string | null;
    user: string;
    onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ online, user, room, onLogout }) => {
  return (
    <header className="header">
        <h1>Scrum Poker</h1>
        <div className="controls">

            {room !== null ? (
              <>
                <p className='about-user'>{user}</p>
                <p className='about-user'>Room: {room}</p>
                <button onClick={onLogout}>logout</button>
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
