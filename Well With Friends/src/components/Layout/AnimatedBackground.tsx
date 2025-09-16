import React from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  direction: number;
  speed: number;
}

const AnimatedBackground: React.FC = () => {
  const particles: Particle[] = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 1,
    opacity: Math.random() * 0.5 + 0.1,
    direction: Math.random() * 360,
    speed: Math.random() * 2 + 0.5
  }));

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900" />
      
      {/* Animated Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-red-600/20 animate-pulse" />
      
      {/* Floating Particles */}
      <div className="absolute inset-0">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 bg-white rounded-full animate-float"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              opacity: particle.opacity,
              animationDelay: `${particle.id * 0.1}s`,
              animationDuration: `${3 + particle.speed}s`
            }}
          />
        ))}
      </div>
      
      {/* Geometric Shapes */}
      <div className="absolute top-10 left-10 w-32 h-32 border border-white/10 rounded-full animate-spin-slow" />
      <div className="absolute top-1/4 right-20 w-16 h-16 border border-blue-400/20 rotate-45 animate-pulse" />
      <div className="absolute bottom-20 left-1/4 w-24 h-24 border border-purple-400/15 rounded-lg animate-bounce-slow" />
      <div className="absolute bottom-1/3 right-1/3 w-20 h-20 border border-red-400/20 rotate-12 animate-spin-reverse" />
    </div>
  );
};

export default AnimatedBackground;