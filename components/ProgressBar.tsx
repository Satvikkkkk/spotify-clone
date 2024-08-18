import React, { useEffect, useState } from "react";
import { Slider } from "./bar";
import { twMerge } from "tailwind-merge";
import useClock from "@/hooks/use-clock";
import usePlayer from "@/hooks/usePlayer";

interface ProgressBarProps {
  sound: any;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  sound,
  className,
}) => {
  const player = usePlayer();
  const clock = useClock();

  const [isMovingProgressBar, setIsMovingProgressBar] = useState(false);
  const [songProgressBar, setSongProgressBar] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [duration, setDuration] = useState(0);

  // Fetch the duration of the song when the sound is ready
  useEffect(() => {
    if (sound && sound._duration) {
      const songDuration = sound._duration * 1000; // Convert to milliseconds
      setDuration(songDuration);
      setSongProgressBar(0); // Reset to 0 when sound loads
      console.log("Duration:", songDuration);
    }
  }, [sound]);

  const formatTime = (milliseconds: number) => {
    const mins = Math.floor(milliseconds / 60000);
    const secs = Math.floor((milliseconds % 60000) / 1000);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleProgressChange = (value: number[]) => {
    setIsMovingProgressBar(true);
    setSongProgressBar(Math.round(value[0]));
  };

  // Updates the position of the song progress if it's not being moved by user
  useEffect(() => {
    if (sound && sound.state() === "loaded" && !isMovingProgressBar && !isUpdating) {
      setIsUpdating(true);
      const seekValue = sound.seek() * 1000; // Convert to milliseconds
      if (typeof seekValue === "number" && !isNaN(seekValue)) {
        setSongProgressBar(Math.round(seekValue));
      }
      setIsUpdating(false);
    }
  }, [sound, isMovingProgressBar, clock, isUpdating]);

  const handleProgressCommit = (value: number[]) => {
    console.log("Committing to:", value[0]);
    if (sound) {
      const clampedValue = Math.min(Math.max(value[0], 0), duration);
      sound.seek(clampedValue / 1000); // Convert back to seconds for seek
      setSongProgressBar(clampedValue); // Update progress bar position
    }
    setIsMovingProgressBar(false);
    if (!player.isPlaying) {
      player.handlePlay();
    }
  };

  return (
    <div className={twMerge("flex justify-between w-full", className)}>
      <p className="w-8">{formatTime(songProgressBar)}</p>
      <Slider
        defaultValue={[0]}
        value={[songProgressBar]}
        onValueChange={handleProgressChange}
        onValueCommit={handleProgressCommit}
        step={duration / 100000}
        max={duration}
        className="mx-2"
      />
      <p className="w-8">{formatTime(duration)}</p>
    </div>
  );
};

export default ProgressBar;