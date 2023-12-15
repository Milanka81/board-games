// import { rest } from "msw";

// export const fakeGames = [
//   {
//     game_id: 1,
//     name: "Monopoly",
//     added_date: "2023-01-09T23:00:00.000Z",
//     artist: "Edison Girard",
//     category: "Family",
//     designer: "Charles Darrow, Lizzie Magie",
//     game_length: 90,
//     max_players: 8,
//     min_players: 2,
//     year: 1935,
//     img: "/img/monopoly.png",
//   },
//   {
//     game_id: 2,
//     name: "Risk",
//     added_date: "2023-01-09T23:00:00.000Z",
//     artist: "uncredited",
//     category: "Strategy, War",
//     designer: "Albert Lamorisse, Michael Levin",
//     game_length: 120,
//     max_players: 6,
//     min_players: 2,
//     year: 1957,
//     img: "/img/risk.png",
//   },
// ];

// export const fakeUser = {
//   first_name: "John",
//   last_name: "Smith",
//   username: "john123",
//   email: "john123@gmail.com",
//   role: "user",
// };

export const handlers = [
  // rest.get("http://localhost:3001/games", (req, res, ctx) => {
  //   return res(ctx.status(200), ctx.json(fakeGames));
  // }),
  // rest.get("http://localhost:3001/games/favourite", (req, res, ctx) => {
  //   return res(ctx.status(200), ctx.json(fakeGames));
  // }),
  // rest.get("http://localhost:3001/profile", (req, res, ctx) => {
  //   return res(
  //     ctx.status(200),
  //     ctx.json({
  //       first_name: "John",
  //       last_name: "Smith",
  //       username: "john123",
  //       email: "john123@gmail.com",
  //       role: "user",
  //     })
  //   );
  // }),
  // rest.post("http://localhost:3001/login", (req, res, ctx) => {
  //   return res(
  //     ctx.status(200),
  //     ctx.json({
  //       username: "john123",
  //       email: "john123@gmail.com",
  //     })
  //   );
  // }),
  // rest.post("http://localhost:3001/forgot-password", (req, res, ctx) => {
  //   return res(
  //     ctx.status(200),
  //     ctx.json({ link: "http://localhost:3000/reset-password/7/1234567" })
  //   );
  // }),
  // rest.put(
  //   "http://localhost:3001/reset-password/:id/:token",
  //   (req, res, ctx) => {
  //     const { id, token } = req.params;
  //     const { password } = req.json();
  //     console.log("reset put");
  //     return res(ctx.status(200), ctx.json({ password: "changed" }));
  //   }
  // ),
  // rest.get("http://localhost:3001/games/:id", (req, res, ctx) => {
  //   const { id } = req.params;
  //   return res(ctx.status(200), ctx.json({ game: fakeGames[id] }));
  // }),
  // rest.get("http://localhost:3001/games/:id/like", (req, res, ctx) => {
  //   const { id } = req.params;
  //   if (id) {
  //     return res(ctx.status(200), ctx.json({ like: true }));
  //   }
  // }),
];
