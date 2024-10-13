import React, { useState, useEffect, useRef, useCallback } from 'react';
import Spaceship from './components/Spaceship';
import Star from './components/Star';
import GameOver from './components/GameOver';

const App: React.FC = () => {
  const [position, setPosition] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [stars, setStars] = useState<{ id: number; x: number; y: number; size: number }[]>([]);
  const [score, setScore] = useState(0);
  const [size, setSize] = useState(20);
  const [gameOver, setGameOver] = useState(false);

  const targetPositionRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();

  const moveSpaceship = useCallback((deltaTime: number) => {
    const { x: targetX, y: targetY } = targetPositionRef.current;
    setPosition(prev => {
      const dx = targetX - prev.x;
      const dy = targetY - prev.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > 1) {
        const speed = Math.min(distance * 0.01 * deltaTime, 1);
        const vx = (dx / distance) * speed;
        const vy = (dy / distance) * speed;
        
        return {
          x: prev.x + vx,
          y: prev.y + vy
        };
      }
      return prev;
    });
  }, []);

  const updateStars = useCallback((deltaTime: number) => {
    setStars(prev => {
      const newStars = prev.map(star => ({
        ...star,
        x: star.x + (Math.random() - 0.5) * 0.5 * deltaTime,
        y: star.y + (Math.random() - 0.5) * 0.5 * deltaTime,
      })).filter(star => 
        star.x >= 0 && star.x <= window.innerWidth && 
        star.y >= 0 && star.y <= window.innerHeight
      );

      while (newStars.length < 20) {
        newStars.push({
          id: Math.random(),
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: Math.random() * 30 + 5,
        });
      }

      return newStars;
    });
  }, []);

  const checkCollisions = useCallback(() => {
    setStars(prev => {
      const collisions = prev.filter(star => 
        Math.hypot(star.x - position.x, star.y - position.y) < (size / 2 + star.size / 2)
      );

      collisions.forEach(star => {
        if (size > star.size) {
          setSize(prevSize => Math.min(prevSize + star.size / 5, 100));
          setScore(prevScore => prevScore + Math.floor(star.size));
        } else {
          setGameOver(true);
        }
      });

      return prev.filter(star => !collisions.includes(star));
    });
  }, [position.x, position.y, size]);

  const gameLoop = useCallback((time: number) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current;
      moveSpaceship(deltaTime);
      updateStars(deltaTime);
      checkCollisions();
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(gameLoop);
  }, [moveSpaceship, updateStars, checkCollisions]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(requestRef.current!);
  }, [gameLoop]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    targetPositionRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  const restartGame = () => {
    setPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    targetPositionRef.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    setStars([]);
    setScore(0);
    setSize(20);
    setGameOver(false);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      {stars.map(star => (
        <Star key={star.id} x={star.x} y={star.y} size={star.size} />
      ))}
      <Spaceship x={position.x} y={position.y} size={size} />
      <div className="absolute top-4 left-4 text-white text-2xl">
        得分: {score}
      </div>
      {gameOver && <GameOver score={score} onRestart={restartGame} />}
    </div>
  );
};

export default App;