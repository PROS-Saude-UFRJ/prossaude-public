import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import FormColor from "./component";

describe("FormColor Block", () => {
  test("renders preview state", () => {
    render(<FormColor />);
    const video = screen.getByRole("video");
    expect(video).toBeInTheDocument();
  });

  test("renders non-preview state with input[type=color]", () => {
    render(<FormColor />);
    const colorInput = screen.getByTitle("Escolha a sua cor");
    expect(colorInput).toBeInTheDocument();
    expect(colorInput).toHaveAttribute("type", "color");
  });
});
