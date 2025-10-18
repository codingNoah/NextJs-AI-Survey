import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { DraggableCharts } from "@/components/DraggableCharts";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { Dataset } from "@/types/data-set";

interface DataVisualizationProps {
  data: Dataset;
  dataSetID: string;
}

export const DataVisualization = ({
  data,
  dataSetID,
}: DataVisualizationProps) => {
  if (!data) {
    return (
      <section className="py-20 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <h2 className="text-4xl font-bold">Data Visualization</h2>
            <p className="text-muted-foreground">
              Upload data to see interactive visualizations
            </p>
          </div>
        </div>
      </section>
    );
  }

  console.log("data", data);
  return (
    <section className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto space-y-8">
          <motion.div
            className="text-center space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold">Data Insights</h2>
            <p className="text-muted-foreground">
              Interactive visualizations with drag-and-drop layout
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <DraggableCharts dataset={data} />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
