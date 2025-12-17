import { motion } from "framer-motion";

const ViewingModeIndicator = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-destructive/90 backdrop-blur-sm py-2 px-4"
    >
      <div className="container mx-auto flex items-center justify-center gap-3">
        {/* Pulsing red light */}
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </span>
        
        {/* Status text */}
        <span className="text-destructive-foreground text-sm font-medium">
          Viewing Mode — This is a demo project (read-only)
        </span>
      </div>
    </motion.div>
  );
};

export default ViewingModeIndicator;
