const connection = require("../database/db");
const jwt = require("jsonwebtoken");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + "." + file.originalname);
  },
});
const uploads = multer({ storage: storage });

// const userId = (req) => {
//   if (req.headers.jwt) {
//     const token = req.headers.jwt;
//     const verify = jwt.verify(token, process.env.JWT_SECRET);
//     const userId = verify.id;

//     return userId;
//   }
// };

const executeQuery = (res, sql, values) => {
  try {
    connection.query(sql, values, (err, data) => {
      if (err) {
        throw err;
      }

      res.send(data);
    });
  } catch (error) {
    res.send(error);
  }
};

const queryImgBase64 = (res, sql) => {
  try {
    connection.query(sql, (err, data) => {
      if (err) {
        throw err;
      }

      data[0].img ? (data[0].img = data[0].img.toString("base64")) : "";
      res.send(data[0]);
    });
  } catch (error) {
    res.send(error);
  }
};

const executeQueryImgBase64Array = (res, sql) => {
  connection.query(sql, (err, data) => {
    if (err) {
      throw err;
    }

    data.forEach((el) =>
      el.img ? (el.img = el.img.toString("base64")) : el.img
    );
    res.send(data);
  });
};

const conditionalQueries = (res, sqlSelect, sqlEdit, sqlInsert, values) => {
  try {
    connection.query(sqlSelect, (err, data) => {
      if (err) {
        throw err;
      }

      if (data.length) {
        executeQuery(res, sqlEdit, values);
      } else {
        executeQuery(res, sqlInsert, values);
      }
    });
  } catch (error) {
    console.log(error.message);
  }
};

const throwError = (err, connection) => {
  if (err) {
    return connection.rollback(() => {
      throw err;
    });
  }
};

const queryInsertIntoGameTableThrowError = (table, game_id, id) => {
  const sql = `INSERT INTO game_${table} (game_id, ${table}_id) VALUES (${game_id}, ${id})`;
  connection.query(sql, (err, data) => {
    throwError(err, connection);
  });
};
const queryInsertIntoPreferenceTableThrowError = (table, user_id, id) => {
  const sql = `INSERT INTO preference_${table} (user_id, ${table}_id) VALUES (${user_id}, ${id})`;
  connection.query(sql, (err, data) => {
    throwError(err, connection);
  });
};

const queryDeleteInsert = (table, game_id, id) => {
  const sqlDelete = `DELETE FROM game_${table} WHERE game_id = ${game_id} `;
  connection.query(sqlDelete, (err, data) => {
    throwError(err, connection);

    queryInsertIntoGameTableThrowError(table, game_id, id);
  });
};
const queryDeleteInsertPreferences = (table, user_id, id) => {
  const sqlDelete = `DELETE FROM preference_${table} WHERE user_id = ${user_id} `;
  connection.query(sqlDelete, (err, data) => {
    throwError(err, connection);

    queryInsertIntoPreferenceTableThrowError(table, user_id, id);
  });
};

const doubleInsertThrowError = (table, game_id, value) => {
  const queryInsertTable = `INSERT INTO ${table} (${table}_name) VALUES (?)`;
  connection.query(queryInsertTable, value, (err, data) => {
    throwError(err, connection);

    const id = data.insertId;
    const queryInsertGameTable = `INSERT INTO game_${table} (game_id, ${table}_id) VALUES (${game_id}, ${id})`;
    connection.query(queryInsertGameTable, (err, data) => {
      throwError(err, connection);
    });
  });
};
const doubleInsertPreferencesThrowError = (table, user_id, value) => {
  const queryInsertTable = `INSERT INTO ${table} (${table}_name) VALUES (?)`;
  connection.query(queryInsertTable, value, (err, data) => {
    throwError(err, connection);

    const id = data.insertId;
    const queryInsertPreferenceTable = `INSERT INTO preference_${table} (user_id, ${table}_id) VALUES (${user_id}, ${id})`;
    connection.query(queryInsertPreferenceTable, (err, data) => {
      throwError(err, connection);
    });
  });
};

