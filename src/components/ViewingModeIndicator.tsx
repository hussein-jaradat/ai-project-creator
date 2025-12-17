import { motion } from "framer-motion";
import { Eye, Shield, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const ViewingModeIndicator = () => {
  const { isAdmin, isLoading, signOut } = useAuth();

  if (isLoading) return null;

  if (isAdmin) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed bottom-4 left-4 z-50 flex items-center gap-2 px-3 py-2 rounded-lg bg-green-600/80 backdrop-blur-sm shadow-lg"
      >
        {/* Pulsing green light */}
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
        
        <Shield className="w-3.5 h-3.5 text-white" />
        <span className="text-white text-xs font-medium">
          Admin
        </span>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={signOut}
          className="h-6 px-2 text-white hover:bg-white/20"
        >
          <LogOut className="w-3 h-3" />
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed bottom-4 left-4 z-50 flex items-center gap-2 px-3 py-2 rounded-lg bg-destructive/80 backdrop-blur-sm shadow-lg pointer-events-none"
    >
      {/* Pulsing red light */}
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
      </span>
      
      <Eye className="w-3.5 h-3.5 text-destructive-foreground" />
      <span className="text-destructive-foreground text-xs font-medium">
        Viewing
      </span>
    </motion.div>
  );
};

export default ViewingModeIndicator;
