const express = require("express");
const router = express.Router();
const connection = require("../database/db");
const authController = require("../controllers/authController");
const nodemailer = require("nodemailer");
const session = require("express-session");
const fs = require("fs");

const {
  executeQuery,
  conditionalQueries,
  insertIntoTwoTables,
  insertPreferencesTwoTables,
  throwError,
  uploads,
  queryImgBase64,
  executeQueryImgBase64Array,
  artistDesignerCategory,
  artistDesignerCategoryPreferences,
} = require("../utils/utils.js");

router.get("/users", (req, res) => {
  const sql = "SELECT count(*) as count FROM user";
  executeQuery(res, sql);
});

router.get("/profile", authController.tokenVerify, (req, res) => {
  const user_id = req.userId;
  const sql = `SELECT * FROM user WHERE user_id = ${user_id}`;
  executeQuery(res, sql);
});

router.get("/user", (req, res) => {
  const user_id = req.query.userId;
  const sql = `SELECT * FROM user WHERE user_id = ${user_id}`;
  executeQuery(res, sql);
});

router.delete("/users", (req, res) => {
  const sql = `DELETE FROM user WHERE user_id = ${req.body.id}`;
  executeQuery(res, sql);
});
router.delete("/games", (req, res) => {
  const sql = `DELETE FROM game WHERE game_id = ${req.body.id}`;
  executeQuery(res, sql);
});
router.delete("/games/comment", (req, res) => {
  const id = req.body.id;

  const sql = `DELETE FROM comment WHERE comment_id = ${id} `;
  executeQuery(res, sql);
});

router.put("/users", (req, res) => {
  const {
    firstName: first_name,
    lastName: last_name,
    username,
    email,
    role,
  } = req.body.values;
  const id = req.body.id;

  connection.query(
    `SELECT * FROM user WHERE email = ?`,
    [email],
    (err, result) => {
      if (err) {
        throw err;
      }
      if (!result[0] || result[0].user_id === id) {
        const sql = `UPDATE user SET ? WHERE user_id = ${id}`;
        const values = {
          first_name,
          last_name,
          username,
          email,
          role,
        };
        executeQuery(res, sql, values);
      } else {
        res.send({
          error: true,
          icon: "error",
          message: "Email is already in use",
        });
      }
    }
  );
});

router.post("/addGame", uploads.single("img"), (req, res) => {
  const image = req.file.path;
  const photoBuffer = fs.readFileSync(`${image}`);

  connection.beginTransaction((err) => {
    if (err) throw err;

    const {
      name,
      minPlayers: min_players,
      maxPlayers: max_players,
      year,
      artist,
      designer,
      category,
      gameLength: game_length,
    } = req.body;

    const sql =
      "INSERT INTO game (name, added_date, min_players, max_players, year, game_length, img) VALUES (?, current_timestamp(), ?,?,?,?,?) ";
    const values = [
      [name],
      [min_players],
      [max_players],
      [year],
      [game_length],
      [photoBuffer],
    ];

    connection.query(sql, values, (err, data) => {
      throwError(err, connection);

      if (data.insertId) {
        const game_id = data.insertId;

        const artistName = "artist";
        insertIntoTwoTables(artist, artistName, game_id);

        const designerName = "designer";
        insertIntoTwoTables(designer, designerName, game_id);

        const categoryName = "category";
        insertIntoTwoTables(category, categoryName, game_id);
      }

      const sqlSubsc = `SELECT up.*, email, first_name FROM userPreferences up
      LEFT JOIN user u ON up.user_id = u.user_id
      WHERE subscribed = true GROUP BY up.user_id`;

      connection.query(sqlSubsc, (err, data) => {
        if (err) {
          throw err;
        }

        for (let i = 0; i < data.length; i++) {
          const first_name = data[i].first_name;
          const email = data[i].email;
          const numberOfPlayers = data[i].number_players;
          const gameLengthFrom = data[i].game_length_from;
          const gameLengthTo = data[i].game_length_to;
          const preferenceArtist = data[i].artist;
          const preferenceDesigner = data[i].designer;
          const preferenceCategory = data[i].category;

          const valuesMatched = (arr1, arr2) => {
            if (arr1 && arr2) {
              for (let i = 0; i < arr1.length; i++) {
                if (arr2.includes(arr1[i])) return 1;
              }
            }
            return 0;
          };

          if (
            (min_players < numberOfPlayers && max_players > numberOfPlayers) ||
            (game_length > gameLengthFrom && game_length < gameLengthTo) ||
            valuesMatched(preferenceArtist, artist) ||
            valuesMatched(preferenceDesigner, designer) ||
            valuesMatched(preferenceCategory, category)
          ) {
            const transporter = nodemailer.createTransport({
              service: "hotmail",
              auth: {
                user: "mnarancic1910@hotmail.com",
                pass: "Testnodemailer",
              },
            });

            const options = {
              from: {
                name: "Board Games App",
                address: "mnarancic1910@hotmail.com",
              },
              to: email,
              subject: "New Game added!",
              html: `<h3>Hello ${first_name} !</h3>
              <h3>
              New game that matches your preferences is added! Check out <em>"${name}"</em> game on our website!
               </h3>`,
            };

            transporter.sendMail(options, (err, info) => {
              if (err) throw err;
              console.log("send to", info.response);
            });
          }
        }
      });

      connection.commit((err) => {
        throwError(err, connection);

        res.send(data);
      });
    });
  });
});

