import { PortfolioView } from "app/components/portfolio/view/PortfolioView";
import { notFound } from "next/navigation";
import { getPublicPortfolio } from "serverActions/portfolio/getPublicPortfolio";

type Params = Promise<{ slug: string }>;

// The page depends on who is looking (hidden portfolios), so it's never cached.
export const dynamic = "force-dynamic";

export default async function PublicPortfolioPage({ params }: { params: Params }) {
  const { slug } = await params;
  const portfolio = await getPublicPortfolio(slug);
  
  // An unknown address, or someone else's hidden portfolio.
  if (!portfolio) notFound();

  return <PortfolioView portfolio={portfolio} />;
}
