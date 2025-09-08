// @ts-ignore;
import React, { useState, useEffect } from 'react';

export function BackgroundParticles() {
  const [particles, setParticles] = useState([]);
  useEffect(() => {
    // 创建背景粒子
    const createParticles = () => {
      const newParticles = [];
      const particleCount = Math.floor(window.innerWidth * window.innerHeight / 15000); // 根据屏幕大小调整粒子数量

      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 4 + 1,
          duration: Math.random() * 10 + 5,
          delay: Math.random() * 8,
          color: `hsl(${Math.random() * 60 + 200}, 70%, ${60 + Math.random() * 20}%)`,
          // 蓝色到紫色范围
          opacity: Math.random() * 0.4 + 0.2,
          direction: Math.random() * 360
        });
      }
      setParticles(newParticles);
    };
    createParticles();

    // 响应窗口大小变化
    const handleResize = () => {
      createParticles();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return <div className="particles-container">
      {particles.map(particle => <div key={particle.id} className="particle" style={{
      left: `${particle.x}%`,
      top: `${particle.y}%`,
      width: `${particle.size}px`,
      height: `${particle.size}px`,
      background: particle.color,
      opacity: particle.opacity,
      animation: `float ${particle.duration}s ease-in-out infinite alternate`,
      animationDelay: `${particle.delay}s`,
      filter: 'blur(1px)'
    }} />)}
    </div>;
}