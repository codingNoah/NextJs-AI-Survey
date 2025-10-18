import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  GripVertical,
  Save,
  RotateCcw,
  Sparkles,
  Brain,
  Lightbulb,
} from "lucide-react";
import { Responsive, WidthProvider, Layout } from "react-grid-layout";
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
import { useToast } from "@/hooks/use-toast";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { Dataset } from "@prisma/client";
import { DraggableChartsProps } from "@/types/data-set";

const ResponsiveGridLayout = WidthProvider(Responsive);

const COLORS = [
  "hsl(240, 60%, 45%)",
  "hsl(180, 70%, 50%)",
  "hsl(260, 70%, 55%)",
  "hsl(200, 80%, 60%)",
];

const STORAGE_KEY = "dashboard-layout";

const defaultLayout: Layout[] = [
  { i: "insight", x: 0, y: 0, w: 12, h: 3 },
  { i: "bar", x: 0, y: 3, w: 6, h: 5 },
  { i: "line", x: 6, y: 3, w: 6, h: 5 },
  { i: "pie", x: 0, y: 8, w: 6, h: 5 },
  { i: "summary", x: 6, y: 8, w: 6, h: 5 },
];

export const DraggableCharts = ({ dataset }: DraggableChartsProps) => {
  const { toast } = useToast();
  const [layout, setLayout] = useState<Layout[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultLayout;
  });

  console.log("dataset.summary", dataset.summary);
  const insight = dataset.summary.insight;
  const stats = dataset.summary.stats;
  // ✅ Prepare Chart Data
  const barData = Object.entries(stats.counts.Recommend || {}).map(
    ([key, value]) => ({ name: key, value })
  );

  const lineData = Object.entries(stats.averages || {}).map(([key, value]) => ({
    name: key,
    value,
  }));

  const pieData = Object.entries(stats.counts.UsageFrequency || {}).map(
    ([key, value]) => ({ name: key, value })
  );

  // ✅ Layout actions
  const saveLayout = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(layout));
    toast({
      title: "Layout saved",
      description: "Your dashboard layout has been saved.",
    });
  };

  const resetLayout = () => {
    setLayout(defaultLayout);
    localStorage.removeItem(STORAGE_KEY);
    toast({
      title: "Layout reset",
      description: "Dashboard restored to default layout.",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 justify-between">
        <section className="flex gap-2">
          <Button variant="outline" size="sm" onClick={saveLayout}>
            <Save className="mr-2 h-4 w-4" />
            Save Layout
          </Button>
          <Button variant="outline" size="sm" onClick={resetLayout}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </section>
        <section>
          <Button variant="accent" className="flex items-center gap-2">
            <Sparkles className="mr-2 h-4 w-4" />
            Generate AI Insight
          </Button>
        </section>
      </div>

      <ResponsiveGridLayout
        className="layout"
        layouts={{ lg: layout }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={80}
        onLayoutChange={(newLayout) => setLayout(newLayout)}
        draggableHandle=".drag-handle"
      >
        {/* Bar Chart */}
        <div key="bar">
          <Card className="p-6 shadow-card h-full">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-semibold">Recommendation Overview</h3>
              <GripVertical className="h-5 w-5 text-muted-foreground drag-handle cursor-move" />
            </div>
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill={COLORS[0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <div key="line">
          <Card className="p-6 shadow-card h-full">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-semibold">Averages Trend</h3>
              <GripVertical className="h-5 w-5 text-muted-foreground drag-handle cursor-move" />
            </div>
            <ResponsiveContainer width="100%" height="85%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={COLORS[1]}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <div key="pie">
          <Card className="p-6 shadow-card h-full">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-semibold">Usage Frequency</h3>
              <GripVertical className="h-5 w-5 text-muted-foreground drag-handle cursor-move" />
            </div>
            <ResponsiveContainer width="100%" height="85%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => entry.name}
                  outerRadius={80}
                  dataKey="value"
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <div key="summary">
          <Card className="p-6 shadow-card h-full  overflow-auto">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-semibold">Quick Stats Summary</h3>
              <GripVertical className="h-5 w-5 text-muted-foreground drag-handle cursor-move" />
            </div>
            <div className="space-y-4 ">
              <div className="p-4 bg-muted rounded-lg flex justify-between">
                <span className="text-sm text-muted-foreground">Male</span>
                <span className="text-lg font-semibold">
                  {stats.counts.Gender.Male}
                </span>
              </div>
              <div className="p-4 bg-muted rounded-lg flex justify-between">
                <span className="text-sm text-muted-foreground">Female</span>
                <span className="text-lg font-semibold">
                  {stats.counts.Gender.Female}
                </span>
              </div>
              <div className="p-4 bg-muted rounded-lg flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Recommended No
                </span>
                <span className="text-lg font-semibold">
                  {stats.counts.Recommend.No}
                </span>
              </div>
              <div className="p-4 bg-muted rounded-lg flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Recommended Yes
                </span>
                <span className="text-lg font-semibold">
                  {stats.counts.Recommend.Yes}
                </span>
              </div>
              <div className="p-4 bg-muted rounded-lg flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Daily Usage
                </span>
                <span className="text-lg font-semibold">
                  {stats.counts.UsageFrequency.Daily}
                </span>
              </div>
              <div className="p-4 bg-muted rounded-lg flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Weekly Usage
                </span>
                <span className="text-lg font-semibold">
                  {stats.counts.UsageFrequency.Weekly}
                </span>
              </div>
              <div className="p-4 bg-muted rounded-lg flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Monthly Usage
                </span>
                <span className="text-lg font-semibold">
                  {stats.counts.UsageFrequency.Monthly}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </ResponsiveGridLayout>
      <div key="insight">
        <Card className="p-6 shadow-card h-full overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-semibold flex items-center gap-x-3">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              AI Insight Summary{" "}
            </h3>
          </div>
          <p className="text-muted-foreground  leading-relaxed">{insight}</p>
        </Card>
      </div>
    </div>
  );
};
