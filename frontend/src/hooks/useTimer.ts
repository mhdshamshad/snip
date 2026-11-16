import { useEffect, useState } from 'react';

export function useTimer(durationSeconds = 60) {
  const [remainingSeconds, setRemainingSeconds] = useState(() =>
    Number.isFinite(durationSeconds) ? Math.max(0, Math.floor(durationSeconds)) : 0
  );

  useEffect(() => {
    if (remainingSeconds <= 0) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setRemainingSeconds(current => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearTimeout(timeoutId);
  }, [remainingSeconds]);

  const start = (seconds = durationSeconds) => {
    const duration = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
    setRemainingSeconds(duration);
  };

  return {
    remainingSeconds,
    start,
  };
}
