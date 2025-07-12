import { useState } from 'react';
import { Sparkles, Mic, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import avatarRobot from '@/assets/avatar-robot.png';
import avatarOwl from '@/assets/avatar-owl.png';
import avatarHero from '@/assets/avatar-hero.png';

interface AIAssistantProps {
  className?: string;
  onFeedback?: (message: string) => void;
}

const avatars = [
  { id: 'robot', name: 'RoboTeach', image: avatarRobot, personality: 'energetic' },
  { id: 'owl', name: 'Professor Hoot', image: avatarOwl, personality: 'wise' },
  { id: 'hero', name: 'MathHero', image: avatarHero, personality: 'encouraging' },
];

const encouragingMessages = [
  "Amazing work! Your brain is growing stronger! 🧠✨",
  "Fantastic! You're becoming a math superhero! 🦸‍♂️",
  "Brilliant move! Keep up that excellent thinking! 🌟",
  "Outstanding! Your focus is incredible today! 🎯",
  "Wonderful! You're solving problems like a pro! 🏆",
  "Excellent! Your math skills are leveling up! ⬆️",
];

const wrongAnswerMessages = [
  "Close one! Try moving your arms to help you think! 🤔",
  "Almost there! Sometimes jumping helps me solve problems! 🦘",
  "Good try! Take a deep breath and wiggle your fingers! 👐",
  "Nice attempt! Maybe stretch up high and try again! 🙋‍♂️",
  "So close! Try marching in place to get your brain moving! 🚶‍♂️",
  "Great effort! Shake it out and give it another go! 💪",
];

export const AIAssistant = ({ className, onFeedback }: AIAssistantProps) => {
  const [selectedAvatar, setSelectedAvatar] = useState(avatars[0]);
  const [currentMessage, setCurrentMessage] = useState("Hi there! I'm here to help you learn math through movement! Let's get started! 🎉");
  const [isListening, setIsListening] = useState(false);

  const handleCorrectAnswer = (answer: number) => {
    const message = encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)];
    setCurrentMessage(message);
    onFeedback?.(message);
  };

  const handleWrongAnswer = () => {
    const message = wrongAnswerMessages[Math.floor(Math.random() * wrongAnswerMessages.length)];
    setCurrentMessage(message);
    onFeedback?.(message);
  };

  const startListening = () => {
    setIsListening(true);
    // Simulate voice interaction
    setTimeout(() => {
      setIsListening(false);
      setCurrentMessage("I heard you! That's a great question. Remember, if you're stuck, try moving your body to help your brain think! 🧠");
    }, 2000);
  };

  // Expose methods for parent component to trigger feedback
  (window as any).triggerCorrectFeedback = handleCorrectAnswer;
  (window as any).triggerWrongFeedback = handleWrongAnswer;

  return (
    <div className={cn("assistant-panel w-80 p-6 space-y-6", className)}>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-primary mb-2">Your AI Coach</h2>
        <p className="text-text-muted text-sm">Learning through movement & encouragement!</p>
      </div>

      {/* Avatar Selection */}
      <Card className="p-4 bg-surface border-card-border">
        <h3 className="font-bold text-foreground mb-3">Choose Your Buddy:</h3>
        <div className="grid grid-cols-3 gap-2">
          {avatars.map((avatar) => (
            <button
              key={avatar.id}
              onClick={() => setSelectedAvatar(avatar)}
              className={cn(
                "p-2 rounded-lg border-2 transition-all duration-200 focus-ring",
                selectedAvatar.id === avatar.id
                  ? "border-primary bg-primary/10"
                  : "border-card-border hover:border-primary/50"
              )}
            >
              <img
                src={avatar.image}
                alt={avatar.name}
                className="w-full h-16 object-cover rounded-lg mb-1"
              />
              <p className="text-xs font-medium text-foreground">{avatar.name}</p>
            </button>
          ))}
        </div>
      </Card>

      {/* Current Avatar & Message */}
      <Card className="p-4 bg-surface border-card-border">
        <div className="flex items-start gap-3">
          <img
            src={selectedAvatar.image}
            alt={selectedAvatar.name}
            className="w-12 h-12 rounded-full border-2 border-primary"
          />
          <div className="flex-1">
            <h4 className="font-bold text-primary text-sm">{selectedAvatar.name}</h4>
            <p className="text-sm text-foreground mt-1 leading-relaxed">
              {currentMessage}
            </p>
          </div>
        </div>
      </Card>

      {/* Interaction Buttons */}
      <div className="space-y-3">
        <Button
          onClick={startListening}
          disabled={isListening}
          className={cn(
            "w-full focus-ring",
            isListening
              ? "bg-motion text-motion-foreground animate-pulse"
              : "bg-primary hover:bg-primary-glow text-primary-foreground"
          )}
        >
          <Mic className="mr-2 h-4 w-4" />
          {isListening ? "Listening..." : "Ask Question"}
        </Button>

        <Button
          variant="outline"
          className="w-full focus-ring bg-card hover:bg-surface"
          onClick={() => setCurrentMessage("Remember: Move your whole body! Wave your arms, jump, dance - whatever helps you think better! 💃🕺")}
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Movement Tip
        </Button>

        <Button
          variant="outline"
          className="w-full focus-ring bg-card hover:bg-surface"
        >
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </div>

      {/* Quick Stats */}
      <Card className="p-4 bg-surface border-card-border">
        <h4 className="font-bold text-primary mb-2">Today's Progress</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-text-muted">Problems Solved:</span>
            <span className="font-bold text-success">12</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">Movement Points:</span>
            <span className="font-bold text-motion">87</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">Focus Time:</span>
            <span className="font-bold text-primary">15 min</span>
          </div>
        </div>
      </Card>
    </div>
  );
};