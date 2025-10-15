import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Copy, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

interface QuestionGeneratorProps {
  dataColumns?: string[];
}

export const QuestionGenerator = ({ dataColumns = [] }: QuestionGeneratorProps) => {
  const [title, setTitle] = useState("");
  const [prompt, setPrompt] = useState("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [questionInputs, setQuestionInputs] = useState<string[]>(Array(5).fill(""));
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const { toast } = useToast();

  const generateQuestions = async () => {
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a survey title",
        variant: "destructive",
      });
      return;
    }
    
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
      setQuestionInputs(mockQuestions);
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
                  Survey Title
                </label>
                <Input
                  placeholder="E.g., 'Customer Satisfaction Survey 2025'"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Describe your survey goals (optional)
                </label>
                <Textarea
                  placeholder="E.g., 'Generate questions about customer satisfaction and product feedback for our e-commerce platform'"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={3}
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
                disabled={isGenerating}
                className="w-full"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                {isGenerating ? "Generating..." : "Generate Questions"}
              </Button>
            </div>
          </Card>

          <AnimatePresence>
            {questions.length > 0 && (
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-2xl font-semibold">Dynamic Question Form</h3>
                <Card className="p-6 shadow-card">
                  <div className="space-y-4">
                    {questionInputs.map((question, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        className="space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium">
                            Question {index + 1}
                          </label>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => copyQuestion(question, index)}
                            className="h-8 w-8"
                          >
                            {copiedIndex === index ? (
                              <CheckCircle2 className="h-4 w-4 text-accent" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        <Input
                          value={question}
                          onChange={(e) => {
                            const newInputs = [...questionInputs];
                            newInputs[index] = e.target.value;
                            setQuestionInputs(newInputs);
                          }}
                          placeholder={`Enter question ${index + 1}`}
                          className="text-base"
                        />
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
