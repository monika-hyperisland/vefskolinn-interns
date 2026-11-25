import { mockLocalDraft } from "../../app/utils/portfolio/mockPortfolio";
import { fireEvent, render, screen } from "@testing-library/react";
import PortfolioBuilderPage from "../../app/LMS/portfolio/page";

jest.mock("serverActions/portfolio/getMyPortfolio", () => ({
  getMyPortfolio: jest.fn().mockResolvedValue({
    success: true,
    data: null,
  }),
}));

jest.mock("serverActions/portfolio/getPortfolioStudentId", () => ({
  getPortfolioStudentId: jest.fn().mockResolvedValue("test-student"),
}));

jest.mock("serverActions/portfolio/getPortfolioAvatar", () => ({
  getPortfolioAvatar: jest.fn().mockResolvedValue(null),
}));

describe("Portfolio Builder shell", () => {
  test("updates the live preview and retains profile edits across steps", async () => {
    localStorage.clear();
    render(<PortfolioBuilderPage />);
    await screen.findByText("Not published yet");
    fireEvent.change(screen.getByLabelText("Role / headline"), { target: { value: "My live headline" } });
    expect(screen.getByText("My live headline")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Projects" }));
    fireEvent.click(screen.getByRole("button", { name: "Profile" }));
    expect(screen.getByLabelText("Role / headline")).toHaveValue("My live headline");
  });

  beforeEach(() => {
    window.localStorage.clear();
  });

  test("shows four steps and starts on Profile", async () => {
    render(<PortfolioBuilderPage />);

    await screen.findByText("Not published yet");
    expect(screen.getByRole("navigation", { name: "Portfolio builder steps" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Tell your story" })).toBeInTheDocument();
    expect(screen.getByText("Step 1 of 4")).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
  });

  test("switches to each placeholder step", async () => {
    render(<PortfolioBuilderPage />);
    await screen.findByText("Not published yet");

    fireEvent.click(screen.getByRole("button", { name: "Projects" }));
    expect(screen.getByRole("heading", { name: "Choose your best work" })).toBeInTheDocument();
    expect(screen.getByText("Project selection will go here.")).toBeInTheDocument();
    expect(screen.getByText("Step 2 of 4")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Theme" }));
    expect(screen.getByRole("heading", { name: "Pick a look" })).toBeInTheDocument();
    expect(screen.getByRole("radiogroup", { name: "Portfolio theme" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /minimal/i })).toBeChecked();
    expect(screen.getByRole("radio", { name: /editorial/i })).not.toBeChecked();
    expect(screen.getByRole("radio", { name: /studio/i })).not.toBeChecked();
    expect(screen.getByText("White, high contrast")).toBeInTheDocument();
    expect(screen.getByText("Soft grey")).toBeInTheDocument();
    expect(screen.getByText("Dark, high contrast")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("radio", { name: /studio/i }));
    expect(screen.getByRole("radio", { name: /studio/i })).toBeChecked();
    expect(screen.getByRole("button", { name: "Selected Studio" })).toBeDisabled();
    expect(screen.getByText("Step 3 of 4")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Contact" }));
    expect(screen.getByRole("heading", { name: "Help them reach you" })).toBeInTheDocument();
    expect(screen.getByLabelText(/Email \(optional\)/)).toBeInTheDocument();
    expect(screen.getByText("Step 4 of 4")).toBeInTheDocument();
  });

  test("renders the real PortfolioView and switches device widths", async () => {
    localStorage.setItem("portfolio-draft:test-student", JSON.stringify({ ...mockLocalDraft, basedOn: null, content: { ...mockLocalDraft.content, theme: "minimal", projects: [{ ...mockLocalDraft.content.projects[0], title: "My saved project" }] } }));
    const { container } = render(<PortfolioBuilderPage />);
    await screen.findByText("Not published yet");

    expect(screen.getByText("My saved project")).toBeInTheDocument();
    expect(screen.queryByText("Sample data until your draft is connected")).not.toBeInTheDocument();

    const desktop = screen.getByRole("button", { name: "Desktop" });
    const mobile = screen.getByRole("button", { name: "Mobile" });

    expect(desktop).toHaveAttribute("aria-pressed", "true");
    expect(mobile).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(mobile);
    expect(mobile).toHaveAttribute("aria-pressed", "true");
    expect(container.querySelector('[data-device="mobile"]')).toBeInTheDocument();

    fireEvent.click(desktop);
    expect(desktop).toHaveAttribute("aria-pressed", "true");
    expect(container.querySelector('[data-device="desktop"]')).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Selected Minimal" })).toBeDisabled();
  });

  test("shows Not published yet when no portfolio exists", async () => {
    render(<PortfolioBuilderPage />);
    expect(await screen.findByText("Not published yet")).toBeInTheDocument();
  });
});
