import { screen, render } from "../test-utils/testing-library-utils";
import userEvent from "@testing-library/user-event";
import Comment from "./Comment";
import { fakeComments, localStorageAdmin, localStorageUser } from "../testData";
// jest.mock("../service", () => ({
//   editComment: jest.fn(),
//   deleteComment: jest.fn(),
//   postComment: jest.fn(),
// }));
describe("renders comment component", () => {
  const user = userEvent.setup();
  localStorageUser();
  test("renders placeholder image when there are no game id and comments", async () => {
    render(<Comment comments={[]} refetch={() => {}} gameId="" />);
    const image = await screen.findByRole("img");
    expect(image).toBeInTheDocument();
  });
  test("renders input field and submit button for role user and passed game id", async () => {
    render(<Comment comments={[]} refetch={() => {}} gameId="1" />);

    const input = await screen.findByRole("textbox");
    expect(input).toBeInTheDocument();
    const submitBtn = await screen.findByRole("button", { name: /submit/i });
    expect(submitBtn).toBeInTheDocument();
  });
  test("clears input after comment is added", async () => {
    render(<Comment comments={[]} refetch={() => {}} gameId="1" />);
    const commentText = screen.getByPlaceholderText(/addcomment/i);
    const btnSubmit = screen.getByRole("button", { name: /submit/ });
    expect(commentText).toBeInTheDocument();
    expect(btnSubmit).toBeInTheDocument();

    await user.click(btnSubmit);
    expect(commentText).toHaveValue("");
  });

  test("renders title, username, date, time and comment text", async () => {
    render(<Comment comments={fakeComments} refetch={() => {}} gameId="1" />);
    const heading = await screen.findByRole("heading", { name: /comments/i });
    const username = await screen.findAllByText("user89");
    const date = await screen.findByText("2023-09-17");
    const time = await screen.findByText("20:53");
    const comment = await screen.findByText(/love it/i);
    expect(heading).toBeInTheDocument();
    expect(username).toHaveLength(2);
    expect(date).toBeInTheDocument();
    expect(time).toBeInTheDocument();
    expect(comment).toBeInTheDocument();
  });
  test("renders edit and delete buttons for two logged user's comments", async () => {
    render(<Comment comments={fakeComments} refetch={() => {}} gameId="" />);
    const editButton = await screen.findAllByRole("button", { name: /edit/i });
    expect(editButton).toHaveLength(2);
    const deleteButton = await screen.findAllByRole("button", {
      name: /delete/i,
    });
    expect(deleteButton).toHaveLength(2);
  });
});

describe("comment component for admin role", () => {
  localStorageAdmin();

  test("renders edit and delete buttons for each comment if admin is signed", async () => {
    render(<Comment comments={fakeComments} refetch={() => {}} gameId="1" />);
    const editButton = await screen.findAllByRole("button", { name: /edit/i });
    expect(editButton).toHaveLength(3);
    const deleteButton = await screen.findAllByRole("button", {
      name: /delete/i,
    });
    expect(deleteButton).toHaveLength(3);
  });

  test("desn't render input field and submit button if admin is signed", () => {
    render(<Comment comments={[]} refetch={() => {}} gameId="1" />);

    const input = screen.queryByRole("textbox");
    expect(input).not.toBeInTheDocument();
    const submitBtn = screen.queryByRole("button", { name: /submit/i });
    expect(submitBtn).not.toBeInTheDocument();
  });
  test("renders placeholder image if admin is signed and there are no game id", async () => {
    render(<Comment comments={[]} refetch={() => {}} gameId="" />);
    const image = await screen.findByRole("img");
    expect(image).toBeInTheDocument();
  });
});
