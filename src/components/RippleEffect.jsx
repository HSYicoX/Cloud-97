// @ts-ignore;
import React, { useRef, useEffect } from 'react';

export function RippleEffect({
  children,
  className = '',
  color = 'rgba(255, 255, 255, 0.4)',
  duration = 600,
  ...props
}) {
  const ref = useRef(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const createRipple = e => {
      const rect = element.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      const ripple = document.createElement('span');
      ripple.className = 'ripple-effect';
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.style.background = color;
      element.appendChild(ripple);
      setTimeout(() => {
        if (ripple.parentNode === element) {
          element.removeChild(ripple);
        }
      }, duration);
    };
    element.addEventListener('click', createRipple);
    return () => {
      element.removeEventListener('click', createRipple);
    };
  }, [color, duration]);
  return <div ref={ref} className={`ripple ${className}`} {...props}>
      {children}
    </div>;
}