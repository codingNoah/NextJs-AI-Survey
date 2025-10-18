import { Sparkles, Upload, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-bg.jpg";
import { motion } from "framer-motion";

interface HeroProps {
  onNavigate: (section: "upload" | "generate" | "visualize") => void;
}

export const Hero = ({ onNavigate }: HeroProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroImage.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-primary opacity-90" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-20 text-center">
        <motion.div
          className="max-w-4xl mx-auto space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="space-y-4">
            <motion.h1
              className="text-5xl md:text-7xl font-bold text-primary-foreground leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              AI-Powered Survey
              <span className="block bg-gradient-accent bg-clip-text text-transparent">
                Data Analytics
              </span>
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl text-primary-foreground/90 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Upload your data, generate intelligent questions with AI, and
              visualize insights instantly
            </motion.p>
          </div>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <Button
              variant="hero"
              size="lg"
              onClick={() => onNavigate("upload")}
              className="text-lg px-8 py-6"
            >
              <Upload className="mr-2 h-5 w-5" />
              Upload Dataset
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => onNavigate("generate")}
              className="text-lg px-8 py-6 bg-background/10 backdrop-blur-sm border-primary-foreground/30 text-primary-foreground hover:bg-background/20"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Generate Questions
            </Button>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <div className="p-6 rounded-xl bg-background/10 backdrop-blur-sm border border-primary-foreground/20 hover:bg-background/20 transition-all duration-300 hover:shadow-glow">
              <Upload className="h-12 w-12 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-primary-foreground mb-2">
                Smart Upload
              </h3>
              <p className="text-primary-foreground/80">
                Drag & drop CSV or Excel files with automatic data parsing
              </p>
            </div>

            <div className="p-6 rounded-xl bg-background/10 backdrop-blur-sm border border-primary-foreground/20 hover:bg-background/20 transition-all duration-300 hover:shadow-glow">
              <Sparkles className="h-12 w-12 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-primary-foreground mb-2">
                AI Questions
              </h3>
              <p className="text-primary-foreground/80">
                Generate contextual survey questions powered by AI
              </p>
            </div>

            <div className="p-6 rounded-xl bg-background/10 backdrop-blur-sm border border-primary-foreground/20 hover:bg-background/20 transition-all duration-300 hover:shadow-glow">
              <BarChart3 className="h-12 w-12 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-primary-foreground mb-2">
                Live Insights
              </h3>
              <p className="text-primary-foreground/80">
                Interactive charts and real-time data visualization
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
