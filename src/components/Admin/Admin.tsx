import React from 'react';
import './Admin.css';
import { Room } from '../../api';

interface CardProps {
  users: Room;
  onDelete: (user: string) => void;
}

export const Admin: React.FC<CardProps> = ({ users, onDelete }) => {
  return (
    <ul className='admin'>
      {Object.values(users).map(({ user }) => {
        return <li>{user} <button onClick={() => onDelete(user)}>X</button></li>
      })}
    </ul>
  );
}

export default Admin;
