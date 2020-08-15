import React, { useCallback } from 'react';
import { Card } from './../Card';
import './Poker.css';

import { Room } from './../../api';

interface PokerProps {
  users: Room;
  rate: string | null;
  onRate: (rate: string) => void;
}

const cards = ['?', '0.5', '1', '2', '3', '5', '8', '13', '21'];

export const Poker: React.FC<PokerProps> = ({ users, rate, onRate }) => {
  const usersArray = useCallback(() => {
    return Object.values(users);
  }, [users]);

  const unreadyUsers = useCallback(() => {
    return usersArray().filter((u) => u.rate === null).map((u) => u.user);
  }, [usersArray]);

  const isHidden = useCallback(() => {
    return rate === null || unreadyUsers().length > 0;
  }, [rate, unreadyUsers]);

  return (
    <div className="poker">
      <div className='slots'>
        {usersArray().map((slot) => {
          return (
            <div className='slot' key={slot.user}>
              <Card isHidden={isHidden()} rate={slot.rate} />
              <p>{slot.user}</p>
            </div>
          )
        })}
      </div>
      <div className='user-cards'>
        {cards.map((card) => <Card key={card} isSelected={rate === card} rate={card} onSelect={onRate} />)}
      </div>
    </div>
  );
}

export default Poker;
