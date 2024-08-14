const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { uploads } = require("../utils/utils.js");
const usersController = require("../controllers/usersController.js");
const gamesController = require("../controllers/gamesController.js");
const auth = require("../middleware/auth.js");
router.get("/user", usersController.getUser);

router.get("/profile", auth.tokenVerify, usersController.getUserProfile);

router.get("/filteredUsers", usersController.getFilteredUsers);

router
  .route("/users")
  .get(usersController.getCountUsers)
  .put(usersController.editUser)
  .delete(usersController.deleteUser);

router.post("/addGame", uploads.single("img"), gamesController.addGame);

router.put("/editGame", uploads.single("img"), gamesController.editGame);

router.post("/register", authController.register);

router.post("/login", authController.login);

router.post("/forgot-password", authController.forgotPassword);

router.put("/reset-password/:id/:token", authController.resetPassword);

module.exports = router;
