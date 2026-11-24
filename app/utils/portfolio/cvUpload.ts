import { upload } from "@vercel/blob/client";

export const CV_MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
export const CV_CONTENT_TYPE = "application/pdf";
export const CV_UPLOAD_ENDPOINT = "/api/portfolio/cv";

export async function uploadCv(file: File): Promise<string> {
  if (file.type !== CV_CONTENT_TYPE) throw new Error("Please choose a PDF file.");
  if (file.size > CV_MAX_UPLOAD_BYTES) throw new Error("Your CV must be 5 MB or smaller.");
  const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const pathname = safeFileName.toLowerCase().endsWith(".pdf") ? safeFileName : safeFileName + ".pdf";
  const result = await upload("portfolio-cv/" + pathname, file, {
    access: "public",
    handleUploadUrl: CV_UPLOAD_ENDPOINT,
    contentType: CV_CONTENT_TYPE,
  });
  return result.url;
}
