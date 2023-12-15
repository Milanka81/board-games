import { setupServer } from "msw/node";
import { rest } from "msw";

export const createServer = (handlerConfig) => {
  const handlers = handlerConfig.map((config) => {
    return rest[config.method || "get"](config.path, (req, res, ctx) => {
      return res(ctx.json(config.res(req, res, ctx)));
    });
  });
  const server = setupServer(...handlers);

  beforeAll(() => {
    server.listen();
  });
  afterEach(() => {
    server.resetHandlers();
  });
  afterAll(() => {
    server.close();
  });
};

createServer([
  {
    path: "http://localhost:3001/games",
    method: "get",
    res: (req, res, ctx) => {
      return [{}, {}];
    },
  },
]);
