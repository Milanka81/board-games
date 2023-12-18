import { screen, render } from "../test-utils/testing-library-utils";
import Account from "./Account";
import { fakeUser } from "../testData";

test("displays information about the user", async () => {
  render(<Account user={fakeUser} handleEdit={() => {}} />);

  for (let key in fakeUser) {
    if (key === "user_id") continue;
    const value = fakeUser[key];
    const input = await screen.findByText(value);
    expect(input).toBeInTheDocument();
  }
});
