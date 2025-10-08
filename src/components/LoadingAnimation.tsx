import { motion } from "framer-motion";
import { Disc3 } from "lucide-react";

const LoadingAnimation = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-12">
      <motion.div
        className="relative"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <Disc3 className="w-20 h-20 text-primary" strokeWidth={1.5} />
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: "radial-gradient(circle, hsl(var(--primary) / 0.3) 0%, transparent 70%)",
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      </motion.div>
      
      <div className="flex gap-2 items-end">
        {[0, 1, 2, 3, 4].map((index) => (
          <motion.div
            key={index}
            className="w-2 h-12 bg-gradient-primary rounded-full"
            animate={{
              scaleY: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: index * 0.1,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      
      <p className="text-foreground/70 text-sm font-medium animate-pulse">
        Generating your music...
      </p>
    </div>
  );
};

export default LoadingAnimation;
