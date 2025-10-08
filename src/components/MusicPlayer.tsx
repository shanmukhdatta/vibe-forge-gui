import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, RotateCcw } from "lucide-react";

interface MusicPlayerProps {
  audioUrl: string;
  prompt: string;
}

const MusicPlayer = ({ audioUrl, prompt }: MusicPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      const value = (audio.currentTime / audio.duration) * 100 || 0;
      setProgress(value);
      setCurrentTime(audio.currentTime);
    };

    const updateDuration = () => {
      setDuration(audio.duration);
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", () => setIsPlaying(false));

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", () => setIsPlaying(false));
    };
  }, [audioUrl]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const value = parseFloat(e.target.value);
    audio.currentTime = (value / 100) * audio.duration;
    setProgress(value);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const value = parseFloat(e.target.value);
    audio.volume = value;
    setVolume(value);
    setIsMuted(value === 0);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.volume = volume || 0.5;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const restart = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = 0;
    setProgress(0);
    setCurrentTime(0);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-3xl mx-auto"
    >
      <div className="glass-card rounded-3xl p-8 space-y-8">
        {/* Album Art / Visual Display */}
        <div className="relative mx-auto w-48 h-48 md:w-64 md:h-64">
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-primary"
            animate={{
              rotate: isPlaying ? 360 : 0,
              scale: isPlaying ? [1, 1.05, 1] : 1,
            }}
            transition={{
              rotate: { duration: 8, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
            }}
          />
          <motion.div
            className="absolute inset-4 rounded-full bg-background/80 backdrop-blur-xl flex items-center justify-center"
            animate={{
              boxShadow: isPlaying
                ? ["0 0 20px hsl(var(--primary) / 0.3)", "0 0 40px hsl(var(--primary) / 0.6)", "0 0 20px hsl(var(--primary) / 0.3)"]
                : "0 0 20px hsl(var(--primary) / 0.3)",
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <motion.button
              onClick={togglePlay}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-primary flex items-center justify-center shadow-neon hover:shadow-neon-pink transition-all duration-300"
            >
              {isPlaying ? (
                <Pause className="w-10 h-10 md:w-12 md:h-12 text-primary-foreground" fill="currentColor" />
              ) : (
                <Play className="w-10 h-10 md:w-12 md:h-12 text-primary-foreground ml-1" fill="currentColor" />
              )}
            </motion.button>
          </motion.div>
        </div>

        {/* Prompt Display */}
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">Generated from:</p>
          <p className="text-lg font-medium text-foreground italic">"{prompt}"</p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleSeek}
            className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-neon [&::-webkit-slider-thumb]:cursor-pointer"
            style={{
              background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${progress}%, hsl(var(--muted)) ${progress}%, hsl(var(--muted)) 100%)`,
            }}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6">
          <motion.button
            onClick={restart}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 rounded-full bg-muted/50 hover:bg-muted transition-colors"
          >
            <RotateCcw className="w-5 h-5 text-foreground" />
          </motion.button>

          <div className="flex items-center gap-3">
            <motion.button
              onClick={toggleMute}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-full bg-muted/50 hover:bg-muted transition-colors"
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5 text-foreground" />
              ) : (
                <Volume2 className="w-5 h-5 text-foreground" />
              )}
            </motion.button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-24 h-2 bg-muted rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer"
            />
          </div>
        </div>

        <audio ref={audioRef} src={audioUrl} />
      </div>
    </motion.div>
  );
};

export default MusicPlayer;