router.put("/editGame", uploads.single("img"), (req, res) => {
  if (req.file) {
    connection.beginTransaction((err) => {
      if (err) throw err;

      const image = req.file.path;
      const photoBuffer = fs.readFileSync(`${image}`);
      const { values } = req.body;
      const {
        name,
        minPlayers: min_players,
        maxPlayers: max_players,
        year,
        gameLength: game_length,
        artist,
        designer,
        category,
      } = JSON.parse(values);
      const img = photoBuffer;
      const sql = `UPDATE game SET ? WHERE game_id = ${req.body.id} `;
      const newValues = {
        name,
        min_players,
        max_players,
        year,
        img,
        game_length,
      };

      const game_id = req.body.id;
      artistDesignerCategory(
        res,
        artist,
        designer,
        category,
        sql,
        newValues,
        game_id
      );
    });
  } else {
    connection.beginTransaction((err) => {
      if (err) throw err;
      const {
        name,
        minPlayers: min_players,
        maxPlayers: max_players,
        year,
        gameLength: game_length,
        artist,
        designer,
        category,
      } = req.body;

      const sql = `UPDATE game SET ? WHERE game_id = ${req.body.id} `;
      const newValues = {
        name,
        min_players,
        max_players,
        year,
        game_length,
      };
      const game_id = req.body.id;
      artistDesignerCategory(
        res,
        artist,
        designer,
        category,
        sql,
        newValues,
        game_id
      );
    });
  }
});
router.get("/games/:id/comments", (req, res) => {
  const sql = `SELECT comment.*, user.username as username FROM comment 
               LEFT JOIN user ON user.user_id = comment.user_id 
               WHERE comment.game_id = ${req.params.id} ORDER BY comment.comm_date DESC;`;
  executeQuery(res, sql);
});

router.get("/games/comments", authController.tokenVerify, (req, res) => {
  const user_id = req.userId;

  const sql = `SELECT comment_id, user_id, comm, comm_date, game.name as game FROM comment
               LEFT JOIN game ON game.game_id = comment.game_id
               WHERE user_id = ${user_id} ORDER BY comment.comm_date DESC;`;
  executeQuery(res, sql);
});

router.put("/games/comment", (req, res) => {
  const { comment: comm, comment_id } = req.body;

  const sql = `UPDATE comment SET comm = ? WHERE comment_id = ? `;
  const values = [[comm.slice(0, 299)], [comment_id]];
  executeQuery(res, sql, values);
});

router.get("/games/:id/like", authController.tokenVerify, (req, res) => {
  const user_id = req.userId;
  const sql = `SELECT l.user_id FROM likes as l
               WHERE l.game_id = ${req.params.id} AND l.user_id = ${user_id}`;

  executeQuery(res, sql);
});

router.get("/games/:id/favourite", authController.tokenVerify, (req, res) => {
  const user_id = req.userId;
  const sql = `SELECT f.user_id FROM favourites as f
               WHERE f.game_id = ${req.params.id} AND f.user_id = ${user_id}`;

  executeQuery(res, sql);
});

router.get("/games/:id/rating", (req, res) => {
  const sql = `SELECT user_id, user_rate FROM rating WHERE
                game_id = ${req.params.id};`;

  executeQuery(res, sql);
});

router.get("/games/:id/avgRating", (req, res) => {
  const sql = `SELECT AVG(user_rate) as avg FROM rating WHERE game_id =${req.params.id} `;
  executeQuery(res, sql);
});

