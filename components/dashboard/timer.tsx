'use client';

import { useEffect, useState, useRef } from 'react';
import { Play, Pause, RotateCw } from 'lucide-react';

export default function FocusTimer() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load timer from localStorage on mount
  useEffect(() => {
    const storedTime = localStorage.getItem('focus-timer-time');
    const storedIsRunning = localStorage.getItem('focus-timer-running');

    if (storedTime) setTime(parseInt(storedTime));
    if (storedIsRunning === 'true') setIsRunning(true);
  }, []);

  // Persist timer state to localStorage
  useEffect(() => {
    localStorage.setItem('focus-timer-time', time.toString());
    localStorage.setItem('focus-timer-running', isRunning.toString());
  }, [time, isRunning]);

  // Timer effect
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const handleStartPause = () => {
    setIsRunning((prev) => !prev);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    localStorage.removeItem('focus-timer-time');
    localStorage.removeItem('focus-timer-running');
  };

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="flex flex-col items-center justify-center text-gray-900 p-6">
      <h1 className="text-4xl font-bold mb-8 text-orange-500">Focus Timer</h1>

      <div className="w-48 h-48 rounded-full border-[10px] border-orange-500 flex items-center justify-center shadow-lg mb-8">
        <span className="text-4xl font-mono text-orange-500">{formatTime(time)}</span>
      </div>

      <div className="flex gap-6">
        <button
          onClick={handleStartPause}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg text-white font-medium text-lg transition
            ${isRunning ? 'bg-gray-400 hover:bg-gray-500' : 'bg-orange-500 hover:bg-orange-600'}
          `}
        >
          {isRunning ? <Pause size={20} /> : <Play size={20} />}
          {isRunning ? 'Pause' : 'Start'}
        </button>

        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium text-lg transition"
        >
          <RotateCw size={20} /> Reset
        </button>
      </div>
    </div>
  );
}
