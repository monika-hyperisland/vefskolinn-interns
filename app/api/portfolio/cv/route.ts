import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { auth } from "../../../../auth";

export const CV_MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const CV_CONTENT_TYPE = "application/pdf";

/**
 * Issues a short-lived, user-scoped token for uploading a portfolio CV.
 * The file goes directly from the browser to Blob storage; the server only
 * authorizes a PDF up to 5 MB. The resulting public URL is saved as contact.cvUrl.
 */
export async function POST(request: Request): Promise<NextResponse> {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: HandleUploadBody;
  try {
    body = (await request.json()) as HandleUploadBody;
  } catch {
    return NextResponse.json({ error: "Invalid upload request" }, { status: 400 });
  }

  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!pathname.startsWith("portfolio-cv/")) {
          throw new Error("Invalid CV upload path");
        }

        return {
          allowedContentTypes: [CV_CONTENT_TYPE],
          maximumSizeInBytes: CV_MAX_UPLOAD_BYTES,
          addRandomSuffix: true,
          cacheControlMaxAge: 60 * 60 * 24 * 365,
          tokenPayload: JSON.stringify({ userId: session.user.id }),
        };
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Portfolio CV upload error:", error);
    return NextResponse.json({ error: "CV upload failed" }, { status: 400 });
  }
}
