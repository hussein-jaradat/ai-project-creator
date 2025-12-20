import { Link } from "react-router-dom";
import { Wand2, Video, Image, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { OBrainLogo } from "@/components/OBrainLogo";
import { Navbar } from "@/components/landing/Navbar";

export default function Landing() {
  return (
    <div className="min-h-screen animated-bg flex flex-col items-center justify-center relative overflow-hidden">
      {/* Navbar */}
      <Navbar />
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      
      {/* Floating Orbs */}
      <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-neon-purple/20 rounded-full blur-[120px] animate-pulse-slow" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-neon-blue/20 rounded-full blur-[150px] animate-pulse-slow" />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-neon-cyan/10 rounded-full blur-[100px] animate-float" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center px-6 max-w-4xl"
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center gap-4 mb-8"
        >
          <OBrainLogo size="xl" className="animate-float" />
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold neon-text">OBrain</span>
            <span className="text-2xl font-bold text-foreground">أوبراين</span>
          </div>
        </motion.div>

        {/* Student Project Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6"
        >
          <Sparkles className="w-4 h-4 text-neon-cyan" />
          <span className="text-sm text-muted-foreground">مشروع طلابي يهدف للتطوير</span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
        >
          <span className="neon-text">حوّل فكرتك</span>
          <br />
          <span className="text-foreground">إلى محتوى احترافي</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed"
        >
          ارفع منتجك، تحدث مع الذكاء الاصطناعي، واحصل على صور سينمائية احترافية
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Link
            to="/studio"
            className="neon-button inline-flex items-center gap-3 text-primary-foreground animate-glow"
          >
            <Wand2 className="w-5 h-5" />
            ابدأ الآن
          </Link>
        </motion.div>

        {/* Features Pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="flex flex-wrap justify-center gap-4 mt-16"
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border/50">
            <Image className="w-4 h-4 text-neon-purple" />
            <span className="text-sm">صور احترافية</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border/50">
            <Video className="w-4 h-4 text-neon-blue" />
            <span className="text-sm">فيديوهات إعلانية</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border/50">
            <Sparkles className="w-4 h-4 text-neon-cyan" />
            <span className="text-sm">ذكاء اصطناعي متقدم</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}
