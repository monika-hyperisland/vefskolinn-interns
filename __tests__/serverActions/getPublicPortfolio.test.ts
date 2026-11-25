/**
 * @jest-environment node
 */

import {
  connect,
  clearDatabase,
  closeDatabase,
  createDummyUser,
} from "../__mocks__/mongoHandler";

import { auth } from "../../auth";
import { Portfolio } from "models/portfolio";
import { getPublicPortfolio } from "serverActions/portfolio/getPublicPortfolio";
import { mockPortfolioContent } from "utils/portfolio/mockPortfolio";

// Replace the real login function during tests
jest.mock("../../auth", () => ({
  auth: jest.fn(),
}));

const SLUG = "anna-jonsdottir";

/* Stores Anna's portfolio and returns its owner. */
const storePortfolio = async (visibility: "public" | "hidden") => {
  const owner = await createDummyUser();

  await Portfolio.create({
    studentId: owner._id,
    slug: SLUG,
    visibility,
    publishedAt: new Date("2026-11-05T12:00:00.000Z"),
    content: mockPortfolioContent,
  });

  return owner;
};

const signInAs = (id: string | null) =>
  (auth as jest.Mock).mockResolvedValue(id ? { user: { id } } : null);

describe("getPublicPortfolio", () => {
  beforeAll(async () => {
    await connect();
  });

  afterEach(async () => {
    await clearDatabase();
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  it("returns a public portfolio to a visitor who is not signed in", async () => {
    await storePortfolio("public");
    signInAs(null);

    const result = await getPublicPortfolio(SLUG);

    expect(result?.content.profile.name).toBe(mockPortfolioContent.profile.name);
  });

  it("returns only the content, no database ids", async () => {
    await storePortfolio("public");

    const result = await getPublicPortfolio(SLUG);

    expect(Object.keys(result ?? {})).toEqual(["content"]);
  });

  it("returns null for an unknown address", async () => {
    const result = await getPublicPortfolio("nobody-here");

    expect(result).toBeNull();
  });

  it("hides a hidden portfolio from visitors and other students", async () => {
    await storePortfolio("hidden");
    const otherStudent = await createDummyUser();

    signInAs(null);
    expect(await getPublicPortfolio(SLUG)).toBeNull();

    signInAs(otherStudent._id.toString());
    expect(await getPublicPortfolio(SLUG)).toBeNull();
  });

  it("shows a hidden portfolio to its owner", async () => {
    const owner = await storePortfolio("hidden");
    signInAs(owner._id.toString());

    const result = await getPublicPortfolio(SLUG);

    expect(result?.content.profile.name).toBe(mockPortfolioContent.profile.name);
  });

  it("finds the address in any letter case", async () => {
    await storePortfolio("public");

    const result = await getPublicPortfolio("Anna-Jonsdottir");

    expect(result).not.toBeNull();
  });
});
