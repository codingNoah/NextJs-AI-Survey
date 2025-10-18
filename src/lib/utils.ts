import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import OpenAI from "openai";

export interface DatasetStats {
  averages: Record<string, number>;
  counts: Record<string, Record<string, number>>;
  correlations?: Record<string, number>;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateQuestions = async (title: string, prompt: string) => {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
    });

    const systemPrompt = `
    You are a survey question generator. Given a survey title and context,
    return 5 thoughtful, concise, user-friendly questions as a numbered list.
    Return them as plain text, one question per line.
  `;
    const userPrompt = `Survey Title: ${title}\nDescription: ${prompt}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    const text = completion.choices[0]?.message?.content || "";
    const questions = text
      .split("\n")
      .map((q) => q.replace(/^\d+\.\s*/, "").trim())
      .filter((q) => q.length > 0);

    console.log("questions", questions);
    return questions;
  } catch (error) {
    return [
      `What is your overall satisfaction with 'the product'?`,
      `How likely are you to recommend this to other?`,
      `What improvements would you suggest for 'the service'?`,
      `How would you rate the 'quality'} on a scale of 1-1?`,
      `What features do you value most about 'this offering'?`,
    ];
  }
};

export const generateDataSetInsight = async (
  data: Array<Record<string, any>> = [],
  stats: DatasetStats
) => {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
    });

    const formattedData = JSON.stringify(data.slice(0, 15), null, 2);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a data analyst summarizing uploaded datasets. Provide a short, clear summary with key trends and anomalies.",
        },
        {
          role: "user",
          content: `Here is a dataset sample and computed statistics:
  Dataset sample:
  ${formattedData}
  
  Computed stats:
  ${JSON.stringify(stats, null, 2)}
  
  Summarize the main insights in 3–4 sentences.`,
        },
      ],
      max_tokens: 250,
    });

    const aiInsight = completion.choices[0].message.content;
    return aiInsight;
  } catch (error) {
    return "Failed to generate AI insight.";
  }
};

export const computeDatasetStats = (
  data: Array<Record<string, any>> = []
): DatasetStats => {
  const stats: DatasetStats = {
    averages: {},
    counts: {},
  };

  if (!data.length) return stats;

  const sample = data[0];
  const keys = Object.keys(sample);

  const numericFields = keys.filter((k) =>
    data.some((row) => !isNaN(parseFloat(row[k])))
  );

  const categoricalFields = keys.filter((k) => !numericFields.includes(k));

  for (const field of numericFields) {
    const values = data
      .map((d) => parseFloat(d[field]))
      .filter((v) => !isNaN(v));
    if (values.length > 0) {
      stats.averages[field] =
        values.reduce((sum, val) => sum + val, 0) / values.length;
    }
  }

  for (const field of categoricalFields) {
    const counts: Record<string, number> = {};
    for (const d of data) {
      const val = d[field] || "Unknown";
      counts[val] = (counts[val] || 0) + 1;
    }
    stats.counts[field] = counts;
  }

  if (numericFields.length >= 2) {
    const [xKey, yKey] = numericFields;
    const x = data.map((d) => parseFloat(d[xKey])).filter((v) => !isNaN(v));
    const y = data.map((d) => parseFloat(d[yKey])).filter((v) => !isNaN(v));

    if (x.length === y.length && x.length > 2) {
      const meanX = x.reduce((a, b) => a + b, 0) / x.length;
      const meanY = y.reduce((a, b) => a + b, 0) / y.length;

      const numerator = x
        .map((_, i) => (x[i] - meanX) * (y[i] - meanY))
        .reduce((a, b) => a + b, 0);
      const denominator = Math.sqrt(
        x.map((xi) => (xi - meanX) ** 2).reduce((a, b) => a + b, 0) *
          y.map((yi) => (yi - meanY) ** 2).reduce((a, b) => a + b, 0)
      );

      stats.correlations = {
        [`${xKey} vs ${yKey}`]: parseFloat(
          (numerator / denominator).toFixed(2)
        ),
      };
    }
  }

  return stats;
};
