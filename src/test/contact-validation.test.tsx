import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import { ContactSection } from "../routes/index";

vi.mock("@/components/site", () => ({
  Reveal: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Scene3D: () => null,
}));
vi.mock("@/components/ui/dropdown-menu", () => ({
  AnimatedDropdownMenu: () => <input type="hidden" name="service" value="" />,
}));

afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

describe("contact validation", () => {
  it("shows required field errors and blocks the request", () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    render(<ContactSection />);
    fireEvent.click(screen.getByRole("button", { name: /send enquiry/i }));
    expect(screen.getByText("Please enter your name.")).toBeInTheDocument();
    expect(screen.getByText("Please enter your email address.")).toBeInTheDocument();
    expect(screen.getByLabelText("Your name (required)")).toHaveFocus();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects whitespace names and invalid email addresses", () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    render(<ContactSection />);
    fireEvent.change(screen.getByLabelText("Your name (required)"), { target: { value: "   " } });
    fireEvent.change(screen.getByLabelText("Email (required)"), { target: { value: "invalid" } });
    fireEvent.click(screen.getByRole("button", { name: /send enquiry/i }));
    expect(screen.getByText("Please enter your name.")).toBeInTheDocument();
    expect(screen.getByText("Please enter a valid email address.")).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("shows the full-screen logo loader while a valid enquiry is pending", () => {
    vi.stubGlobal("fetch", vi.fn(() => new Promise(() => {})));
    render(<ContactSection />);
    fireEvent.change(screen.getByLabelText("Your name (required)"), { target: { value: "Alex" } });
    fireEvent.change(screen.getByLabelText("Email (required)"), { target: { value: "alex@example.com" } });
    fireEvent.change(screen.getByLabelText("Tell us about your project"), { target: { value: "A new website" } });
    fireEvent.click(screen.getByRole("button", { name: /send enquiry/i }));
    expect(screen.getByRole("status")).toHaveTextContent("Sending enquiry");
    expect(screen.getByRole("status")).toHaveClass("fixed", "inset-0");
  });
});
