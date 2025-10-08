import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";

interface InputSectionProps {
  onGenerate: (prompt: string) => void;
  isLoading: boolean;
}

const InputSection = ({ onGenerate, isLoading }: InputSectionProps) => {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      toast.error("Please describe your music idea first!");
      return;
    }
    onGenerate(prompt);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="w-full max-w-3xl mx-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="glass-card rounded-3xl p-8 space-y-6">
          <div className="space-y-4">
            <label htmlFor="music-prompt" className="block text-sm font-medium text-foreground/80">
              Describe your music vibe
            </label>
            <textarea
              id="music-prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., upbeat piano, lo-fi chill, cinematic score, jazz fusion, ambient electronic..."
              disabled={isLoading}
              rows={4}
              className="w-full px-6 py-4 bg-input/50 border-2 border-border rounded-2xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:shadow-neon transition-all duration-300 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <motion.button
            type="submit"
            disabled={isLoading || !prompt.trim()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 px-8 bg-gradient-primary text-primary-foreground font-semibold rounded-2xl shadow-neon hover:shadow-neon-pink transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-3 group"
          >
            <Sparkles className="w-5 h-5 group-hover:animate-spin-slow" />
            <span>{isLoading ? "Generating..." : "Generate Music"}</span>
          </motion.button>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          ✨ Powered by advanced AI music generation
        </p>
      </form>
    </motion.div>
  );
};

export default InputSection;
