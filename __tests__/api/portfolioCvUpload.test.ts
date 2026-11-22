/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";
import { handleUpload } from "@vercel/blob/client";
import { auth } from "../../auth";
import { POST, CV_MAX_UPLOAD_BYTES } from "app/api/portfolio/cv/route";

jest.mock("../../auth", () => ({ auth: jest.fn() }));
jest.mock("@vercel/blob/client", () => ({ handleUpload: jest.fn() }));

const uploadRequest = () =>
  new NextRequest("http://localhost/api/portfolio/cv", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });

describe("POST /api/portfolio/cv", () => {
  beforeEach(() => jest.clearAllMocks());

  it("requires an authenticated user", async () => {
    (auth as jest.Mock).mockResolvedValue(null);

    const response = await POST(uploadRequest());

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ error: "Unauthorized" });
    expect(handleUpload).not.toHaveBeenCalled();
  });

  it("issues a user-scoped PDF upload token capped at 5 MB", async () => {
    (auth as jest.Mock).mockResolvedValue({ user: { id: "student-123" } });
    (handleUpload as jest.Mock).mockResolvedValue({ url: "https://blob.example/cv.pdf" });

    const response = await POST(uploadRequest());

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ url: "https://blob.example/cv.pdf" });
    expect(handleUpload).toHaveBeenCalledTimes(1);

    const options = (handleUpload as jest.Mock).mock.calls[0][0];
    const token = await options.onBeforeGenerateToken("portfolio-cv/student-123/cv.pdf");

    expect(token).toMatchObject({
      allowedContentTypes: ["application/pdf"],
      maximumSizeInBytes: 5 * 1024 * 1024,
      addRandomSuffix: true,
      tokenPayload: JSON.stringify({ userId: "student-123" }),
    });
    await expect(options.onBeforeGenerateToken("other/file.pdf")).rejects.toThrow(
      "Invalid CV upload path"
    );
    expect(CV_MAX_UPLOAD_BYTES).toBe(5 * 1024 * 1024);
  });

  it("returns a safe error when Blob rejects the upload request", async () => {
    (auth as jest.Mock).mockResolvedValue({ user: { id: "student-123" } });
    (handleUpload as jest.Mock).mockRejectedValue(new Error("private blob details"));

    const response = await POST(uploadRequest());

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: "CV upload failed" });
  });

  it("rejects malformed request JSON", async () => {
    (auth as jest.Mock).mockResolvedValue({ user: { id: "student-123" } });
    const request = new NextRequest("http://localhost/api/portfolio/cv", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{",
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: "Invalid upload request" });
    expect(handleUpload).not.toHaveBeenCalled();
  });
});
