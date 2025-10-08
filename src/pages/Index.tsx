import { useState } from "react";
import { motion } from "framer-motion";
import FloatingMusicElements from "@/components/FloatingMusicElements";
import InputSection from "@/components/InputSection";
import MusicPlayer from "@/components/MusicPlayer";
import LoadingAnimation from "@/components/LoadingAnimation";
import { toast } from "sonner";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [musicData, setMusicData] = useState<{ url: string; prompt: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (prompt: string) => {
    setIsLoading(true);
    setError(null);
    setMusicData(null);

    try {
      // TODO: Replace with actual API endpoint
      const response = await fetch("/api/generate-music", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate music");
      }

      const data = await response.json();
      
      // For demo purposes, using a placeholder
      // In production, this would be: setMusicData({ url: data.musicUrl, prompt });
      toast.info("Backend not connected yet. This is a UI demo.");
      
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Demo: Use a placeholder audio URL (you can replace this with actual generated music)
      setMusicData({
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", // Demo audio
        prompt,
      });
      
      toast.success("Music generated successfully!");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Something went wrong";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <FloatingMusicElements />

      <div className="relative z-10 container mx-auto px-4 py-12 md:py-20">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 md:mb-24"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-4 neon-glow">
            🎼 AI Music Composer
          </h1>
          <p className="text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto">
            Transform your ideas into beautiful melodies. Describe your music vibe and let AI
            create the perfect soundtrack for your mood.
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="space-y-12">
          {!musicData && !isLoading && <InputSection onGenerate={handleGenerate} isLoading={isLoading} />}

          {isLoading && <LoadingAnimation />}

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-3xl mx-auto"
            >
              <div className="glass-card rounded-3xl p-8 border-2 border-destructive">
                <p className="text-destructive text-center font-medium">{error}</p>
                <motion.button
                  onClick={() => setError(null)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-4 mx-auto block px-6 py-2 bg-gradient-primary text-primary-foreground rounded-xl font-medium"
                >
                  Try Again
                </motion.button>
              </div>
            </motion.div>
          )}

          {musicData && (
            <div className="space-y-8">
              <MusicPlayer audioUrl={musicData.url} prompt={musicData.prompt} />
              
              <motion.button
                onClick={() => setMusicData(null)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mx-auto block px-8 py-3 glass-card rounded-2xl text-foreground font-medium hover:border-primary transition-all duration-300"
              >
                Generate Another
              </motion.button>
            </div>
          )}
        </div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="text-center mt-20 text-sm text-muted-foreground"
        >
          <p className="gradient-text font-semibold text-base">
            Experience the future of music creation
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
