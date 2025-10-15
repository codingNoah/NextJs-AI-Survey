import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GripVertical, Save, RotateCcw } from "lucide-react";
import { Responsive, WidthProvider, Layout } from "react-grid-layout";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { useToast } from "@/hooks/use-toast";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const ResponsiveGridLayout = WidthProvider(Responsive);

const COLORS = ['hsl(240, 60%, 45%)', 'hsl(180, 70%, 50%)', 'hsl(260, 70%, 55%)', 'hsl(200, 80%, 60%)'];

interface DraggableChartsProps {
  data: any[];
}

const STORAGE_KEY = "dashboard-layout";

const defaultLayout: Layout[] = [
  { i: "bar", x: 0, y: 0, w: 6, h: 4 },
  { i: "line", x: 6, y: 0, w: 6, h: 4 },
  { i: "pie", x: 0, y: 4, w: 6, h: 4 },
  { i: "summary", x: 6, y: 4, w: 6, h: 4 },
];

export const DraggableCharts = ({ data }: DraggableChartsProps) => {
  const { toast } = useToast();
  const [layout, setLayout] = useState<Layout[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultLayout;
  });

  const chartData = data.slice(0, 10).map((row, index) => {
    const firstValue = Object.values(row)[1] as string;
    const numericValue = parseFloat(firstValue) || index + 1;
    return {
      name: Object.values(row)[0] as string || `Item ${index + 1}`,
      value: numericValue,
    };
  });

  const pieData = chartData.slice(0, 4);

  const saveLayout = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(layout));
    toast({
      title: "Layout saved",
      description: "Your dashboard layout has been saved",
    });
  };

  const resetLayout = () => {
    setLayout(defaultLayout);
    localStorage.removeItem(STORAGE_KEY);
    toast({
      title: "Layout reset",
      description: "Dashboard restored to default layout",
    });
  };

  const onLayoutChange = (newLayout: Layout[]) => {
    setLayout(newLayout);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 justify-end">
        <Button variant="outline" size="sm" onClick={saveLayout}>
          <Save className="mr-2 h-4 w-4" />
          Save Layout
        </Button>
        <Button variant="outline" size="sm" onClick={resetLayout}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset
        </Button>
      </div>

      <ResponsiveGridLayout
        className="layout"
        layouts={{ lg: layout }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={80}
        onLayoutChange={onLayoutChange}
        draggableHandle=".drag-handle"
      >
        <div key="bar">
          <Card className="p-6 shadow-card h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Bar Chart Analysis</h3>
              <GripVertical className="h-5 w-5 text-muted-foreground drag-handle cursor-move" />
            </div>
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="hsl(240, 60%, 45%)" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <div key="line">
          <Card className="p-6 shadow-card h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Trend Analysis</h3>
              <GripVertical className="h-5 w-5 text-muted-foreground drag-handle cursor-move" />
            </div>
            <ResponsiveContainer width="100%" height="85%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="hsl(180, 70%, 50%)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <div key="pie">
          <Card className="p-6 shadow-card h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Distribution</h3>
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
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <div key="summary">
          <Card className="p-6 shadow-card h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Data Summary</h3>
              <GripVertical className="h-5 w-5 text-muted-foreground drag-handle cursor-move" />
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-primary/5 rounded-lg">
                <p className="text-sm text-muted-foreground">Total Records</p>
                <p className="text-3xl font-bold text-primary">{data.length}</p>
              </div>
              <div className="p-4 bg-accent/5 rounded-lg">
                <p className="text-sm text-muted-foreground">Columns</p>
                <p className="text-3xl font-bold text-accent">
                  {Object.keys(data[0] || {}).length}
                </p>
              </div>
              <div className="p-4 bg-secondary rounded-lg">
                <p className="text-sm text-muted-foreground">Data Points</p>
                <p className="text-3xl font-bold">
                  {data.length * Object.keys(data[0] || {}).length}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </ResponsiveGridLayout>
    </div>
  );
};
