import { screen, render } from "../test-utils/testing-library-utils";
import Loader from "./Loader";

describe("renders loader component", () => {
  test("renders loader when fetching data", async () => {
    render(<Loader isLoading={true} children={<h2>Some component</h2>} />);
    const spinner = await screen.findByText("🎲");
    const loading = await screen.findByRole("heading", { name: /loading/i });
    expect(spinner).toBeInTheDocument();
    expect(loading).toBeInTheDocument();
  });
  test("doesn't render loader when data is fatched", () => {
    render(<Loader isLoading={false} children={<h2>Some component</h2>} />);
    const component = screen.getByRole("heading", { name: /some component/i });
    expect(component).toBeInTheDocument();
    // screen.logTestingPlaygroundURL();
  });
});
