import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Copy, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QuestionGeneratorProps {
  dataColumns?: string[];
}

export const QuestionGenerator = ({ dataColumns = [] }: QuestionGeneratorProps) => {
  const [prompt, setPrompt] = useState("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const { toast } = useToast();

  const generateQuestions = async () => {
    setIsGenerating(true);
    
    // Simulate AI generation (in real app, this would call an AI API)
    setTimeout(() => {
      const mockQuestions = [
        `What is your overall satisfaction with ${dataColumns[0] || 'the product'}?`,
        `How likely are you to recommend this to others?`,
        `What improvements would you suggest for ${dataColumns[1] || 'the service'}?`,
        `How would you rate the ${dataColumns[0] || 'quality'} on a scale of 1-10?`,
        `What features do you value most about ${dataColumns[1] || 'this offering'}?`,
      ];
      
      setQuestions(mockQuestions);
      setIsGenerating(false);
      toast({
        title: "Questions generated!",
        description: `Created ${mockQuestions.length} AI-powered questions`,
      });
    }, 1500);
  };

  const copyQuestion = (question: string, index: number) => {
    navigator.clipboard.writeText(question);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
    toast({
      title: "Copied!",
      description: "Question copied to clipboard",
    });
  };

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-4xl font-bold">AI Question Generator</h2>
            <p className="text-muted-foreground">
              Generate contextual survey questions based on your data
            </p>
          </div>

          <Card className="p-6 shadow-card">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Describe your survey goals
                </label>
                <Textarea
                  placeholder="E.g., 'Generate questions about customer satisfaction and product feedback for our e-commerce platform'"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
              </div>

              {dataColumns.length > 0 && (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm font-medium mb-2">Available data columns:</p>
                  <div className="flex flex-wrap gap-2">
                    {dataColumns.map((col, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm"
                      >
                        {col}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <Button
                variant="hero"
                size="lg"
                onClick={generateQuestions}
                disabled={isGenerating || !prompt}
                className="w-full"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                {isGenerating ? "Generating..." : "Generate Questions"}
              </Button>
            </div>
          </Card>

          {questions.length > 0 && (
            <div className="space-y-4 animate-in fade-in duration-500">
              <h3 className="text-2xl font-semibold">Generated Questions</h3>
              {questions.map((question, index) => (
                <Card
                  key={index}
                  className="p-4 hover:shadow-card transition-all duration-300"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <span className="text-sm font-medium text-muted-foreground">
                        Q{index + 1}
                      </span>
                      <p className="text-lg mt-1">{question}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyQuestion(question, index)}
                    >
                      {copiedIndex === index ? (
                        <CheckCircle2 className="h-4 w-4 text-accent" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
