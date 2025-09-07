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
  useEffect(() => {
    const handleMouseMove = e => {
      setPosition({
        x: e.clientX,
        y: e.clientY
      });
    };
    const handleMouseDown = () => {
      setClicked(true);
      setTimeout(() => setClicked(false), 150);
    };
    const handleMouseUp = () => {
      setClicked(false);
    };
    const handleMouseEnter = () => {
      setHovered(true);
    };
    const handleMouseLeave = () => {
      setHovered(false);
    };
    const handleMouseOver = e => {
      if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A' || e.target.closest('button') || e.target.closest('a')) {
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
  }, []);
  if (hidden) return null;
  return <>
      {/* 主光标点 */}
      <div className="cursor-dot" style={{
      left: `${position.x - 4}px`,
      top: `${position.y - 4}px`,
      transform: `${clicked ? 'scale(0.8)' : hovered ? 'scale(1.5)' : 'scale(1)'}`,
      backgroundColor: clicked ? '#ec4899' : hovered ? '#60a5fa' : '#3b82f6',
      opacity: hovered ? 0.8 : 1,
      transition: 'transform 0.15s ease, background-color 0.15s ease, opacity 0.15s ease'
    }} />
      
      {/* 外圈光标 */}
      <div className="cursor-outline" style={{
      left: `${position.x - 20}px`,
      top: `${position.y - 20}px`,
      transform: `${clicked ? 'scale(1.2)' : hovered ? 'scale(1.5)' : 'scale(1)'}`,
      borderColor: clicked ? '#f472b6' : hovered ? '#93c5fd' : '#60a5fa',
      opacity: hovered ? 0.6 : 0.4,
      transition: 'transform 0.2s ease, border-color 0.2s ease, opacity 0.2s ease'
    }} />
      
      {/* 粒子效果 */}
      {clicked && <div className="absolute pointer-events-none" style={{
      left: `${position.x}px`,
      top: `${position.y}px`
    }}>
          {[...Array(8)].map((_, i) => <div key={i} className="absolute w-2 h-2 bg-pink-400 rounded-full opacity-70" style={{
        transform: `translate(${Math.cos(i * 45 * Math.PI / 180) * 20}px, ${Math.sin(i * 45 * Math.PI / 180) * 20}px)`,
        animation: `fadeOut 0.6s ease-out forwards`,
        animationDelay: `${i * 0.05}s`
      }} />)}
        </div>}
      
      <style jsx>{`
        @keyframes fadeOut {
          from {
            opacity: 0.7;
            transform: translate(0, 0) scale(1);
          }
          to {
            opacity: 0;
            transform: translate(var(--tx), var(--ty)) scale(0.3);
          }
        }
      `}</style>
    </>;
}