import { responseValidatorSchema } from "@/lib/validation/responseValidatorSchema";
import { questionValidatorSchema } from "@/lib/validation/questionValidatorSchema";
import { Sparkles, Copy, CheckCircle2 } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import { Survey, Response } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { z } from "zod";

type ResponseFormData = z.infer<typeof responseValidatorSchema>;

type SurveyFormData = z.infer<typeof questionValidatorSchema>;

interface QuestionGeneratorProps {
  dataColumns?: string[];
}

export const QuestionGenerator = ({
  dataColumns = [],
}: QuestionGeneratorProps) => {
  const [surveyData, setSurveyData] = useState<Survey>({
    id: "",
    title: "",
    questions: [],
    createdAt: new Date(),
    userId: "",
  });
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SurveyFormData>({
    resolver: zodResolver(questionValidatorSchema),
  });

  const form = useForm<ResponseFormData>({
    resolver: zodResolver(responseValidatorSchema),
    defaultValues: {
      answers: surveyData.questions.map(() => ""),
    },
  });

  const {
    control,
    register: responseRegister,
    handleSubmit: handleResponseSubmit,
    formState: { errors: responseErrors, isSubmitting: isSubmittingResponse },
  } = form;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { fields } = useFieldArray({
    control,
    name: "answers",
  });

  const onSubmit = async (data: SurveyFormData) => {
    try {
      const { title, prompt } = data;

      const res = await axios.post("/api/generate-questions", {
        title,
        prompt,
      });
      setSurveyData(res.data);
      toast({
        title: "Survey created",
        description: `“${title}” has been saved successfully.`,
      });
      reset();
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

  const copyQuestion = (question: string, index: number) => {
    navigator.clipboard.writeText(question);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
    toast({
      title: "Copied!",
      description: "Question copied to clipboard",
    });
  };

  const submitAnswers = async (data: ResponseFormData) => {
    try {
      const surveyId = surveyData.id;
      const res = await axios.post("/api/submit-responses", {
        surveyId,
        answers: data.answers,
      });
      console.log(res.data);
      toast({
        title: "Responses submitted",
        description: "Your answers have been saved successfully.",
      });
      setTimeout(() => {
        setSurveyData({
          id: "",
          title: "",
          questions: [],
          createdAt: new Date(),
          userId: "",
        });
      }, 2000);
      form.reset(); // ✅ clear form after submission
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const axiosErr = err as AxiosError<{ error?: string | any[] }>;

        // Zod validation errors (array of issues)
        if (Array.isArray(axiosErr.response?.data?.error)) {
          const firstIssue = axiosErr.response?.data?.error[0];
          toast({
            title: "Validation Error",
            description: firstIssue?.message || "Invalid input data.",
            variant: "destructive",
          });
        }

        // Generic API errors (string message)
        else if (axiosErr.response?.data?.error) {
          toast({
            title: "Failed to generate questions.",
            description: axiosErr.response.data.error,
            variant: "destructive",
          });
        }

        // Network / other issues
        else {
          toast({
            title: "Network Error",
            description: "Unable to reach the server. Please try again later.",
            variant: "destructive",
          });
        }
      } else {
        // Non-Axios error (unexpected runtime)
        toast({
          title: "Unexpected Error",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  useEffect(() => {
    if (surveyData.questions.length > 0) {
      form.reset({
        answers: surveyData.questions.map(() => ""),
      });
    }
  }, [surveyData.questions, form]);

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
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Survey Title
                </label>
                <Input
                  placeholder="E.g., 'Customer Satisfaction Survey 2025'"
                  {...register("title")}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Describe your survey goals (optional)
                </label>
                <Textarea
                  placeholder="E.g., 'Generate questions about customer satisfaction and product feedback for our e-commerce platform'"
                  rows={3}
                  className="resize-none"
                  {...register("prompt")}
                />
                {errors.prompt && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.prompt.message}
                  </p>
                )}
              </div>

              {dataColumns.length > 0 && (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm font-medium mb-2">
                    Available data columns:
                  </p>
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
                type="submit"
                disabled={isSubmitting}
                className="w-full"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                {isSubmitting ? "Generating..." : "Generate Questions"}
              </Button>
            </form>
          </Card>
          <form onSubmit={handleResponseSubmit(submitAnswers)}>
            <AnimatePresence>
              {surveyData.questions.length > 0 && (
                <motion.div
                  className="space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className="text-2xl font-semibold">
                    Questionnaire - {surveyData.title}
                  </h3>
                  <Card className="p-0 shadow-card overflow-hidden">
                    <Accordion type="single" collapsible defaultValue="q-0">
                      {fields.map((field, index) => (
                        <AccordionItem key={field.id} value={`q-${index}`}>
                          <AccordionTrigger>
                            <div className="px-6 flex items-center justify-between w-full gap-4">
                              <span className="text-left">
                                {index + 1}. {surveyData.questions[index]}
                              </span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  copyQuestion(
                                    surveyData.questions[index],
                                    index
                                  );
                                }}
                                className="h-8 w-8"
                                aria-label="Copy question"
                              >
                                {copiedIndex === index ? (
                                  <CheckCircle2 className="h-4 w-4 text-accent" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </AccordionTrigger>

                          <AccordionContent className="px-6">
                            <label className="text-sm font-medium mb-2 block">
                              Your answer
                            </label>
                            <Textarea
                              {...responseRegister(`answers.${index}` as const)}
                              rows={4}
                              placeholder="Type your response here..."
                              className="resize-y"
                            />
                            {responseErrors.answers?.[index] && (
                              <p className="text-sm text-red-500 mt-1">
                                {responseErrors.answers[index]?.message}
                              </p>
                            )}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </Card>

                  <div className="flex justify-end">
                    {/* <Button variant="accent" onClick={submitAnswers}>
                    Submit responses
                  </Button> */}
                    <Button
                      variant="accent"
                      type="submit"
                      disabled={isSubmittingResponse}
                    >
                      {isSubmittingResponse
                        ? "Submitting..."
                        : "Submit responses"}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </div>
    </section>
  );
};
