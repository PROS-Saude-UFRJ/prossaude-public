import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import FormCheck from "./component";
import { registerBlockType } from "@wordpress/blocks";
jest.mock("@wordpress/block-editor", () => ({
  useBlockProps: jest.fn(() => ({})),
}));
describe("FormCheck Block", () => {
  test("registers block with correct attributes", () => {
    const mockRegisterBlockType = jest.fn(registerBlockType);
    mockRegisterBlockType("bootstrap/check", {
      title: "Campo de Confirmação",
    });
    expect(mockRegisterBlockType).toHaveBeenCalledWith(
      "bootstrap/check",
      expect.objectContaining({
        title: "Campo de Confirmação",
        attributes: expect.objectContaining({
          preview: expect.any(Object),
        }),
      }),
    );
  });
  test("renders preview state", () => {
    render(<FormCheck />);
    const video = screen.getByRole("video");
    expect(video).toBeInTheDocument();
    expect(video).toHaveAttribute("src", expect.stringContaining("form_control.mp4"));
  });
  test("renders non-preview state with FormCheck component", () => {
    render(<FormCheck />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toHaveClass("form-check-input");
  });
});
