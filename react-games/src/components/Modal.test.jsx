import { screen, render } from "../test-utils/testing-library-utils";
import Modal from "./Modal";

jest.mock("react-dom", () => ({
  createPortal: (node, container) => {
    return node;
  },
}));

describe("Modal Component", () => {
  it("renders children inside modal portal", () => {
    render(<Modal>Test Modal Content</Modal>);
    const modal = screen.getByText("Test Modal Content");
    expect(modal).toBeInTheDocument();
  });

  test("appends modal container to document body", () => {
    render(<Modal>Test Modal Content</Modal>);
    expect(document.body).toHaveTextContent("Test Modal Content");
  });
});
