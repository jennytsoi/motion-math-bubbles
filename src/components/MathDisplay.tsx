import { useState, useEffect } from 'react';
import { Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MathProblem {
  question: string;
  answer: number;
}

interface MathDisplayProps {
  onProblemChange: (answer: number) => void;
  className?: string;
}

export const MathDisplay = ({ onProblemChange, className }: MathDisplayProps) => {
  const [currentProblem, setCurrentProblem] = useState<MathProblem>({ question: '', answer: 0 });
  const [timeLeft, setTimeLeft] = useState(30);
  const [isActive, setIsActive] = useState(true);

  const generateProblem = () => {
    const operations = ['+', '-', '×', '÷'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    
    let num1, num2, answer, question;
    
    switch (operation) {
      case '+':
        num1 = Math.floor(Math.random() * 50) + 1;
        num2 = Math.floor(Math.random() * 50) + 1;
        answer = num1 + num2;
        question = `${num1} + ${num2}`;
        break;
      case '-':
        num1 = Math.floor(Math.random() * 50) + 26;
        num2 = Math.floor(Math.random() * 25) + 1;
        answer = num1 - num2;
        question = `${num1} - ${num2}`;
        break;
      case '×':
        num1 = Math.floor(Math.random() * 12) + 1;
        num2 = Math.floor(Math.random() * 12) + 1;
        answer = num1 * num2;
        question = `${num1} × ${num2}`;
        break;
      case '÷':
        answer = Math.floor(Math.random() * 12) + 1;
        num2 = Math.floor(Math.random() * 12) + 1;
        num1 = answer * num2;
        question = `${num1} ÷ ${num2}`;
        break;
      default:
        num1 = 5;
        num2 = 3;
        answer = 8;
        question = '5 + 3';
    }
    
    const problem = { question: `${question} = ?`, answer };
    setCurrentProblem(problem);
    onProblemChange(answer);
    setTimeLeft(30);
  };

  useEffect(() => {
    generateProblem();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      generateProblem(); // Auto-generate new problem when time runs out
    }
    
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const speakProblem = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(
        currentProblem.question.replace('×', 'times').replace('÷', 'divided by')
      );
      utterance.rate = 0.8;
      utterance.pitch = 1.2;
      window.speechSynthesis.speak(utterance);
    }
  };

  const newProblem = () => {
    generateProblem();
  };

  const progressPercent = (timeLeft / 30) * 100;

  return (
    <div className={cn("math-display p-8 relative", className)}>
      {/* Timer Ring */}
      <div className="absolute -top-2 -right-2 w-16 h-16">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
          <path
            className="text-muted"
            stroke="currentColor"
            strokeWidth="3"
            fill="transparent"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            className="text-primary"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray={`${progressPercent}, 100`}
            strokeLinecap="round"
            fill="transparent"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-primary">{timeLeft}</span>
        </div>
      </div>

      <div className="text-center space-y-6">
        <h1 className="math-text text-foreground mb-6">
          {currentProblem.question}
        </h1>
        
        <div className="flex gap-4 justify-center">
          <Button
            onClick={speakProblem}
            variant="outline"
            size="lg"
            className="focus-ring bg-card hover:bg-primary hover:text-primary-foreground"
          >
            <Volume2 className="mr-2 h-6 w-6" />
            Read Aloud
          </Button>
          
          <Button
            onClick={newProblem}
            size="lg"
            className="focus-ring bg-primary hover:bg-primary-glow text-primary-foreground"
          >
            New Problem
          </Button>
        </div>
      </div>
    </div>
  );
};