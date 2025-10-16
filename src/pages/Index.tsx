import { useState } from "react";
import { motion } from "framer-motion";
import FloatingMusicElements from "@/components/FloatingMusicElements";
import InputSection from "@/components/InputSection";
import MusicPlayer from "@/components/MusicPlayer";
import LoadingAnimation from "@/components/LoadingAnimation";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [musicData, setMusicData] = useState<{ url: string; prompt: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (prompt: string) => {
    setIsLoading(true);
    setError(null);
    setMusicData(null);

    try {
      toast.info("Starting music generation... This may take 20-40 seconds.");
      
      // Start the music generation
      const { data: startData, error: startError } = await supabase.functions.invoke('generate-music', {
        body: { prompt }
      });

      if (startError) throw startError;
      if (!startData?.id) throw new Error("Failed to start music generation");

      const predictionId = startData.id;
      console.log("Prediction started:", predictionId);

      // Poll for completion
      let attempts = 0;
      const maxAttempts = 60; // 60 attempts * 2 seconds = 2 minutes max
      
      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds between checks
        
        const { data: statusData, error: statusError } = await supabase.functions.invoke('check-music-status', {
          body: { id: predictionId }
        });

        if (statusError) {
          console.error("Status check error:", statusError);
          throw statusError;
        }

        console.log("Status:", statusData?.status);

        if (statusData?.status === "succeeded" && statusData?.output) {
          const musicUrl = Array.isArray(statusData.output) ? statusData.output[0] : statusData.output;
          setMusicData({ url: musicUrl, prompt });
          toast.success("Music generated successfully!");
          return;
        }

        if (statusData?.status === "failed") {
          throw new Error(statusData?.error || "Music generation failed");
        }

        attempts++;
        
        // Show progress update every 10 seconds
        if (attempts % 5 === 0) {
          toast.info("Still generating... Please wait.");
        }
      }

      throw new Error("Music generation timed out. Please try again.");
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Something went wrong";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Generation error:", err);
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
