import React, { useCallback } from 'react';
import './Card.css';

interface CardProps {
  rate: string | null;
  isSelected?: boolean;
  isHidden?: boolean;
  onSelect?: (rate: string) => void;
}

export const Card: React.FC<CardProps> = ({ rate, isSelected, isHidden, onSelect }) => {
  const onClick = useCallback(() => {
    onSelect && rate && onSelect(rate);
  }, [rate, onSelect]);

  const classes = useCallback(() => {
    const preparedRate = rate ? parseInt(rate) : -1;
    let className = 'card';
    className += isSelected ? ' selected' : '';
    className += onSelect ? ' pointer' : '';

    if (preparedRate === -1) {
      className += ' unrated';
    } else if (isHidden) {
      className += ' hidden';
    } else if (isNaN(preparedRate) || preparedRate < 2) {
      className += ' hearts';
    } else if (preparedRate < 5) {
      className += ' clovers';
    } else if (preparedRate < 10) {
      className += ' tiles';
    } else {
      className += ' pikes';
    }

    return className;
  }, [isSelected, rate, isHidden, onSelect]);

  return (
    <div className={classes()} onClick={onClick}>
      {isHidden ? null : rate}
    </div>
  );
}

export default Card;
