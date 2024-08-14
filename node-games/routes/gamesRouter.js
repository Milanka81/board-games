const express = require("express");
const router = express.Router();
const gamesController = require("../controllers/gamesController.js");
const auth = require("../middleware/auth.js");

router.get("/game/:id", gamesController.getGameById);

router.get("/filteredGames", gamesController.getFilteredGames);

router.get("/new", gamesController.getNewGames);

router.get("/favourite", auth.tokenVerify, gamesController.getFavouriteGames);
router.get("/mostLiked", gamesController.getMostLikedGames);

router.get(
  "/recommended",
  auth.tokenVerify,
  gamesController.getRecommendedGames
);

router.get(
  "/userPreferences",
  auth.tokenVerify,
  gamesController.getUserPreferences
);

router.get("/:id/avgRating", gamesController.getGameAvgRating);

router.get("/categories", gamesController.getGamesCategories);

router
  .route("/:id/like")
  .get(auth.tokenVerify, gamesController.getGameLike)
  .post(auth.tokenVerify, gamesController.postGameLike);

router
  .route("/subscribed")
  .get(auth.tokenVerify, gamesController.getSubscribed)
  .put(auth.tokenVerify, gamesController.editSubscribed);

router
  .route("/:id/favourite")
  .get(auth.tokenVerify, gamesController.getGameFavourite)
  .post(auth.tokenVerify, gamesController.postFavourite);
router
  .route("/:id/rating")
  .get(gamesController.getGameRating)
  .post(auth.tokenVerify, gamesController.postRating);
router
  .route("/:id/comment")
  .get(gamesController.getGameComments)
  .post(auth.tokenVerify, gamesController.postGameComment);

router
  .route("/preferences")
  .get(auth.tokenVerify, gamesController.getPreferences)
  .post(gamesController.postGamePreferences)
  .put(gamesController.editGamePreferences);

router.get(
  "/:id/mycomments",
  auth.tokenVerify,
  gamesController.getMyGameComments
);

router
  .route("/comment")
  .put(gamesController.editGameComment)
  .delete(gamesController.deleteGameComment);

router
  .route("/")
  .get(gamesController.getGamesCount)
  .delete(gamesController.deleteGame);

module.exports = router;
