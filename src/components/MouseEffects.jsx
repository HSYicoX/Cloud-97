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
  useEffect(() => {
    const handleMouseMove = e => {
      setPosition({
        x: e.clientX,
        y: e.clientY
      });

      // 添加轨迹点
      setTrail(prev => {
        const newTrail = [...prev, {
          x: e.clientX,
          y: e.clientY,
          id: Date.now()
        }];
        return newTrail.slice(-10); // 保留最后10个点
      });
    };
    const handleMouseDown = () => {
      setClicked(true);

      // 创建点击粒子效果
      const newParticles = [];
      for (let i = 0; i < 12; i++) {
        newParticles.push({
          id: Date.now() + i,
          x: position.x,
          y: position.y,
          angle: i * 30 * Math.PI / 180,
          distance: 20 + Math.random() * 30,
          size: 2 + Math.random() * 4,
          duration: 800 + Math.random() * 400,
          color: `hsl(${Math.random() * 60 + 200}, 70%, 60%)`
        });
      }
      setParticles(newParticles);
      setTimeout(() => setClicked(false), 150);
      setTimeout(() => setParticles([]), 1200);
    };
    const handleMouseUp = () => {
      setClicked(false);
    };
    const handleMouseEnter = () => {
      setHovered(true);
    };
    const handleMouseLeave = () => {
      setHovered(false);
      setTrail([]);
    };
    const handleMouseOver = e => {
      const target = e.target;
      if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('button') || target.closest('a') || target.closest('[data-hover-effect]')) {
        setHovered(true);
      }
    };
    const handleMouseOut = () => {
      setHovered(false);
    };
    let hideTimeout;
    const handleMouseStop = () => {
      setHidden(true);
    };
    const handleMouseActive = () => {
      setHidden(false);
      clearTimeout(hideTimeout);
      hideTimeout = setTimeout(handleMouseStop, 3000);
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
    };
  }, [position]);

  // 清除过期的轨迹点
  useEffect(() => {
    const interval = setInterval(() => {
      setTrail(prev => prev.filter(point => Date.now() - point.id < 200));
    }, 100);
    return () => clearInterval(interval);
  }, []);
  if (hidden) return null;
  return <>
      {/* 鼠标轨迹 */}
      {trail.map((point, index) => <div key={point.id} className="cursor-trail" style={{
      left: `${point.x - 2}px`,
      top: `${point.y - 2}px`,
      opacity: index / trail.length,
      transform: `scale(${0.2 + index / trail.length * 0.8})`
    }} />)}
      
      {/* 主光标点 */}
      <div className="cursor-dot" style={{
      left: `${position.x - 4}px`,
      top: `${position.y - 4}px`,
      transform: `${clicked ? 'scale(0.6)' : hovered ? 'scale(1.8)' : 'scale(1)'}`,
      backgroundColor: clicked ? '#ec4899' : hovered ? '#60a5fa' : '#3b82f6',
      opacity: hovered ? 0.9 : 1
    }} />
      
      {/* 外圈光标 */}
      <div className="cursor-outline" style={{
      left: `${position.x - 20}px`,
      top: `${position.y - 20}px`,
      transform: `${clicked ? 'scale(1.3)' : hovered ? 'scale(1.6)' : 'scale(1)'}`,
      borderColor: clicked ? '#f472b6' : hovered ? '#93c5fd' : '#60a5fa',
      opacity: hovered ? 0.7 : 0.4
    }} />
      
      {/* 粒子效果 */}
      {particles.map(particle => <div key={particle.id} className="particle" style={{
      left: `${particle.x}px`,
      top: `${particle.y}px`,
      width: `${particle.size}px`,
      height: `${particle.size}px`,
      background: particle.color,
      animation: `particleFloat ${particle.duration}ms ease-out forwards`,
      transform: `translate(${Math.cos(particle.angle) * particle.distance}px, 
                               ${Math.sin(particle.angle) * particle.distance}px)`
    }} />)}
    </>;
}