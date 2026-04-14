import { useState, useEffect } from 'react';
import { playBeep } from '../utils/audio';

export default function Timer({ initialSeconds, onTimeUp, isRunning }) {
    const [timeLeft, setTimeLeft] = useState(initialSeconds);

    useEffect(() => {
        setTimeLeft(initialSeconds);
    }, [initialSeconds]);

    useEffect(() => {
        let interval = null;
        if (isRunning && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prev => {
                    const newTime = prev - 1;
                    if (newTime <= 10 && newTime > 0) {
                        playBeep(800, 100); // Beep at 800Hz for 100ms
                    }
                    return newTime;
                });
            }, 1000);
        } else if (timeLeft === 0 && isRunning) {
            onTimeUp();
        }
        return () => clearInterval(interval);
    }, [isRunning, timeLeft, onTimeUp]);

    const formatTime = () => {
        const m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
        const s = (timeLeft % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const isWarning = timeLeft <= 10 && timeLeft > 0;

    return (
        <div className={`timer-container ${isWarning ? 'timer-warning' : ''}`}>
            {formatTime()}
        </div>
    );
}
