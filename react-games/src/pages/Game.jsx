import { useParams, useNavigate } from "react-router-dom";
import { TextField } from "@mui/material";
import { useEffect, useState } from "react";
import Rating from "../components/Rating";
import { useContext } from "react";
import { AuthContext } from "../App";
import Comment from "../components/Comment";
import { useTranslation } from "react-i18next";
import { numberPlayers, handleEmpty, imgSrc, alertMessage } from "../utils";
import style from "./ViewEditGame.module.css";
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
      ? `${t("game:favourited")} ❤️`
      : `${t("game:addtofavourites")} 🤍`;

  useEffect(() => {
    getGame(id)
      .then((res) => {
        setGame(res.data);
      })
      .catch((err) => alertMessage("error", err.message));
  }, [id]);

  useEffect(() => {
    getGameComments(id)
      .then((res) => setComments(res.data))
      .catch((err) => alertMessage("error", err.message));
  }, [id]);

  const refreshComments = () => {
    getGameComments(id)
      .then((res) => setComments(res.data))
      .catch((err) => alertMessage("error", err.message));
  };

  useEffect(() => {
    getGameLike(id)
      .then((res) => {
        if (!res.data.length) return setLiked(false);
        setLiked(true);
      })
      .catch((err) => alertMessage("error", err.message));
  }, [id]);

  useEffect(() => {
    getGameFavourite(id)
      .then((res) => {
        if (!res.data.length) return setFavourite(false);
        setFavourite(true);
      })
      .catch((err) => alertMessage("error", err.message));
  }, [id]);

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
          className={style.navBtn}
          onClick={() => {
            navigate("/games");
          }}
        >
          🎲 {t("home:games")}
        </button>
      ) : (
        <button
          className={style.navBtn}
          onClick={() => {
            navigate(-1);
          }}
        >
          ⬅️ {t("common:back")}
        </button>
      )}

      <div className={style.gameContainer}>
        <div className={style.gameInfo}>
          <img
            className={style.gameImg}
            src={imgSrc(game.img)}
            alt={game.name}
          />
          <div className={style.gameDetails}>
            <p className={style.gameDetailsName}>
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
            <div className={style.btnsContainer}>
              <button
                className={`${style.btnFormSubmit} ${style.red}`}
                type="button"
                onClick={() => navigate(-1)}
              >
                {t("common:back")}
              </button>
              <button
                className={`${style.btnFormSubmit} ${style.green}`}
                onClick={() => {
                  navigate(`/editGame/${game.game_id}`);
                }}
              >
                {t("common:edit")}
              </button>
            </div>
          )}
        </div>
        <div className={style.gameOpinions}>
          {!isAdmin && (
            <div className={style.btnsLikeFav}>
              <button className={style.likeFav} onClick={addToFavourites}>
                {btnFavName()}
              </button>

              <button className={style.likeFav} onClick={like}>
                {btnLikeName()}
              </button>
            </div>
          )}
          <Rating id={id} isAdmin={isAdmin} />
          {!isAdmin && (
            <form className={style.commentForm} onSubmit={(e) => addComment(e)}>
              <TextField
                value={comment}
                className={style.commentInput}
                onChange={handleChange}
                placeholder={t("game:addcomment")}
                multiline
                inputProps={{ maxLength: 300 }}
              />

              <button className={`${style.btn} ${style.green}`} type="submit">
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
