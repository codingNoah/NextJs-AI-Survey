export interface DatasetSummary {
  insight: string;
  stats: {
    averages: { ResponseID: number; Age: number; Satisfaction: number };
    counts: {
      Gender: { Male: number; Female: number };
      Recommend: { Yes: number; No: number };
      UsageFrequency: { Daily: number; Weekly: number; Monthly: number };
    };
    correlations: Record<string, number>;
  };
}

export interface Dataset {
  id: string;
  filename: string;
  summary: DatasetSummary;
  createdAt: string;
  userId: string;
}

export interface DraggableChartsProps {
  dataset: Dataset;
}
