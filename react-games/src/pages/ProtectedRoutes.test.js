import { screen, render } from "../test-utils/testing-library-utils";
import App from "../App";

const table = [
  { pathname: "Profile", routePath: "/profile", expected: /login/i },
];
test.each(table)(
  "redirect to login",
  async ({ pathname, routePath, expected }) => {
    render(<App />);
    const heading = await screen.findByText(expected);
    expect(heading).toBeInTheDocument();
    // expect(routePath).toBe("/");
  }
);
