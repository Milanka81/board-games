import { screen, render } from "../test-utils/testing-library-utils";
import PageNotFound from "./PageNotFound";

test("renders 404 page", () => {
  render(<PageNotFound />);
  const error = screen.getByRole("heading", { name: "404" });
  const notFound = screen.getByRole("heading", { name: /pagenotfound/i });
  expect(error).toBeInTheDocument();
  expect(notFound).toBeInTheDocument();
});
