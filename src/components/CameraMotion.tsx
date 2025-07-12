import { useState, useEffect, useRef } from 'react';
import { Camera, CameraOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CameraMotionProps {
  onHandDetected?: (x: number, y: number) => void;
  isFullscreen?: boolean;
  className?: string;
}

export const CameraMotion = ({ onHandDetected, isFullscreen = false, className }: CameraMotionProps) => {
  const [isActive, setIsActive] = useState(false);
  const [handPosition, setHandPosition] = useState<{ x: number; y: number } | null>(null);
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

  // Simulate hand tracking for demo purposes
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      // Simulate hand movement detection
      if (Math.random() > 0.3) {
        const x = Math.random() * 100; // 0-100% of screen width
        const y = Math.random() * 100; // 0-100% of screen height
        setHandPosition({ x, y });
        onHandDetected?.(x, y);
      } else {
        setHandPosition(null);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [isActive, onHandDetected]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: isFullscreen ? 1920 : 640, 
          height: isFullscreen ? 1080 : 480,
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

  if (isFullscreen) {
    return (
      <>
        {/* Fullscreen Video Background */}
        <div className={cn("fixed inset-0 z-0", className)}>
          {isActive && (
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              autoPlay
              muted
              playsInline
            />
          )}
          {!isActive && (
            <div className="w-full h-full bg-gradient-to-br from-background to-surface flex items-center justify-center">
              <div className="text-center text-text-muted">
                <Camera className="mx-auto h-16 w-16 mb-4 opacity-30" />
                <p className="text-lg">Camera Feed Background</p>
                <p className="text-sm mt-2">Enable camera to see yourself while playing</p>
              </div>
            </div>
          )}
        </div>

        {/* Hand Tracking Indicator */}
        {handPosition && isActive && (
          <div
            className="fixed w-8 h-8 bg-motion rounded-full animate-pulse z-30 pointer-events-none border-2 border-background shadow-lg"
            style={{
              left: `${handPosition.x}%`,
              top: `${handPosition.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        )}

        {/* Camera Control Button */}
        <Button
          onClick={toggleCamera}
          variant={isActive ? "destructive" : "default"}
          size="sm"
          className="fixed top-4 right-4 z-50 focus-ring"
        >
          {isActive ? (
            <>
              <CameraOff className="mr-2 h-4 w-4" />
              Stop Camera
            </>
          ) : (
            <>
              <Camera className="mr-2 h-4 w-4" />
              Start Camera
            </>
          )}
        </Button>
      </>
    );
  }

  // Original compact view for non-fullscreen
  return (
    <div className={cn("camera-panel p-4", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-foreground">Hand Tracking</h3>
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

      <div className="relative bg-surface-bright rounded-lg overflow-hidden h-64">
        {isActive ? (
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            muted
            playsInline
          />
        ) : (
          <div className="flex items-center justify-center h-full text-text-muted">
            <div className="text-center">
              <Camera className="mx-auto h-12 w-12 mb-2 opacity-50" />
              <p className="text-sm">Camera is off</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};