import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface CelebrationProps {
  isVisible: boolean;
  message: string;
  onComplete?: () => void;
  className?: string;
}

interface Confetti {
  id: number;
  x: number;
  y: number;
  color: string;
  delay: number;
}

const confettiColors = [
  'hsl(var(--primary))',
  'hsl(var(--success))',
  'hsl(var(--motion))',
  'hsl(var(--bubble-1))',
  'hsl(var(--bubble-2))',
  'hsl(var(--bubble-3))',
  'hsl(var(--bubble-4))',
];

export const Celebration = ({ isVisible, message, onComplete, className }: CelebrationProps) => {
  const [confettiPieces, setConfettiPieces] = useState<Confetti[]>([]);

  useEffect(() => {
    if (isVisible) {
      // Generate confetti pieces
      const pieces: Confetti[] = [];
      for (let i = 0; i < 50; i++) {
        pieces.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
          delay: Math.random() * 1000,
        });
      }
      setConfettiPieces(pieces);

      // Auto-hide after 3 seconds
      const timer = setTimeout(() => {
        onComplete?.();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <div className={cn("celebration", className)}>
      {/* Confetti */}
      {confettiPieces.map((piece) => (
        <div
          key={piece.id}
          className="confetti"
          style={{
            left: `${piece.x}%`,
            top: `${piece.y}%`,
            backgroundColor: piece.color,
            animationDelay: `${piece.delay}ms`,
          }}
        />
      ))}

      {/* Success Message */}
      <div className="success-message">
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-4xl font-bold text-success mb-2">Fantastic!</h2>
          <p className="text-xl text-foreground">{message}</p>
        </div>
      </div>

      {/* Overlay with stars effect */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute text-4xl animate-ping"
            style={{
              left: `${Math.random() * 90 + 5}%`,
              top: `${Math.random() * 90 + 5}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: '2s',
            }}
          >
            ⭐
          </div>
        ))}
      </div>
    </div>
  );
};