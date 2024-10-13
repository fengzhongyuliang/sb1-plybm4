import React from 'react';

interface SpaceshipProps {
  x: number;
  y: number;
  size: number;
}

const Spaceship: React.FC<SpaceshipProps> = ({ x, y, size }) => {
  return (
    <div 
      className="absolute rounded-full"
      style={{ 
        left: x, 
        top: y, 
        width: size, 
        height: size, 
        backgroundColor: '#3498db',
        border: '2px solid #2980b9',
        transform: 'translate(-50%, -50%)'
      }}
    />
  );
};

export default Spaceship;