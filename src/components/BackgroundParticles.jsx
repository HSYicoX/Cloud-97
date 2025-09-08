// @ts-ignore;
import React, { useState, useEffect } from 'react';

export function BackgroundParticles() {
  const [particles, setParticles] = useState([]);
  useEffect(() => {
    // 创建背景粒子
    const createParticles = () => {
      const newParticles = [];
      const count = Math.floor(window.innerWidth / 20); // 根据屏幕宽度调整粒子数量

      for (let i = 0; i < count; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 1,
          duration: Math.random() * 10 + 5,
          delay: Math.random() * 5,
          color: `hsl(${Math.random() * 360}, 70%, 60%)`
        });
      }
      setParticles(newParticles);
    };
    createParticles();
    const handleResize = () => {
      createParticles();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return <div className="bg-particles">
      {particles.map(particle => <div key={particle.id} className="particle-bg" style={{
      left: `${particle.x}%`,
      top: `${particle.y}%`,
      width: `${particle.size}px`,
      height: `${particle.size}px`,
      background: particle.color,
      animation: `float ${particle.duration}s ease-in-out infinite`,
      animationDelay: `${particle.delay}s`
    }} />)}
    </div>;
}