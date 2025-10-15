import { Button } from "@/components/ui/button";
import { Sparkles, Upload, BarChart3 } from "lucide-react";
import heroImage from "@/assets/hero-bg.jpg";

interface HeroProps {
  onNavigate: (section: 'upload' | 'generate' | 'visualize') => void;
}

export const Hero = ({ onNavigate }: HeroProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-primary opacity-90" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-1000">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground leading-tight">
              AI-Powered Survey
              <span className="block bg-gradient-accent bg-clip-text text-transparent">
                Data Analytics
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-2xl mx-auto">
              Upload your data, generate intelligent questions with AI, and visualize insights instantly
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Button 
              variant="hero" 
              size="lg"
              onClick={() => onNavigate('upload')}
              className="text-lg px-8 py-6"
            >
              <Upload className="mr-2 h-5 w-5" />
              Upload Dataset
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => onNavigate('generate')}
              className="text-lg px-8 py-6 bg-background/10 backdrop-blur-sm border-primary-foreground/30 text-primary-foreground hover:bg-background/20"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Generate Questions
            </Button>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16">
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
          </div>
        </div>
      </div>
    </section>
  );
};
