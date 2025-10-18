import { useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Upload,
  FileSpreadsheet,
  X,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { fileSchema } from "@/lib/validation/fileValidatorSchema";
import axios from "axios";

interface DataUploadProps {
  onDataUploaded: (data: string) => void;
}

export const DataUpload = ({ onDataUploaded }: DataUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { toast } = useToast();

  const parseCSV = (text: string): any[] => {
    const lines = text.split("\n");
    const headers = lines[0].split(",").map((h) => h.trim());

    return lines
      .slice(1)
      .filter((line) => line.trim())
      .map((line) => {
        const values = line.split(",");
        const row: any = {};
        headers.forEach((header, i) => {
          row[header] = values[i]?.trim() || "";
        });
        return row;
      });
  };
  console.log(uploadedFile);

  const handleFile = useCallback(
    async (file: File) => {
      const validation = fileSchema.safeParse(file);
      if (!validation.success) {
        const errorMsg = validation.error.issues[0].message;
        toast({
          title: "File validation failed",
          description: errorMsg,
          variant: "destructive",
        });
        return;
      }

      setIsUploading(true); // ✅ Start loading

      const formData = new FormData();
      formData.append("file", file);

      try {
        const uploadRes = await axios.post("/api/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        console.log("File uploaded to server:", uploadRes.data);
        setUploadedFile(file);
        onDataUploaded(uploadRes.data.id ?? "");

        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target?.result as string;
          try {
            const data = parseCSV(text);
            toast({
              title: "File uploaded successfully",
              description: `Parsed ${data.length} rows from ${file.name}`,
            });
          } catch {
            toast({
              title: "Error parsing file",
              description: "Please check your file format",
              variant: "destructive",
            });
          }
        };
        reader.readAsText(file);
      } catch (err: any) {
        console.error("Upload error:", err);
        toast({
          title: "Upload failed",
          description: err.response?.data?.error || "Unable to upload file",
          variant: "destructive",
        });
      } finally {
        setIsUploading(false); // ✅ Stop loading
      }
    },
    [onDataUploaded, toast]
  );
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const clearFile = () => {
    setUploadedFile(null);
    onDataUploaded("");
  };

  return (
    <section className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto space-y-6">
          <motion.div
            className="text-center space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold">Upload Your Dataset</h2>
            <p className="text-muted-foreground">
              Support for CSV and Excel files up to 20MB
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Card
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`p-12 transition-all duration-300 cursor-pointer shadow-card hover:shadow-glow ${
                isDragging ? "border-accent bg-accent/5 scale-105" : ""
              }`}
            >
              {!uploadedFile ? (
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="p-6 rounded-full bg-primary/10">
                      <Upload className="h-12 w-12 text-primary" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">
                      Drop your file here
                    </h3>
                    <p className="text-muted-foreground">or click to browse</p>
                  </div>

                  <div className="flex gap-2 justify-center text-sm text-muted-foreground">
                    <FileSpreadsheet className="h-4 w-4" />
                    <span>CSV, XLS, XLSX</span>
                  </div>

                  <input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileInput}
                    className="hidden"
                    id="file-upload"
                  />
                  {isUploading ? (
                    <div className="flex justify-center gap-x-3 items-center">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <section>Uploading...</section>
                    </div>
                  ) : (
                    <label htmlFor="file-upload">
                      <Button variant="accent" size="lg" asChild>
                        <span>Browse Files</span>
                      </Button>
                    </label>
                  )}
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="p-6 rounded-full bg-accent/10">
                      <CheckCircle2 className="h-12 w-12 text-accent" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">File Uploaded</h3>
                    <p className="text-muted-foreground">{uploadedFile.name}</p>
                  </div>

                  <Button variant="outline" onClick={clearFile}>
                    <X className="mr-2 h-4 w-4" />
                    Remove File
                  </Button>
                </div>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
