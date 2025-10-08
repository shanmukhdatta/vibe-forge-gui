import { Music2, Music, Radio, Disc3 } from "lucide-react";
import { motion } from "framer-motion";

const FloatingMusicElements = () => {
  const elements = [
    { Icon: Music2, delay: 0, duration: 8, x: "10%", y: "20%" },
    { Icon: Music, delay: 1, duration: 10, x: "80%", y: "30%" },
    { Icon: Radio, delay: 2, duration: 9, x: "20%", y: "70%" },
    { Icon: Disc3, delay: 1.5, duration: 11, x: "85%", y: "75%" },
    { Icon: Music2, delay: 0.5, duration: 7, x: "50%", y: "10%" },
    { Icon: Music, delay: 2.5, duration: 12, x: "70%", y: "60%" },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {elements.map((element, index) => (
        <motion.div
          key={index}
          className="absolute opacity-10"
          style={{
            left: element.x,
            top: element.y,
          }}
          animate={{
            y: [0, -30, 0],
            rotate: [0, 10, -10, 0],
            opacity: [0.05, 0.15, 0.05],
          }}
          transition={{
            duration: element.duration,
            repeat: Infinity,
            delay: element.delay,
            ease: "easeInOut",
          }}
        >
          <element.Icon className="w-16 h-16 md:w-24 md:h-24 text-primary" />
        </motion.div>
      ))}
      
      {/* Animated gradient orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl"
        style={{
          background: "radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl"
        style={{
          background: "radial-gradient(circle, hsl(var(--secondary)) 0%, transparent 70%)",
        }}
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.1, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

export default FloatingMusicElements;
