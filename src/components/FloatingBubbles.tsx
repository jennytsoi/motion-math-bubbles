import { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface Bubble {
  id: string;
  value: number;
  x: number;
  y: number;
  variant: number;
  isCorrect: boolean;
}

interface FloatingBubblesProps {
  correctAnswer: number;
  onBubbleCollision: (value: number, isCorrect: boolean) => void;
  handPosition?: { x: number; y: number } | null;
  className?: string;
}

export const FloatingBubbles = ({ correctAnswer, onBubbleCollision, handPosition, className }: FloatingBubblesProps) => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  const generateBubbles = useCallback(() => {
    const wrongAnswers = [];
    
    // Generate 3 wrong answers that are close but not correct
    for (let i = 0; i < 3; i++) {
      let wrong;
      do {
        wrong = correctAnswer + Math.floor(Math.random() * 20) - 10;
      } while (wrong === correctAnswer || wrongAnswers.includes(wrong) || wrong < 0);
      wrongAnswers.push(wrong);
    }

    const allAnswers = [...wrongAnswers, correctAnswer];
    
    // Shuffle the answers
    for (let i = allAnswers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allAnswers[i], allAnswers[j]] = [allAnswers[j], allAnswers[i]];
    }

    const newBubbles: Bubble[] = allAnswers.map((value, index) => ({
      id: `bubble-${index}-${Date.now()}`,
      value,
      x: Math.random() * 60 + 10, // 10% to 70% from left
      y: Math.random() * 60 + 20, // 20% to 80% from top
      variant: (index % 4) + 1,
      isCorrect: value === correctAnswer,
    }));

    setBubbles(newBubbles);
  }, [correctAnswer]);

  useEffect(() => {
    generateBubbles();
  }, [generateBubbles]);

  const handleBubbleCollision = (bubble: Bubble) => {
    onBubbleCollision(bubble.value, bubble.isCorrect);
    
    // Remove the collided bubble and regenerate after a delay
    setBubbles(prev => prev.filter(b => b.id !== bubble.id));
    
    if (bubble.isCorrect) {
      // Regenerate bubbles after celebration
      setTimeout(generateBubbles, 2000);
    }
  };

  // Check for hand-bubble collisions
  useEffect(() => {
    if (!handPosition) return;

    const checkCollisions = () => {
      bubbles.forEach(bubble => {
        const bubbleX = bubble.x;
        const bubbleY = bubble.y;
        const handX = handPosition.x;
        const handY = handPosition.y;

        // Calculate distance between hand and bubble center
        const distance = Math.sqrt(
          Math.pow(handX - bubbleX, 2) + Math.pow(handY - bubbleY, 2)
        );

        // Collision threshold (adjust based on bubble size)
        const collisionThreshold = 12; // Approximately 12% of screen size

        if (distance < collisionThreshold) {
          handleBubbleCollision(bubble);
        }
      });
    };

    checkCollisions();
  }, [handPosition, bubbles]);

  return (
    <div className={cn("absolute inset-0 pointer-events-none", className)}>
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className={cn(
            "answer-bubble pointer-events-none cursor-none",
            `variant-${bubble.variant}`,
            bubble.isCorrect && "correct",
            "w-24 h-24 absolute"
          )}
          style={{
            left: `${bubble.x}%`,
            top: `${bubble.y}%`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        >
          <span className="bubble-text text-background">
            {bubble.value}
          </span>
        </div>
      ))}
    </div>
  );
};