import { useState, useEffect } from 'react';

interface GlitchNotificationProps {
  message: string;
  type: 'success' | 'error' | 'info';
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

const GlitchNotification = ({ 
  message, 
  type, 
  isVisible, 
  onClose, 
  duration = 4000 
}: GlitchNotificationProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [glitchText, setGlitchText] = useState(message);

  const glitchChars = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '+', '=', '[', ']', '{', '}', '|', '\\', ':', ';', '"', "'", '<', '>', ',', '.', '?', '/'];

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          border: 'border-[#61dca3]',
          text: 'text-[#61dca3]',
          bg: 'bg-[#61dca3]/10',
          shadow: 'shadow-[#61dca3]/50',
          glow: 'shadow-lg shadow-[#61dca3]/30'
        };
      case 'error':
        return {
          border: 'border-red-500',
          text: 'text-red-500',
          bg: 'bg-red-500/10',
          shadow: 'shadow-red-500/50',
          glow: 'shadow-lg shadow-red-500/30'
        };
      case 'info':
        return {
          border: 'border-[#61b3dc]',
          text: 'text-[#61b3dc]',
          bg: 'bg-[#61b3dc]/10',
          shadow: 'shadow-[#61b3dc]/50',
          glow: 'shadow-lg shadow-[#61b3dc]/30'
        };
    }
  };

  const styles = getTypeStyles();

  const glitchEffect = () => {
    if (!isAnimating) return;
    
    const chars = message.split('');
    const glitchedChars = chars.map((char) => {
      if (Math.random() < 0.1) {
        return glitchChars[Math.floor(Math.random() * glitchChars.length)];
      }
      return char;
    });
    
    setGlitchText(glitchedChars.join(''));
    
    setTimeout(() => {
      setGlitchText(message);
    }, 50);
  };

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      const glitchInterval = setInterval(glitchEffect, 200);
      
      const timer = setTimeout(() => {
        setIsAnimating(false);
        clearInterval(glitchInterval);
        onClose();
      }, duration);

      return () => {
        clearTimeout(timer);
        clearInterval(glitchInterval);
      };
    }
  }, [isVisible, duration, message, onClose]);

  useEffect(() => {
    const interval = setInterval(glitchEffect, 200);
    return () => clearInterval(interval);
  }, [isAnimating, message]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] animate-in slide-in-from-right duration-300">
      <div className={`
        relative 
        ${styles.bg} 
        ${styles.border} 
        border-2 
        rounded-lg 
        p-6 
        max-w-md 
        ${styles.glow}
        backdrop-blur-sm
        transform transition-all duration-300 hover:scale-105
      `}>
        {/* Glitch background effect */}
        <div className="absolute inset-0 opacity-20">
          <div className={`w-full h-full ${styles.bg} rounded-lg animate-pulse`}></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className={`${styles.text} font-mono text-sm mb-2 uppercase tracking-wider`}>
                {type === 'success' && '[ SUCCESS ]'}
                {type === 'error' && '[ ERROR ]'}
                {type === 'info' && '[ INFO ]'}
              </div>
              <div className={`${styles.text} font-mono text-base leading-relaxed`}>
                {glitchText}
              </div>
            </div>
            
            <button
              onClick={onClose}
              className={`
                ml-4 
                ${styles.text} 
                hover:text-white 
                font-mono 
                text-xl 
                transition-colors 
                duration-200
                hover:scale-110
                transform
              `}
            >
              ×
            </button>
          </div>
        </div>

        {/* Animated border effect */}
        <div className={`
          absolute -inset-1 
          bg-gradient-to-r 
          from-${type === 'success' ? '[#61dca3]' : type === 'error' ? 'red-500' : '[#61b3dc]'}/20 
          via-transparent 
          to-${type === 'success' ? '[#61dca3]' : type === 'error' ? 'red-500' : '[#61b3dc]'}/20 
          rounded-lg 
          blur 
          opacity-30 
          animate-pulse 
          pointer-events-none 
          -z-10
        `}></div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20 rounded-b-lg overflow-hidden">
          <div 
            className={`h-full ${styles.bg.replace('/10', '')}`}
            style={{
              animation: `progressBar ${duration}ms linear forwards`,
              width: '100%'
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default GlitchNotification;
