import { render, screen, waitFor } from "@testing-library/react";
import UserProfilePanelWrapper from "../../../../components/interactive/panel/UserProfilePanelWrapper";
import { createRoot } from "react-dom/client";
import { elementNotFound } from "../../../../global/handlers/errorHandler";
import { RootCtx } from "../../../../../pages/_app";

const mockUserRoot = { render: jest.fn() };

jest.mock("react-dom/client", () => ({
  createRoot: jest.fn(() => mockUserRoot),
}));

jest.mock("../../../../global/handlers/errorHandler", () => ({
  elementNotFound: jest.fn(),
}));

describe("UserProfilePanelWrapper Component", () => {
  const mockContext = { roots: { userRoot: null } };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render UserProfilePanel", () => {
    render(
      <RootCtx.Provider value={mockContext}>
        <UserProfilePanelWrapper />
      </RootCtx.Provider>,
    );
    expect(screen.getByText("UserProfilePanel")).toBeInTheDocument();
  });

  it("creates root and renders UserProfilePanel", () => {
    document.body.innerHTML = '<div id="rootUserInfo"></div>';
    render(
      <RootCtx.Provider value={mockContext}>
        <UserProfilePanelWrapper />
      </RootCtx.Provider>,
    );
    expect(createRoot).toHaveBeenCalledWith(document.getElementById("rootUserInfo"));
    expect(mockUserRoot.render).toHaveBeenCalledWith(expect.anything());
  });

  it("renders GenericErrorComponent if element not found", async () => {
    render(
      <RootCtx.Provider value={mockContext}>
        <UserProfilePanelWrapper />
      </RootCtx.Provider>,
    );
    await waitFor(() => expect(elementNotFound).toHaveBeenCalled(), { timeout: 2000 });
    expect(screen.getByText("GenericErrorComponent")).toBeInTheDocument();
  });
});
