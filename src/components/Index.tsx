import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { QuestionGenerator } from "@/components/QuestionGenerator";
import { DataVisualization } from "@/components/DataVisualization";
import { ThemeToggle } from "@/components/ThemeToggle";
import { DataUpload } from "@/components/DataUpload";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { signOut } from "next-auth/react";
import axios, { AxiosError } from "axios";
import { Hero } from "@/components/Hero";
import { Dataset } from "@prisma/client";
import { Menu } from "lucide-react";

const Index = () => {
  const [uploadedData, setUploadedData] = useState<Dataset | null>(null);
  const [dataSetID, setDataSetID] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data } = useSession({ required: true });
  const { toast } = useToast();

  const user = data.user;

  const uploadRef = useRef<HTMLDivElement>(null);
  const generateRef = useRef<HTMLDivElement>(null);
  const visualizeRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (section: "upload" | "generate" | "visualize") => {
    const refs = {
      upload: uploadRef,
      generate: generateRef,
      visualize: visualizeRef,
    };

    refs[section]?.current?.scrollIntoView({ behavior: "smooth" });
    setIsMobileMenuOpen(false);
  };

  const getDataInsight = async () => {
    try {
      if (!dataSetID) {
        return;
      }

      const res = await axios.get(`/api/insights?id=${dataSetID}`);
      setUploadedData(res.data);
      toast({
        title: "Your data summary has arrived",
      });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const axiosErr = err as AxiosError<{ error?: string | any[] }>;

        if (Array.isArray(axiosErr.response?.data?.error)) {
          const firstIssue = axiosErr.response?.data?.error[0];
          toast({
            title: "Validation Error",
            description: firstIssue?.message || "Invalid input data.",
            variant: "destructive",
          });
        } else if (axiosErr.response?.data?.error) {
          toast({
            title: "Failed to generate questions.",
            description: axiosErr.response.data.error,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Network Error",
            description: "Unable to reach the server. Please try again later.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Unexpected Error",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    }
  };
  useEffect(() => {
    getDataInsight();
  }, [dataSetID]);
  return (
    <div className="min-h-screen">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg" />
              <span className="text-xl font-bold">SurveyAI</span>
            </div>

            <div className="hidden md:flex items-center space-x-6">
              <button
                onClick={() => scrollToSection("upload")}
                className="text-foreground/80 hover:text-foreground transition-colors"
              >
                Upload
              </button>
              <button
                onClick={() => scrollToSection("generate")}
                className="text-foreground/80 hover:text-foreground transition-colors"
              >
                Generate
              </button>
              <button
                onClick={() => scrollToSection("visualize")}
                className="text-foreground/80 hover:text-foreground transition-colors"
              >
                Visualize
              </button>
              <ThemeToggle />

              {!user ? (
                <Button variant="accent" size="sm">
                  Get Started
                </Button>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8 border">
                      <AvatarImage
                        src={user.image ?? ""}
                        alt={user.name ?? "User"}
                      />
                      <AvatarFallback>{user.name}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-muted-foreground">
                      {user.name || "Guest"}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-sm"
                    onClick={() => signOut()}
                  >
                    Sign Out
                  </Button>
                </div>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>

          {isMobileMenuOpen && (
            <div className="md:hidden py-4 space-y-2 border-t">
              <button
                onClick={() => scrollToSection("upload")}
                className="block w-full text-left px-4 py-2 hover:bg-muted rounded-md"
              >
                Upload
              </button>
              <button
                onClick={() => scrollToSection("generate")}
                className="block w-full text-left px-4 py-2 hover:bg-muted rounded-md"
              >
                Generate
              </button>
              <button
                onClick={() => scrollToSection("visualize")}
                className="block w-full text-left px-4 py-2 hover:bg-muted rounded-md"
              >
                Visualize
              </button>
            </div>
          )}
        </div>
      </nav>

      <main className="pt-16">
        <Hero onNavigate={scrollToSection} />

        <div ref={generateRef}>
          <QuestionGenerator dataColumns={[]} />
        </div>

        <div ref={uploadRef}>
          <DataUpload onDataUploaded={setDataSetID} />
        </div>

        <div ref={visualizeRef}>
          <DataVisualization data={uploadedData} dataSetID={dataSetID} />
        </div>
      </main>

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