const insertIntoTwoTables = (tableValues, table, game_id) => {
  if (tableValues) {
    const arr = tableValues.split(",");

    for (let i = 0; i < arr.length; i++) {
      const value = arr[i].trim();
      const checkIfExistsQuery = `SELECT ${table}_id as id FROM ${table} WHERE ${table}_name = ?`;
      connection.query(checkIfExistsQuery, value, (err, data) => {
        throwError(err, connection);

        if (data.length > 0) {
          const id = data[0].id;
          queryInsertIntoGameTableThrowError(table, game_id, id);
        } else {
          doubleInsertThrowError(table, game_id, value);
        }
      });
    }
  }
};
const updateTwoTables = (tableValues, table, game_id) => {
  if (tableValues) {
    const arr = tableValues.split(",");

    for (let i = 0; i < arr.length; i++) {
      const value = arr[i].trim();

      const checkIfExistsQuery = `SELECT ${table}_name as name, ${table}_id as id FROM ${table} WHERE ${table}_name = ?`;
      connection.query(checkIfExistsQuery, value, (err, data) => {
        throwError(err, connection);

        if (data.length) {
          const id = data[0].id;

          queryDeleteInsert(table, game_id, id);
        } else {
          doubleInsertThrowError(table, game_id, value);
        }
      });
    }
  } else {
    const sqlDelete = `DELETE FROM game_${table} WHERE game_id = ${game_id} `;
    connection.query(sqlDelete, (err, data) => {
      throwError(err, connection);
    });
  }
};
const updateTwoTablesPreferences = (tableValues, table, user_id) => {
  if (tableValues) {
    const arr = tableValues.split(",");

    for (let i = 0; i < arr.length; i++) {
      const value = arr[i].trim();

      const checkIfExistsQuery = `SELECT ${table}_name as name, ${table}_id as id FROM ${table} WHERE ${table}_name = ?`;
      connection.query(checkIfExistsQuery, value, (err, data) => {
        throwError(err, connection);

        if (data.length) {
          const id = data[0].id;

          queryDeleteInsertPreferences(table, user_id, id);
        } else {
          doubleInsertPreferencesThrowError(table, user_id, value);
        }
      });
    }
  } else {
    const sqlDelete = `DELETE FROM preference_${table} WHERE user_id = ${user_id} `;
    connection.query(sqlDelete, (err, data) => {
      throwError(err, connection);
    });
  }
};

const artistDesignerCategory = (
  res,
  artist,
  designer,
  category,
  sql,
  newValues,
  game_id
) => {
  connection.query(sql, newValues, (err, data) => {
    throwError(err, connection);

    const artistName = "artist";
    updateTwoTables(artist, artistName, game_id);

    const designerName = "designer";
    updateTwoTables(designer, designerName, game_id);

    const categoryName = "category";
    updateTwoTables(category, categoryName, game_id);

    connection.commit((err) => {
      throwError(err, connection);

      res.send(data);
    });
  });
};
const artistDesignerCategoryPreferences = (
  res,
  artist,
  designer,
  categories,
  sql,
  newValues,
  user_id
) => {
  connection.query(sql, newValues, (err, data) => {
    throwError(err, connection);

    const artistName = "artist";
    updateTwoTablesPreferences(artist, artistName, user_id);

    const designerName = "designer";
    updateTwoTablesPreferences(designer, designerName, user_id);

    const categoryName = "category";
    updateTwoTablesPreferences(categories, categoryName, user_id);

    connection.commit((err) => {
      throwError(err, connection);

      res.send(data);
    });
  });
};

const insertTableAndPreferenceTable = (table, user_id, value) => {
  const queryInsertTable = `INSERT INTO ${table} (${table}_name) VALUES (?)`;
  connection.query(queryInsertTable, value, (err, data) => {
    throwError(err, connection);

    const id = data.insertId;
    const queryInsertGameTable = `INSERT INTO preference_${table} (user_id, ${table}_id) VALUES (${user_id}, ${id})`;
    connection.query(queryInsertGameTable, (err, data) => {
      throwError(err, connection);
    });
  });
};

const queryInsertIntoPreferenceTable = (table, user_id, id) => {
  const sql = `INSERT INTO preference_${table} (user_id, ${table}_id) VALUES (${user_id}, ${id})`;
  connection.query(sql, (err, data) => {
    throwError(err, connection);
  });
};
const insertPreferencesTwoTables = (tableValues, table, user_id) => {
  if (tableValues) {
    const arr = tableValues.split(",");

    for (let i = 0; i < arr.length; i++) {
      const value = arr[i].trim();
      const sql = `SELECT ${table}_id as id FROM ${table} WHERE ${table}_name = ?`;
      connection.query(sql, value, (err, data) => {
        throwError(err, connection);
        if (data.length > 0) {
          const id = data[0].id;
          queryInsertIntoPreferenceTable(table, user_id, id);
        } else {
          insertTableAndPreferenceTable(table, user_id, value);
        }
      });
    }
  }
};

module.exports = {
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
};
