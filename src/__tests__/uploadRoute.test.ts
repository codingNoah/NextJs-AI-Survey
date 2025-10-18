import request from "supertest";
import { POST } from "@/app/api/upload/route";

describe("POST /api/upload", () => {
  it("should reject missing file", async () => {
    const req = new Request("http://localhost/api/upload", {
      method: "POST",
      body: new FormData(), // empty form
    });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toContain("No file uploaded");
  });
});
