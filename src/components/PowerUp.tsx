import React from 'react';
import { Zap, Shield } from 'lucide-react';

interface PowerUpProps {
  x: number;
  y: number;
  type: 'speed' | 'shield';
}

const PowerUp: React.FC<PowerUpProps> = ({ x, y, type }) => {
  const Icon = type === 'speed' ? Zap : Shield;
  const color = type === 'speed' ? 'text-yellow-400' : 'text-green-400';

  return (
    <div className="absolute" style={{ left: x, top: y }}>
      <Icon size={24} className={`${color} animate-pulse`} />
    </div>
  );
};

export default PowerUp;