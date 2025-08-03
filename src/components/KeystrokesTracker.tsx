import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square } from 'lucide-react';
import Button from './Button';

interface KeystrokesTrackerProps {
  onKeystrokesSubmit: (data: { count: number; duration: number }) => void;
  isTracking: boolean;
  onStartTracking: () => void;
  onStopTracking: () => void;
}

const KeystrokesTracker: React.FC<KeystrokesTrackerProps> = ({
  onKeystrokesSubmit,
  isTracking,
  onStartTracking,
  onStopTracking
}) => {
  const [keystrokes, setKeystrokes] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (isTracking && !isPaused) {
      startTimeRef.current = Date.now();
      intervalRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isTracking, isPaused]);

  useEffect(() => {
    const handleKeyPress = () => {
      if (isTracking && !isPaused) {
        setKeystrokes(prev => prev + 1);
      }
    };

    if (isTracking) {
      document.addEventListener('keydown', handleKeyPress);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [isTracking, isPaused]);

  const handleStart = () => {
    setKeystrokes(0);
    setDuration(0);
    setIsPaused(false);
    onStartTracking();
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleStop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    onStopTracking();
    onKeystrokesSubmit({ count: keystrokes, duration });
    setKeystrokes(0);
    setDuration(0);
    setIsPaused(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatKeystrokes = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  // Calculate expected salary: keystrokes * 0.01
  const expectedSalary = keystrokes * 0.01;

  return (
    <div className="bg-card rounded-lg p-6">
      <h3 className="text-xl font-semibold text-white mb-4">Keystrokes Tracker</h3>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-primary mb-1">
            {formatKeystrokes(keystrokes)}
          </div>
          <div className="text-sm text-gray-300">Keystrokes</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-white mb-1">
            {formatTime(duration)}
          </div>
          <div className="text-sm text-gray-300">Duration</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-green-400 mb-1">
            ₱{expectedSalary.toFixed(2)}
          </div>
          <div className="text-sm text-gray-300">Expected Salary</div>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        {!isTracking ? (
          <Button
            onClick={handleStart}
            variant="primary"
            size="lg"
            className="flex items-center gap-2"
          >
            <Play className="w-5 h-5" />
            Start Tracking
          </Button>
        ) : (
          <>
            <Button
              onClick={handlePause}
              variant={isPaused ? "primary" : "secondary"}
              size="lg"
              className="flex items-center gap-2"
            >
              {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
              {isPaused ? 'Resume' : 'Pause'}
            </Button>
            <Button
              onClick={handleStop}
              variant="outline"
              size="lg"
              className="flex items-center gap-2"
            >
              <Square className="w-5 h-5" />
              Stop
            </Button>
          </>
        )}
      </div>

      {isTracking && (
        <div className="text-sm text-gray-300">
          <div className="mb-2">
            <span className="text-primary">Status:</span> {isPaused ? 'Paused' : 'Tracking'}
          </div>
          <div className="mb-2">
            <span className="text-primary">Instructions:</span> Type anywhere to count keystrokes
          </div>
          <div>
            <span className="text-primary">Salary Formula:</span> Keystrokes × 0.01 = Expected Salary
          </div>
        </div>
      )}
    </div>
  );
};

export default KeystrokesTracker; 