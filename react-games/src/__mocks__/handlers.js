import { rest } from "msw";

export const handlers = [
  rest.get("http://localhost:3001/games/1", (req, res, ctx) => {
    return res(
      ctx.json([
        {
          game_id: 1,
          name: "Monopoly",
          added_date: "2023-01-09T23:00:00.000Z",
          artist: "Edison Girard",
          category: "Family",
          designer: "Charles Darrow, Lizzie Magie",
          game_length: 90,
          max_players: 8,
          min_players: 2,
          year: 1935,
          img: "/img/monopoly.png",
        },
      ])
    );
  }),
];
