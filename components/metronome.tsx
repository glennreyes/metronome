'use client';

import { click } from '@/lib/sfx';
import { cn } from '@/lib/utils';
import { Pause, Play, Zap, ZapOff } from 'lucide-react';
import { type FC, useCallback, useEffect, useMemo, useState } from 'react';

import { Button } from './ui/button';
import { Card, CardHeader } from './ui/card';
import { Slider } from './ui/slider';

export const Metronome: FC = () => {
  const [bpm, setBpm] = useState(90);
  const [playing, setPlaying] = useState(false);
  const [highlight, setHighlight] = useState(false);
  const [highlightEnabled, setHighlightEnabled] = useState(true);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const interval = useMemo(() => (60 / bpm) * 1000, [bpm]);

  useEffect(() => {
    setAudioContext(new AudioContext());

    return () => {
      void (async () => {
        await audioContext?.close();
      })();
    };
  }, [audioContext]);

  const beat = useCallback(() => {
    if (!audioContext) {
      return;
    }

    click(audioContext);

    setHighlight(true);
    setTimeout(() => {
      setHighlight(false);
    }, interval * 0.5);
  }, [audioContext, interval]);

  useEffect(() => {
    if (playing) {
      beat();

      const intervalId = setInterval(() => {
        beat();
      }, interval);

      return () => {
        clearInterval(intervalId);
      };
    }

    return;
  }, [beat, interval, playing]);

  const handlePlayStop = () => {
    setPlaying(!playing);
  };
  const handleHighlightChange = () => {
    setHighlightEnabled(!highlightEnabled);
  };
  const handleTempChange = ([value]: number[]) => {
    if (playing) {
      setPlaying(false);
    }

    setBpm(value);
  };

  return (
    <Card
      className={cn({
        'border-primary/25 shadow-primary/25': highlightEnabled && highlight,
        'shadow-xl transition duration-300': highlightEnabled,
      })}
    >
      <CardHeader>
        <div className="flex w-full flex-col justify-center gap-16 md:w-80">
          <div className="text-center">
            <div className="text-8xl">{bpm}</div>
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
            <div className="flex gap-2">
              <Button
                className="flex-1"
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
              <Button
                onClick={handleHighlightChange}
                size="icon"
                variant="ghost"
              >
                {highlightEnabled ? (
                  <Zap className="h-5 w-5" strokeWidth={1.5} />
                ) : (
                  <ZapOff className="h-5 w-5" strokeWidth={1.5} />
                )}
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};
