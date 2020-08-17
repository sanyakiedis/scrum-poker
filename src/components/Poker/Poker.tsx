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

  const rates = useCallback(() => {
    const ratesObject = usersArray().reduce((acc: { [detail: string]: string[] }, u) => {
      const preparedRate = u.rate ? u.rate : 'unrated';
      if (!(preparedRate in acc)) {
        acc[preparedRate] = [];
      }
      acc[preparedRate].push(u.user);
      return acc;
    }, {});
    return Object.keys(ratesObject).sort((a, b) => parseFloat(a) - parseFloat(b)).map((key) => ({ rate: key, users: ratesObject[key] }));
  }, [usersArray]);

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
      {isHidden() ? null : (
        <div className="details">
          <h2>Details</h2>
          <div className="cols">
            {rates().map((r) => {
              return (
                <div className="rate-group" key={r.rate}>
                  <p>Rate: <span>{r.rate}</span> – Users: <span>{r.users.length}</span></p>
                  <ul>
                      {r.users.map((u) => <li key={u}>{u}</li>)}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      )}
      <div className='user-cards'>
        {cards.map((card) => <div className='card-button' key={card}><Card isSelected={rate === card} rate={card} onSelect={onRate} /></div>)}
      </div>
    </div>
  );
}

export default Poker;
