// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
import { server } from "./__mocks__/server";
import { queryClient } from "./test-utils/testing-library-utils";

beforeAll(() => {
  server.listen();
});
afterEach(() => {
  server.resetHandlers();
  queryClient.clear();
});
afterAll(() => {
  server.close();
});
export { server };
