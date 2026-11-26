import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { upload } from "@vercel/blob/client";
import ContactStep from "../../app/LMS/portfolio/steps/ContactStep";

jest.mock("@vercel/blob/client", () => ({ upload: jest.fn() }));

describe("Contact step", () => {
  beforeEach(() => jest.clearAllMocks());

  test("has optional email, LinkedIn, GitHub and CV fields", () => {
    render(<ContactStep />);

    const email = screen.getByRole("textbox", { name: /Email/ }) as HTMLInputElement;
    const linkedin = screen.getByRole("textbox", { name: "LinkedIn" }) as HTMLInputElement;
    const github = screen.getByRole("textbox", { name: "GitHub" }) as HTMLInputElement;
    const cv = screen.getByLabelText("Upload CV") as HTMLInputElement;

    expect(email.type).toBe("email");
    expect(email.required).toBe(false);
    expect(email.type).toBe("email");
    expect(linkedin.type).toBe("url");
    expect(github.type).toBe("url");
    expect(cv.type).toBe("file");
    expect(cv.accept).toContain("application/pdf");
    expect(email.value).toBe("");
  });

  test("allows students to enter and change their contact links", () => {
    render(<ContactStep />);
    const email = screen.getByRole("textbox", { name: /Email/ }) as HTMLInputElement;
    const linkedin = screen.getByRole("textbox", { name: "LinkedIn" }) as HTMLInputElement;
    const github = screen.getByRole("textbox", { name: "GitHub" }) as HTMLInputElement;

    fireEvent.change(email, { target: { value: "student@example.com" } });
    fireEvent.change(linkedin, { target: { value: "https://www.linkedin.com/in/student" } });
    fireEvent.change(github, { target: { value: "https://github.com/student" } });

    expect(email.value).toBe("student@example.com");
    expect(linkedin.value).toBe("https://www.linkedin.com/in/student");
    expect(github.value).toBe("https://github.com/student");


    fireEvent.change(email, { target: { value: "" } });
    expect(email.value).toBe("");
  });

  test("uploads a PDF CV through the authenticated CV endpoint", async () => {
    (upload as jest.Mock).mockResolvedValue({ url: "https://blob.example/student-cv.pdf" });
    const updateContact = jest.fn();
    render(<ContactStep updateContact={updateContact} />);

    const file = new File(["pdf"], "student-cv.pdf", { type: "application/pdf" });
    fireEvent.change(screen.getByLabelText("Upload CV"), { target: { files: [file] } });

    await waitFor(() => expect(upload).toHaveBeenCalledTimes(1));
    expect(upload).toHaveBeenCalledWith(
      expect.stringMatching(/^portfolio-cv\/.+\.pdf$/),
      file,
      {
        access: "public",
        handleUploadUrl: "/api/portfolio/cv",
        contentType: "application/pdf",
      }
    );
    expect(await screen.findByRole("link", { name: "student-cv.pdf" })).toHaveAttribute(
      "href",
      "https://blob.example/student-cv.pdf"
    );
    expect(screen.getByText("3 B · uploaded")).toBeInTheDocument();

    expect(updateContact).toHaveBeenCalledWith({ cvUrl: "https://blob.example/student-cv.pdf" });
    fireEvent.click(screen.getByRole("button", { name: "Remove" }));
    expect(updateContact).toHaveBeenLastCalledWith({ cvUrl: "" });
    expect(screen.queryByRole("link", { name: "student-cv.pdf" })).not.toBeInTheDocument();
  });

  test("rejects non-PDF files before uploading", async () => {
    render(<ContactStep />);
    const file = new File(["not a pdf"], "notes.txt", { type: "text/plain" });
    fireEvent.change(screen.getByLabelText("Upload CV"), { target: { files: [file] } });

    expect(await screen.findByRole("alert")).toHaveTextContent("Please choose a PDF file.");
    expect(upload).not.toHaveBeenCalled();
  });

  test("rejects files larger than 5 MB before uploading", async () => {
    render(<ContactStep />);
    const file = new File([new Uint8Array(5 * 1024 * 1024 + 1)], "large.pdf", {
      type: "application/pdf",
    });
    fireEvent.change(screen.getByLabelText("Upload CV"), { target: { files: [file] } });

    expect(await screen.findByRole("alert")).toHaveTextContent("Your CV must be 5 MB or smaller.");
    expect(upload).not.toHaveBeenCalled();
  });
});
