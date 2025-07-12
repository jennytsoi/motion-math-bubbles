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
  const { toast } = useToast();

  const handleProblemChange = useCallback((answer: number) => {
    setCurrentAnswer(answer);
  }, []);

  const handleBubbleClick = useCallback((value: number, isCorrect: boolean) => {
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

  const handleMotionDetected = useCallback((intensity: number) => {
    // Motion detection could influence the game in future versions
    console.log('Motion detected:', intensity);
  }, []);

  const handleCelebrationComplete = useCallback(() => {
    setCelebration({ isVisible: false, message: '' });
  }, []);

  return (
    <div className="game-container">
      {/* Header */}
      <header className="flex justify-between items-center p-6 bg-surface border-b-2 border-primary/20">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            MathMotion
          </h1>
          <p className="text-text-muted">Learning through movement!</p>
        </div>
        
        <div className="flex items-center gap-6 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{score}</div>
            <div className="text-text-muted">Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-success">{streak}</div>
            <div className="text-text-muted">Streak</div>
          </div>
        </div>
      </header>

      {/* Main Game Area */}
      <div className="flex h-[calc(100vh-100px)]">
        {/* AI Assistant Sidebar */}
        <AIAssistant className="shrink-0" />

        {/* Game Play Area */}
        <div className="flex-1 flex flex-col relative">
          {/* Math Problem Display */}
          <div className="flex-1 flex items-center justify-center p-8">
            <MathDisplay 
              onProblemChange={handleProblemChange}
              className="max-w-2xl w-full"
            />
          </div>

          {/* Floating Answer Bubbles */}
          <FloatingBubbles
            correctAnswer={currentAnswer}
            onBubbleClick={handleBubbleClick}
            className="absolute inset-0"
          />

          {/* Celebration Overlay */}
          <Celebration
            isVisible={celebration.isVisible}
            message={celebration.message}
            onComplete={handleCelebrationComplete}
            className="absolute inset-0"
          />
        </div>

        {/* Camera & Motion Detection */}
        <div className="w-80 shrink-0 bg-surface border-l-2 border-motion/20">
          <CameraMotion 
            onMotionDetected={handleMotionDetected}
            className="h-full"
          />
        </div>
      </div>

      {/* Instructions Footer */}
      <footer className="bg-surface border-t-2 border-primary/20 p-4 text-center">
        <p className="text-text-muted text-sm">
          <span className="font-semibold text-primary">Move your body</span> to help your brain think! 
          <span className="font-semibold text-motion ml-4">Wave at bubbles</span> to select answers.
          <span className="font-semibold text-success ml-4">Keep moving</span> for better focus!
        </p>
      </footer>
    </div>
  );
};

export default Index;
