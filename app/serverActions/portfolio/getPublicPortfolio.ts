// Deliberately not "use server": read by the server page only,
// an action would let any browser call it directly.
import { Types } from "mongoose";
import { Portfolio } from "models/portfolio";
import { auth } from "../../../auth";
import type { PortfolioContent, PublicPortfolio } from "types/portfolioTypes";

/**
 * The portfolio at /portfolio/<slug>, or null.
 * A hidden portfolio is returned only to its owner.
 */
export async function getPublicPortfolio(slug: string): Promise<PublicPortfolio | null> {
  try {
    const portfolio = await Portfolio.findOne({ slug: slug.toLowerCase() })
      .select("content visibility studentId")
      .lean<{ content: PortfolioContent; visibility: "public" | "hidden"; studentId: Types.ObjectId } | null>();

    if (!portfolio) return null;

    if (portfolio.visibility === "hidden") {
      const session = await auth();
      const isOwner = session?.user?.id === portfolio.studentId.toString();
      if (!isOwner) return null;
    }

    return { content: portfolio.content };
  } catch (error) {
    console.error("[getPublicPortfolio]", error);
    return null;
  }
}
