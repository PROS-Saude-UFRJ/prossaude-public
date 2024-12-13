import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import FormDate from "./component";

describe("FormDate Block", () => {
  test("renders preview state", () => {
    render(<FormDate />);
    const video = screen.getByRole("video");
    expect(video).toBeInTheDocument();
  });

  test("renders non-preview state with input[type=date]", () => {
    render(<FormDate />);
    const dateInput = screen.getByPlaceholderText("Digite uma data aqui!");
    expect(dateInput).toBeInTheDocument();
    expect(dateInput).toHaveAttribute("type", "date");
  });
});
