import React from 'react';

interface StarProps {
  x: number;
  y: number;
  size: number;
}

const Star: React.FC<StarProps> = ({ x, y, size }) => {
  const color = size > 20 ? '#e74c3c' : '#f1c40f';
  return (
    <div 
      className="absolute rounded-full"
      style={{ 
        left: x, 
        top: y, 
        width: size, 
        height: size, 
        backgroundColor: color,
        transform: 'translate(-50%, -50%)'
      }}
    />
  );
};

export default Star;