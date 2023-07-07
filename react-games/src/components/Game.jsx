import { useParams, useNavigate } from "react-router-dom";
import { TextField } from "@mui/material";
import { useEffect, useState } from "react";
import "../css/UserHomePage.css";
import "../css/Game.css";
import Rating from "./Rating";
import { useContext } from "react";
import { AuthContext } from "../App";
import Comment from "./Comment";
import { useTranslation } from "react-i18next";
import { numberPlayers, handleEmpty, imgSrc, alertMessage } from "../utils";
import {
  getGameComments,
  getGame,
  getGameLike,
  getGameFavourite,
  postLike,
  postFavourite,
  postComment,
} from "../service";

const Game = () => {
  let { id } = useParams();
  const { t } = useTranslation(["game", "common", "home"]);
  const { admin } = useContext(AuthContext);
  const [isAdmin] = admin;
  const [game, setGame] = useState({});
  const navigate = useNavigate();
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [liked, setLiked] = useState(false);
  const [favourite, setFavourite] = useState(false);

  const btnLikeName = () =>
    liked ? `${t("game:liked")} 👍` : `${t("game:like")} 👍🏻`;
  const btnFavName = () =>
    favourite
      ? `${t("game:addtofavourites")} 🤍`
      : `${t("game:favourited")} ❤️`;

  useEffect(() => {
    getGame(id)
      .then((res) => {
        setGame(res.data);
      })
      .catch((err) => console.log(err));
  }, [id]);

  useEffect(() => {
    getGameComments(id)
      .then((res) => setComments(res.data))
      .catch((err) => console.log(err));
  }, [id]);
  const refreshComments = () => {
    getGameComments(id)
      .then((res) => setComments(res.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getGameLike(id)
      .then((res) => {
        if (!res.data.length) return setLiked(false);
        setLiked(true);
      })
      .catch((err) => console.log(err));
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    getGameFavourite(id)
      .then((res) => {
        if (!res.data.length) return setFavourite(false);
        setFavourite(true);
      })
      .catch((err) => console.log(err));

    // eslint-disable-next-line
  }, []);

  const handleChange = (e) => {
    setComment(e.target.value);
  };

  const like = () => {
    postLike(id)
      .then(() => setLiked(!liked))
      .catch((err) => alertMessage("error", err.message));
  };

  const addToFavourites = () => {
    postFavourite(id)
      .then(() => setFavourite(!favourite))
      .catch((err) => alertMessage("error", err.message));
  };

  const addComment = (e) => {
    e.preventDefault();
    if (!comment) return alertMessage("warning", "Add your comment!");
    postComment(id, comment)
      .then((res) => {
        setComment("");
        refreshComments();
      })
      .catch((err) => alertMessage("error", err.message));
  };

  return (
    <>
      {isAdmin ? (
        <button
          className="icon-btn navigation-btn"
          onClick={() => {
            navigate("/games");
          }}
        >
          🎲 {t("home:games")}
        </button>
      ) : (
        <button
          className="icon-btn navigation-btn"
          onClick={() => {
            navigate(-1);
          }}
        >
          ⬅️ {t("common:back")}
        </button>
      )}

      <div className="game-container">
        <div className="game-info">
          <img className="game-img1" src={imgSrc(game.img)} alt={game.name} />
          <div className="game-details">
            <p className="game-details-name">
              <strong>{handleEmpty(game.name)}</strong>
            </p>
            <p>
              {t("game:year")}: <strong>{handleEmpty(game.year)}</strong>
            </p>
            <p>
              {t("game:numberofplayers")}:
              <strong>
                {numberPlayers(
                  handleEmpty(game.min_players),
                  handleEmpty(game.max_players)
                )}
              </strong>
            </p>
            <p>
              {t("game:playingtime")}:
              <strong>{handleEmpty(game.game_length)}</strong>
            </p>
            <p>
              {t("game:designer")}:{" "}
              <strong>{handleEmpty(game.designer)}</strong>
            </p>
            <p>
              {t("game:artist")}: <strong>{handleEmpty(game.artist)}</strong>
            </p>
            <p>
              {t("game:category")}:{" "}
              <strong>{handleEmpty(game.category)}</strong>
            </p>
          </div>
          {isAdmin && (
            <div className="btns-container">
              <button
                className="btn-form-submit cancel"
                type="button"
                onClick={() => navigate(-1)}
              >
                {t("common:back")}
              </button>
              <button
                className="btn-form-submit save"
                onClick={() => {
                  navigate(`/editGame/${game.game_id}`);
                }}
              >
                {t("common:edit")}
              </button>
            </div>
          )}
        </div>
        <div className="game-opinions">
          {!isAdmin && (
            <div className="btns-like-fav">
              <button className="like-fav" onClick={addToFavourites}>
                {btnFavName()}
              </button>

              <button className="like-fav" onClick={like}>
                {btnLikeName()}
              </button>
            </div>
          )}
          <Rating id={id} isAdmin={isAdmin} />
          {!isAdmin && (
            <form className="comment-form" onSubmit={(e) => addComment(e)}>
              <TextField
                value={comment}
                className="comment-input"
                onChange={handleChange}
                placeholder={t("game:addcomment")}
                multiline
                inputProps={{ maxLength: 300 }}
              />

              <button className="btn game-btn save" type="submit">
                {t("common:submit")}
              </button>
            </form>
          )}

          <Comment
            refreshComments={refreshComments}
            comments={comments}
            isAdmin={isAdmin}
          />
        </div>
      </div>
    </>
  );
};
export default Game;
