import { screen, render } from "../test-utils/testing-library-utils";
import Account from "./Account";
import { fakeUser } from "../testData";

test("displays information about the user", async () => {
  render(<Account user={fakeUser} handleEdit={() => {}} />);

  for (let key in fakeUser) {
    const value = fakeUser[key];
    const element = await screen.findByText(value);

    expect(element).toBeInTheDocument();
  }
});
