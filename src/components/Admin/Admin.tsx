import React from 'react';
import './Admin.css';
import { Room } from '../../api';

interface CardProps {
  users: Room;
  onDelete: (user: string) => void;
  onReset: () => void;
}

export const Admin: React.FC<CardProps> = ({ users, onDelete, onReset }) => {
  return (
    <ul className='admin'>
      {Object.values(users).map(({ user }) => {
        return <li>{user} <button onClick={() => onDelete(user)}>X</button></li>
      })}
      <li><button onClick={onReset}>RESET ALL</button></li>
    </ul>
  );
}

export default Admin;
