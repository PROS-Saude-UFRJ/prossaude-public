import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import FormControl from "./component";

describe("FormControl Block", () => {
  test("renders preview state", () => {
    render(<FormControl />);
    const video = screen.getByRole("video");
    expect(video).toBeInTheDocument();
  });

  test("renders non-preview state with input[type=text]", () => {
    render(<FormControl />);
    const textInput = screen.getByPlaceholderText("Digite algo aqui!");
    expect(textInput).toBeInTheDocument();
    expect(textInput).toHaveAttribute("type", "text");
  });

  test("ensures IDs are unique", () => {
    render(<FormControl />);
    const input = screen.getByRole("textbox");
    const id = input.getAttribute("id");
    expect(id).toBeTruthy();
  });
});