router.get("/games", (req, res) => {
  const sql = "SELECT COUNT(*) AS count FROM gameInfo";
  executeQueryImgBase64Array(res, sql);
});
router.get("/games/categories", (req, res) => {
  const sql = "SELECT * FROM category";
  executeQuery(res, sql);
});

router.get("/filteredGames", (req, res) => {
  const { page, limit, input, sortBy } = req.query;
  const offset = (page - 1) * (limit || 0);
  let sql = `SELECT * FROM gameInfo WHERE name LIKE "%${input}%" 
               OR artist LIKE "%${input}%" 
               OR designer LIKE "%${input}%" 
               OR category LIKE "%${input}%"
               ORDER BY ${sortBy} 
               `;
  if (limit) {
    sql += ` LIMIT ${limit} OFFSET ${offset}`;
  }
  executeQueryImgBase64Array(res, sql);
});

router.get("/filteredUsers", (req, res) => {
  const { page, limit, input, sortBy } = req.query;
  const offset = (page - 1) * limit;
  const sql = `SELECT user_id, first_name, last_name, username, email, role FROM user WHERE first_name LIKE "${input}%"
               OR last_name LIKE "${input}%"
               OR username LIKE "${input}%"
               OR email LIKE "${input}%"
               ORDER BY ${sortBy}
               LIMIT ${limit} OFFSET ${offset}
               `;
  executeQuery(res, sql);
});

router.get("/games/favourite", authController.tokenVerify, (req, res) => {
  const user_id = req.userId;
  const sql = `SELECT * FROM game as g
  LEFT JOIN favourites as f ON f.game_id = g.game_id
  LEFT JOIN user as u ON u.user_id = f.user_id
  WHERE u.user_id = ${user_id} 
  LIMIT 5`;
  executeQueryImgBase64Array(res, sql);
});

router.get("/games/mostLiked", (req, res) => {
  const sql = `SELECT g.game_id, name, min_players, max_players, year, img, game_length, COUNT(l.game_id) as most_liked
  FROM likes as l
  LEFT JOIN game as g ON g.game_id = l.game_id
  GROUP BY name, min_players, max_players, year, game_length, g.game_id
  ORDER BY most_liked DESC
  LIMIT 5`;
  executeQueryImgBase64Array(res, sql);
});

