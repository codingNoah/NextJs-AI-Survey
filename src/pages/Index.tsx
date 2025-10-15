import { useState, useRef } from "react";
import { Hero } from "@/components/Hero";
import { DataUpload } from "@/components/DataUpload";
import { QuestionGenerator } from "@/components/QuestionGenerator";
import { DataVisualization } from "@/components/DataVisualization";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { motion } from "framer-motion";

const Index = () => {
  const [uploadedData, setUploadedData] = useState<any[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const uploadRef = useRef<HTMLDivElement>(null);
  const generateRef = useRef<HTMLDivElement>(null);
  const visualizeRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (section: 'upload' | 'generate' | 'visualize') => {
    const refs = {
      upload: uploadRef,
      generate: generateRef,
      visualize: visualizeRef,
    };
    
    refs[section]?.current?.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  const dataColumns = uploadedData.length > 0 ? Object.keys(uploadedData[0]) : [];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg" />
              <span className="text-xl font-bold">SurveyAI</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <button
                onClick={() => scrollToSection('upload')}
                className="text-foreground/80 hover:text-foreground transition-colors"
              >
                Upload
              </button>
              <button
                onClick={() => scrollToSection('generate')}
                className="text-foreground/80 hover:text-foreground transition-colors"
              >
                Generate
              </button>
              <button
                onClick={() => scrollToSection('visualize')}
                className="text-foreground/80 hover:text-foreground transition-colors"
              >
                Visualize
              </button>
              <ThemeToggle />
              <Button variant="accent" size="sm">
                Get Started
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 space-y-2 border-t">
              <button
                onClick={() => scrollToSection('upload')}
                className="block w-full text-left px-4 py-2 hover:bg-muted rounded-md"
              >
                Upload
              </button>
              <button
                onClick={() => scrollToSection('generate')}
                className="block w-full text-left px-4 py-2 hover:bg-muted rounded-md"
              >
                Generate
              </button>
              <button
                onClick={() => scrollToSection('visualize')}
                className="block w-full text-left px-4 py-2 hover:bg-muted rounded-md"
              >
                Visualize
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-16">
        <Hero onNavigate={scrollToSection} />
        
        <div ref={uploadRef}>
          <DataUpload onDataUploaded={setUploadedData} />
        </div>
        
        <div ref={generateRef}>
          <QuestionGenerator dataColumns={dataColumns} />
        </div>
        
        <div ref={visualizeRef}>
          <DataVisualization data={uploadedData} />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-primary rounded-md" />
              <span className="font-semibold">SurveyAI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 SurveyAI. AI-powered data insights for everyone.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
