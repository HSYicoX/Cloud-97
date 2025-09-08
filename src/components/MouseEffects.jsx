// @ts-ignore;
import React, { useState, useEffect } from 'react';

export function MouseEffects() {
  const [position, setPosition] = useState({
    x: 0,
    y: 0
  });
  const [clicked, setClicked] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [particles, setParticles] = useState([]);
  const [trail, setTrail] = useState([]);
  const [isInteracting, setIsInteracting] = useState(false);
  useEffect(() => {
    const handleMouseMove = e => {
      setPosition({
        x: e.clientX,
        y: e.clientY
      });

      // 添加鼠标轨迹点
      setTrail(prev => [...prev.slice(-15), {
        x: e.clientX,
        y: e.clientY,
        id: Date.now()
      }]);
    };
    const handleMouseDown = () => {
      setClicked(true);

      // 创建点击粒子效果
      const newParticles = [];
      for (let i = 0; i < 16; i++) {
        const angle = i / 16 * Math.PI * 2;
        const distance = 15 + Math.random() * 25;
        newParticles.push({
          id: Date.now() + i,
          x: position.x,
          y: position.y,
          angle: angle,
          distance: distance,
          size: 2 + Math.random() * 5,
          duration: 600 + Math.random() * 400,
          color: `hsl(${Math.random() * 360}, 80%, 60%)`
        });
      }
      setParticles(newParticles);
      setTimeout(() => setClicked(false), 200);
      setTimeout(() => setParticles([]), 1000);
    };
    const handleMouseUp = () => {
      setClicked(false);
    };
    const handleMouseEnter = () => {
      setHovered(true);
      setIsInteracting(true);
    };
    const handleMouseLeave = () => {
      setHovered(false);
      setIsInteracting(false);
    };
    const handleMouseOver = e => {
      const target = e.target;
      if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('button') || target.closest('a') || target.closest('[data-hover-effect]')) {
        setHovered(true);
        setIsInteracting(true);
      }
    };
    const handleMouseOut = () => {
      setHovered(false);
      setIsInteracting(false);
    };
    let hideTimeout;
    const handleMouseStop = () => {
      setHidden(true);
      setTrail([]);
    };
    const handleMouseActive = () => {
      setHidden(false);
      clearTimeout(hideTimeout);
      hideTimeout = setTimeout(handleMouseStop, 2000);
    };

    // 添加事件监听器
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    document.addEventListener('mousemove', handleMouseActive);

    // 自动清理旧的轨迹点
    const trailCleanup = setInterval(() => {
      setTrail(prev => prev.filter(point => Date.now() - point.id < 200));
    }, 100);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('mousemove', handleMouseActive);
      clearTimeout(hideTimeout);
      clearInterval(trailCleanup);
    };
  }, [position]);
  if (hidden) return null;
  return <>
      {/* 鼠标轨迹效果 */}
      {trail.map((point, index) => <div key={point.id} className="cursor-trail" style={{
      left: `${point.x - 2}px`,
      top: `${point.y - 2}px`,
      opacity: 0.3 - index * 0.02,
      scale: 1 - index * 0.05
    }} />)}

      {/* 主光标点 */}
      <div className="cursor-dot" style={{
      left: `${position.x - 4}px`,
      top: `${position.y - 4}px`,
      transform: `${clicked ? 'scale(0.5)' : hovered ? 'scale(2)' : 'scale(1)'}`,
      backgroundColor: clicked ? '#ec4899' : hovered ? '#60a5fa' : '#3b82f6',
      opacity: isInteracting ? 0.9 : 1,
      filter: clicked ? 'blur(2px)' : 'none'
    }} />
      
      {/* 外圈光标 */}
      <div className="cursor-outline" style={{
      left: `${position.x - 20}px`,
      top: `${position.y - 20}px`,
      transform: `${clicked ? 'scale(1.4)' : hovered ? 'scale(1.8)' : 'scale(1)'}`,
      borderColor: clicked ? '#f472b6' : hovered ? '#93c5fd' : '#60a5fa',
      opacity: hovered ? 0.8 : 0.4,
      backdropFilter: hovered ? 'blur(8px)' : 'blur(4px)'
    }} />
      
      {/* 粒子效果 */}
      {particles.map(particle => <div key={particle.id} className="particle" style={{
      left: `${particle.x}px`,
      top: `${particle.y}px`,
      width: `${particle.size}px`,
      height: `${particle.size}px`,
      background: particle.color,
      animation: `particleFloat ${particle.duration}ms ease-out forwards`,
      transform: `translate(
              ${Math.cos(particle.angle) * particle.distance}px, 
              ${Math.sin(particle.angle) * particle.distance}px
            )`
    }} />)}

      <style jsx>{`
        .cursor-trail {
          position: fixed;
          width: 4px;
          height: 4px;
          background: #3b82f6;
          border-radius: 50%;
          pointer-events: none;
          z-index: 9996;
          transition: all 0.1s ease-out;
        }

        @keyframes particleFloat {
          0% {
            opacity: 0.8;
            transform: translate(0, 0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(
              calc(var(--tx) * 1px), 
              calc(var(--ty) * 1px)
            ) scale(0.1);
          }
        }
      `}</style>
    </>;
}