router.get("/games/recommended", authController.tokenVerify, (req, res) => {
  const user_id = req.userId;
  const preferencesSql = `SELECT p.*, p.user_id, GROUP_CONCAT(DISTINCT pd.designer_id SEPARATOR ', ') AS designer, GROUP_CONCAT(DISTINCT pa.artist_id SEPARATOR ', ') AS artist, GROUP_CONCAT(DISTINCT pc.category_id SEPARATOR ', ') AS category FROM preferences p 
  LEFT JOIN preference_artist pa ON p.user_id = pa.user_id
  LEFT JOIN preference_designer pd ON p.user_id = pd.user_id
  LEFT JOIN preference_category pc ON p.user_id = pc.user_id
  WHERE p.user_id = ${user_id} GROUP BY p.user_id`;

  try {
    connection.query(preferencesSql, (err, data) => {
      if (err) {
        throw err;
      }

      if (data[0]) {
        const numberOfPlayers = data[0].number_players;
        const gameLengthFrom = data[0].game_length_from;
        const gameLengthTo = data[0].game_length_to;
        const preferenceArtist = data[0].artist;
        const preferenceDesigner = data[0].designer;
        const preferenceCategory = data[0].category;

        const sql = `SELECT
      g.game_id AS game_id,
      g.name AS name,
      g.added_date AS added_date,
      g.min_players AS min_players,
      g.max_players AS max_players,
      g.year AS year,
      g.img AS img,
      g.game_length AS game_length,
      GROUP_CONCAT(DISTINCT d.designer_name SEPARATOR ', ') AS designer,
      GROUP_CONCAT(DISTINCT a.artist_name SEPARATOR ', ') AS artist,
      GROUP_CONCAT(DISTINCT c.category_name SEPARATOR ', ') AS category,
      COUNT(DISTINCT matches.match_id) AS count
  FROM game g
      LEFT JOIN game_designer gd ON gd.game_id = g.game_id
      LEFT JOIN designer d ON d.designer_id = gd.designer_id
      LEFT JOIN game_artist ga ON ga.game_id = g.game_id
      LEFT JOIN artist a ON a.artist_id = ga.artist_id
      LEFT JOIN game_category gc ON gc.game_id = g.game_id
      LEFT JOIN category c ON c.category_id = gc.category_id
      LEFT JOIN (
          SELECT game_id, CONCAT('players_', game_id) AS match_id FROM game WHERE min_players <= ${numberOfPlayers} AND max_players >= ${numberOfPlayers}
          UNION ALL
          SELECT game_id, CONCAT('length_', game_id) AS match_id FROM game WHERE game_length >= ${gameLengthFrom} AND game_length <= ${gameLengthTo}
          UNION ALL
          SELECT ga.game_id, CONCAT('artist_', ga.artist_id) AS match_id FROM game_artist ga WHERE ga.artist_id IN (${preferenceArtist})
          UNION ALL
          SELECT gd.game_id, CONCAT('designer_', gd.designer_id) AS match_id FROM game_designer gd WHERE gd.designer_id IN (${preferenceDesigner})
          UNION ALL
          SELECT gc.game_id, CONCAT('category_', gc.category_id) AS match_id FROM game_category gc WHERE gc.category_id IN (${preferenceCategory})
      ) AS matches ON matches.game_id = g.game_id
  WHERE g.min_players <= ${numberOfPlayers} AND g.max_players >= ${numberOfPlayers}
      OR g.game_length >= ${gameLengthFrom} AND g.game_length <= ${gameLengthTo}
      OR a.artist_id IN (${preferenceArtist})
      OR d.designer_id IN (${preferenceDesigner})
      OR c.category_id IN (${preferenceCategory})
  GROUP BY g.game_id
  ORDER BY count DESC;`;

        executeQueryImgBase64Array(res, sql);
      }
    });
  } catch (error) {
    res.send(error);
  }
});
router.get("/games/preferences", authController.tokenVerify, (req, res) => {
  const user_id = req.userId;
  const sql = `SELECT * FROM userPreferences WHERE user_id =  ${user_id}`;
  executeQuery(res, sql);
});
router.get("/games/userPreferences", authController.tokenVerify, (req, res) => {
  const user_id = req.userId;
  const sql = `SELECT 1 FROM userPreferences WHERE user_id =  ${user_id}`;
  executeQuery(res, sql);
});

router.get("/games/new", (req, res) => {
  const sql = `SELECT game_id, name, min_players, max_players, year, img, game_length, added_date
  FROM game as g
  ORDER BY g.added_date DESC
  LIMIT 5;`;
  executeQueryImgBase64Array(res, sql);
});

router.post("/games/:id/like", authController.tokenVerify, (req, res) => {
  const user_id = req.userId;
  const sqlSelect = `SELECT 1 FROM likes WHERE user_id = ${user_id} AND game_id = ${req.params.id} `;
  const sqlEdit = `DELETE FROM likes WHERE user_id = ${user_id} AND game_id = ${req.params.id}`;
  const sqlInsert = `INSERT INTO likes VALUES (?, ${req.params.id} )`;
  const values = [user_id];
  conditionalQueries(res, sqlSelect, sqlEdit, sqlInsert, values);
});

router.get("/games/subscribed", authController.tokenVerify, (req, res) => {
  const user_id = req.userId;
  const sql = `SELECT subscribed FROM preferences WHERE user_id =  ${user_id}`;
  executeQuery(res, sql);
});

router.put("/games/subscribed", authController.tokenVerify, (req, res) => {
  const user_id = req.userId;
  const sqlEdit = `UPDATE preferences SET subscribed = NOT subscribed WHERE user_id = ${user_id}`;
  executeQuery(res, sqlEdit);
});

router.post("/games/:id/favourite", authController.tokenVerify, (req, res) => {
  const user_id = req.userId;
  const sqlSelect = `SELECT 1 FROM favourites WHERE user_id = ${user_id} AND game_id = ${req.params.id} `;
  const sqlEdit = `DELETE FROM favourites WHERE user_id = ${user_id} AND game_id = ${req.params.id}`;
  const sqlInsert = `INSERT INTO favourites VALUES (?, ${req.params.id}, current_timestamp())`;
  const values = [user_id];
  conditionalQueries(res, sqlSelect, sqlEdit, sqlInsert, values);
});

