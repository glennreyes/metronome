'use client';

import { click } from '@/lib/sfx';
import { Pause, Play } from 'lucide-react';
import { type FC, useEffect, useMemo, useState } from 'react';

import { Button } from './ui/button';
import { Slider } from './ui/slider';

export const Metronome: FC = () => {
  const [bpm, setBpm] = useState(120);
  const [playing, setPlaying] = useState(false);
  const audioContext = useMemo(() => new AudioContext(), []);
  const interval = useMemo(() => (60 / bpm) * 1000, [bpm]);

  useEffect(() => {
    if (playing) {
      click(audioContext);
      const intervalId = setInterval(() => {
        click(audioContext);
      }, interval);

      return () => {
        clearInterval(intervalId);
      };
    }

    return;
  }, [audioContext, interval, playing]);

  const handlePlayStop = () => {
    setPlaying(!playing);
  };
  const handleTempChange = ([value]: number[]) => {
    if (playing) {
      setPlaying(false);
    }

    setBpm(value);
  };

  return (
    <div className="flex w-full flex-col justify-center gap-16 md:w-80">
      <div className="text-center">
        <div className="text-8xl font-bold">{bpm}</div>
        <div className="text-muted-foreground">BPM</div>
      </div>

      <div className="flex flex-col justify-center gap-6">
        <div className="flex flex-col items-center gap-2 md:flex-row">
          <Slider
            max={400}
            min={24}
            onValueChange={handleTempChange}
            step={1}
            value={[bpm]}
          />
        </div>
        <Button
          className="w-full"
          onClick={handlePlayStop}
          size="icon"
          variant={playing ? 'secondary' : undefined}
        >
          {playing ? (
            <Pause className="h-5 w-5" strokeWidth={1.5} />
          ) : (
            <Play className="h-5 w-5" strokeWidth={1.5} />
          )}
        </Button>
      </div>
    </div>
  );
};
