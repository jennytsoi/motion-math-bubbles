import { useState, useEffect, useRef } from 'react';
import { Camera, CameraOff, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface CameraMotionProps {
  onMotionDetected?: (intensity: number) => void;
  className?: string;
}

export const CameraMotion = ({ onMotionDetected, className }: CameraMotionProps) => {
  const [isActive, setIsActive] = useState(false);
  const [motionLevel, setMotionLevel] = useState(0);
  const [lastMovement, setLastMovement] = useState(Date.now());
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (isActive) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isActive]);

  // Simulate motion detection for demo purposes
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      // Simulate random motion detection
      const randomMotion = Math.random() * 100;
      setMotionLevel(randomMotion);
      
      if (randomMotion > 30) {
        setLastMovement(Date.now());
        onMotionDetected?.(randomMotion);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isActive, onMotionDetected]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 640, 
          height: 480,
          facingMode: 'user'
        } 
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (error) {
      console.error('Camera access error:', error);
      // For demo, continue without camera
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const toggleCamera = () => {
    setIsActive(!isActive);
  };

  const timeSinceMovement = Date.now() - lastMovement;
  const isRecentMovement = timeSinceMovement < 2000;

  return (
    <div className={cn("camera-panel p-4", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-foreground">Motion Detection</h3>
        <div className="flex items-center gap-2">
          <div className={cn(
            "motion-indicator",
            isRecentMovement && "active"
          )} />
          <Button
            onClick={toggleCamera}
            variant={isActive ? "destructive" : "default"}
            size="sm"
            className="focus-ring"
          >
            {isActive ? (
              <>
                <CameraOff className="mr-2 h-4 w-4" />
                Stop
              </>
            ) : (
              <>
                <Camera className="mr-2 h-4 w-4" />
                Start
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="relative bg-surface-bright rounded-lg overflow-hidden h-64 mb-4">
        {isActive ? (
          <>
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              autoPlay
              muted
              playsInline
            />
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full opacity-50"
            />
            
            {/* Motion Detection Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
            
            {/* Pose Detection Points Simulation */}
            {isRecentMovement && (
              <div className="absolute inset-0">
                {[...Array(17)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-3 h-3 bg-motion rounded-full animate-pulse"
                    style={{
                      left: `${20 + Math.random() * 60}%`,
                      top: `${20 + Math.random() * 60}%`,
                      animationDelay: `${i * 0.1}s`
                    }}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-text-muted">
            <div className="text-center">
              <Camera className="mx-auto h-12 w-12 mb-2 opacity-50" />
              <p className="text-sm">Camera is off</p>
              <p className="text-xs mt-1">Click Start to begin motion detection</p>
            </div>
          </div>
        )}
      </div>

      {/* Motion Level Indicator */}
      <Card className="p-3 bg-surface border-card-border">
        <div className="flex items-center gap-3">
          <Activity className="h-5 w-5 text-motion" />
          <div className="flex-1">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-text-muted">Motion Level</span>
              <span className="font-bold text-motion">{Math.round(motionLevel)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-gradient-to-r from-motion to-motion-glow h-2 rounded-full transition-all duration-150"
                style={{ width: `${motionLevel}%` }}
              />
            </div>
          </div>
        </div>
        
        {isRecentMovement && (
          <p className="text-xs text-success mt-2 font-medium">
            ✨ Great movement detected! Keep it up!
          </p>
        )}
      </Card>

      {/* Instructions */}
      <Card className="p-3 bg-surface border-card-border mt-3">
        <h4 className="font-bold text-foreground text-sm mb-2">How to Play:</h4>
        <ul className="text-xs text-text-muted space-y-1">
          <li>• Wave your hand near answer bubbles to "pop" them</li>
          <li>• Jump, dance, or move around while thinking</li>
          <li>• Use your whole body to help your brain focus</li>
          <li>• Green dots show when we detect your movement</li>
        </ul>
      </Card>
    </div>
  );
};