router.post("/games/:id/rating", authController.tokenVerify, (req, res) => {
  const user_id = req.userId;
  const { id: game_id, rating: user_rate } = req.body;
  const sqlSelect = `SELECT 1 FROM rating WHERE user_id = ${user_id} AND game_id = ${game_id}`;
  const sqlEdit = `UPDATE rating SET user_rate = ${user_rate} WHERE user_id = ${user_id} AND game_id = ${game_id}`;
  const sqlInsert = `INSERT INTO rating (user_id, game_id, user_rate, rating_date) VALUES (?, ?, ?, current_timestamp())  `;
  const values = [[user_id], [game_id], [user_rate]];
  conditionalQueries(res, sqlSelect, sqlEdit, sqlInsert, values);
});

router.post("/games/:id/comment", authController.tokenVerify, (req, res) => {
  const user_id = req.userId;
  const { id: game_id, comment: comm } = req.body;
  const sql = `INSERT INTO comment (user_id, game_id,comm, comm_date) VALUES (?, ?, ?, current_timestamp())  `;
  const values = [[user_id], [game_id], [comm]];
  executeQuery(res, sql, values);
});
router.get("/games/:id", (req, res) => {
  const game_id = req.params.id;
  const sql = `SELECT * FROM gameInfo WHERE game_id = ${game_id}`;

  queryImgBase64(res, sql);

  // const {name, added_date, max_players, min_players, year, game_length} = data[0]

  // const designer = [...new Set(data.map(el => el.designer_name))]

  // const artist = [...new Set(data.map(el=> el.artist_name))]

  // const category = [...new Set(data.map(el=> el.ctg_name))]

  // let gameObj = {name, designer, category, artist,  added_date, min_players, max_players, year, game_length};
});

router.post("/games/preferences", (req, res) => {
  connection.beginTransaction((err) => {
    if (err) throw err;

    let {
      numberOfPlayers: number_players,
      gameLengthFrom: game_length_from,
      gameLengthTo: game_length_to,
      artist,
      designer,
      category,
    } = req.body.values;

    const user_id = req.body.user_id;

    let categories;
    if (category.length) {
      categories = [...req.body.selectedCategories, category].toString();
    } else {
      categories = [...req.body.selectedCategories].toString();
    }
    if (!number_players) number_players = null;
    if (!game_length_from) game_length_from = null;
    if (!game_length_to) game_length_to = null;

    const sql =
      "INSERT INTO preferences (user_id, number_players, game_length_from, game_length_to) VALUES (?, ?, ?, ?)";
    const values = [
      [user_id],
      [number_players],
      [game_length_from],
      [game_length_to],
    ];

    connection.query(sql, values, (err, data) => {
      throwError(err, connection);

      const artistName = "artist";
      insertPreferencesTwoTables(artist, artistName, user_id);

      const designerName = "designer";
      insertPreferencesTwoTables(designer, designerName, user_id);

      const categoryName = "category";
      insertPreferencesTwoTables(categories, categoryName, user_id);

      connection.commit((err) => {
        throwError(err, connection);

        res.send(data);
      });
    });
  });
});
router.put("/games/preferences", (req, res) => {
  connection.beginTransaction((err) => {
    if (err) throw err;
    let {
      numberOfPlayers: number_players,
      gameLengthFrom: game_length_from,
      gameLengthTo: game_length_to,
      artist,
      designer,
      category,
    } = req.body.values;
    const user_id = req.body.user_id;

    if (!number_players) number_players = null;
    if (!game_length_from) game_length_from = null;
    if (!game_length_to) game_length_to = null;

    let categories;
    if (category.length) {
      categories = [...req.body.selectedCategories, category].toString();
    } else {
      categories = [...req.body.selectedCategories].toString();
    }
    const sql = `UPDATE preferences SET ? WHERE user_id = ${user_id}`;
    const values = {
      number_players,
      game_length_from,
      game_length_to,
    };
    connection.query(sql, values, (err, data) => {
      throwError(err, connection);
      artistDesignerCategoryPreferences(
        res,
        artist,
        designer,
        categories,
        sql,
        values,
        user_id
      );
      connection.commit((err) => {
        throwError(err, connection);
      });
    });
  });
});

router.post("/register", authController.register);

// router.get("/login", (req, res) => {
//   if (req.session.userId) {
//     res.send({ loggedIn: true, user: req.session.userId });
//   } else {
//     res.send({ loggedIn: false });
//   }
// });
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.put("/reset-password/:id/:token", authController.resetPassword);

module.exports = router;
