import { screen, render } from "../test-utils/testing-library-utils";
import Account from "./Account";
import { fakeUser } from "../testData";

test("displays information about the user", async () => {
  render(<Account user={fakeUser} handleEdit={() => {}} />);

  const firstName = await screen.findByText("John");
  const lastName = await screen.findByText("Smith");
  const username = await screen.findByText("john123");
  const email = await screen.findByText("john123@gmail.com");
  const role = await screen.findByText("user");
  expect(firstName).toBeInTheDocument();
  expect(lastName).toBeInTheDocument();
  expect(username).toBeInTheDocument();
  expect(email).toBeInTheDocument();
  expect(role).toBeInTheDocument();
});
