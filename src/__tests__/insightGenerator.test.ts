import { generateDataSetInsight } from "@/lib/utils";

jest.mock("openai", () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: jest.fn().mockResolvedValue({
            choices: [
              {
                message: {
                  content: "Mocked AI insight summary about dataset trends.",
                },
              },
            ],
          }),
        },
      },
    })),
  };
});

describe("AI Insight Generator", () => {
  it("should generate a summary for dataset array", async () => {
    const mockData = [
      { Age: 28, Satisfaction: 7 },
      { Age: 35, Satisfaction: 8 },
    ];

    const result = await generateDataSetInsight(mockData);

    expect(typeof result).toBe("string");
    expect(result).toContain("Mocked AI insight");
  });
});
