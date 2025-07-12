import { useState, useCallback } from 'react';
import { MathDisplay } from '@/components/MathDisplay';
import { FloatingBubbles } from '@/components/FloatingBubbles';
import { AIAssistant } from '@/components/AIAssistant';
import { CameraMotion } from '@/components/CameraMotion';
import { Celebration } from '@/components/Celebration';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [currentAnswer, setCurrentAnswer] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [celebration, setCelebration] = useState({ isVisible: false, message: '' });
  const [handPosition, setHandPosition] = useState<{ x: number; y: number } | null>(null);
  const { toast } = useToast();

  const handleProblemChange = useCallback((answer: number) => {
    setCurrentAnswer(answer);
  }, []);

  const handleBubbleCollision = useCallback((value: number, isCorrect: boolean) => {
    if (isCorrect) {
      const newScore = score + 10 + (streak * 2);
      const newStreak = streak + 1;
      
      setScore(newScore);
      setStreak(newStreak);
      
      const messages = [
        `Brilliant! The answer is ${value}! 🌟`,
        `Perfect! You got ${value} right! 🎯`,
        `Amazing work! ${value} is correct! ✨`,
        `Fantastic! You solved it: ${value}! 🏆`,
        `Outstanding! The answer ${value} is perfect! 🚀`,
      ];
      
      const message = messages[Math.floor(Math.random() * messages.length)];
      
      setCelebration({ isVisible: true, message });
      
      // Trigger AI assistant feedback
      if ((window as any).triggerCorrectFeedback) {
        (window as any).triggerCorrectFeedback(value);
      }

      toast({
        title: "Correct Answer! 🎉",
        description: `+${10 + (streak * 2)} points! Streak: ${newStreak}`,
        variant: "default",
      });
    } else {
      setStreak(0);
      
      // Trigger AI assistant feedback
      if ((window as any).triggerWrongFeedback) {
        (window as any).triggerWrongFeedback();
      }

      toast({
        title: "Try Again! 🤔",
        description: "That's not quite right. Keep moving and thinking!",
        variant: "destructive",
      });
    }
  }, [score, streak, toast]);

  const handleHandDetected = useCallback((x: number, y: number) => {
    setHandPosition({ x, y });
  }, []);

  const handleCelebrationComplete = useCallback(() => {
    setCelebration({ isVisible: false, message: '' });
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Camera Background */}
      <CameraMotion 
        isFullscreen={true}
        onHandDetected={handleHandDetected}
        className="absolute inset-0"
      />

      {/* AI Assistant Sidebar */}
      <AIAssistant 
        className="fixed left-0 top-0 bottom-0 w-80 z-20 bg-background/95 backdrop-blur-md" 
      />

      {/* Main Game Area */}
      <div className="ml-80 relative min-h-screen z-10">
        {/* Header */}
        <header className="relative z-30 bg-background/80 backdrop-blur-md border-b border-card-border/50 p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">MathMotion</h1>
              <p className="text-text-muted">Move your hand to touch the right answer!</p>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{score}</div>
                <div className="text-sm text-text-muted">Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-motion">{streak}</div>
                <div className="text-sm text-text-muted">Streak</div>
              </div>
            </div>
          </div>
        </header>

        {/* Game Content */}
        <div className="relative z-10 p-8">
          {/* Math Problem Display */}
          <div className="flex justify-center mb-8">
            <MathDisplay 
              onProblemChange={handleProblemChange}
              className="max-w-2xl bg-background/90 backdrop-blur-md rounded-lg"
            />
          </div>

          {/* Floating Answer Bubbles */}
          <FloatingBubbles 
            correctAnswer={currentAnswer}
            onBubbleCollision={handleBubbleCollision}
            handPosition={handPosition}
            className="z-20"
          />
        </div>

        {/* Celebration Overlay */}
        <Celebration
          isVisible={celebration.isVisible}
          message={celebration.message}
          onComplete={handleCelebrationComplete}
          className="fixed inset-0 z-40"
        />

        {/* Instructions Footer */}
        <footer className="relative z-30 bg-background/80 backdrop-blur-md border-t border-card-border/50 p-4">
          <div className="text-center text-sm text-text-muted">
            <p className="mb-2">🎯 <strong>How to Play:</strong> Move your hand in front of the camera to touch the correct answer bubble!</p>
            <p>🏃‍♀️ The camera detects your hand movement - no clicking required!</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
