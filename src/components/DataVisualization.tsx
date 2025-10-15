import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { DraggableCharts } from "@/components/DraggableCharts";
import { motion } from "framer-motion";

interface DataVisualizationProps {
  data: any[];
}

const COLORS = ['hsl(240, 60%, 45%)', 'hsl(180, 70%, 50%)', 'hsl(260, 70%, 55%)', 'hsl(200, 80%, 60%)'];

export const DataVisualization = ({ data }: DataVisualizationProps) => {
  if (data.length === 0) {
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

  // Prepare sample chart data from the uploaded data
  const chartData = data.slice(0, 10).map((row, index) => {
    const firstValue = Object.values(row)[1] as string;
    const numericValue = parseFloat(firstValue) || index + 1;
    return {
      name: Object.values(row)[0] as string || `Item ${index + 1}`,
      value: numericValue,
    };
  });

  const pieData = chartData.slice(0, 4);

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
            <DraggableCharts data={data} />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" style={{ display: 'none' }}>
            <Card className="p-6 shadow-card">
              <h3 className="text-xl font-semibold mb-4">Bar Chart Analysis</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="hsl(240, 60%, 45%)" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6 shadow-card">
              <h3 className="text-xl font-semibold mb-4">Trend Analysis</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="hsl(180, 70%, 50%)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6 shadow-card">
              <h3 className="text-xl font-semibold mb-4">Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
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

            <Card className="p-6 shadow-card">
              <h3 className="text-xl font-semibold mb-4">Data Summary</h3>
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

          {/* Data Table Preview */}
          <Card className="p-6 shadow-card overflow-x-auto">
            <h3 className="text-xl font-semibold mb-4">Data Preview</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    {Object.keys(data[0] || {}).map((key) => (
                      <th key={key} className="text-left p-3 font-semibold">
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.slice(0, 5).map((row, i) => (
                    <tr key={i} className="border-b hover:bg-muted/50">
                      {Object.values(row).map((value: any, j) => (
                        <td key={j} className="p-3">
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {data.length > 5 && (
              <p className="text-sm text-muted-foreground mt-4 text-center">
                Showing 5 of {data.length} rows
              </p>
            )}
          </Card>
        </div>
      </div>
    </section>
  );
};
