import { useParams, useNavigate } from "react-router-dom";
import { TextField } from "@mui/material";
import { useEffect, useState, useCallback } from "react";
import Rating from "../components/Rating";
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
import { useAuth } from "../components/AuthContext";
import NavBtns from "../components/NavBtns";
import FormBtns from "../components/FormBtns";
import EditGame from "./EditGame";

const Game = () => {
  let { id } = useParams();
  const { t } = useTranslation(["game", "common", "home"]);
  const navigate = useNavigate();
  const { admin } = useAuth();
  const [isAdmin] = admin;
  const [game, setGame] = useState({});
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [liked, setLiked] = useState(false);
  const [favourite, setFavourite] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const btnLikeName = () =>
    liked ? `${t("game:liked")} 👍` : `${t("game:like")} 👍🏻`;
  const btnFavName = () =>
    favourite
      ? `${t("game:favourited")} ❤️`
      : `${t("game:addtofavourites")} 🤍`;

  const refreshGame = useCallback(() => {
    getGame(id).then((res) => setGame(res.data));
  }, [id]);

  useEffect(() => {
    refreshGame();
  }, [refreshGame]);

  const refreshComments = useCallback(() => {
    getGameComments(id).then((res) => setComments(res.data));
  }, [id]);

  useEffect(() => {
    refreshComments();
  }, [refreshComments]);

  useEffect(() => {
    getGameLike(id).then((res) => {
      if (!res.data.length) return setLiked(false);
      setLiked(true);
    });
  }, [id]);

  useEffect(() => {
    getGameFavourite(id).then((res) => {
      if (!res.data.length) return setFavourite(false);
      setFavourite(true);
    });
  }, [id]);

  const handleChange = (e) => {
    setComment(e.target.value);
  };

  const like = () => {
    postLike(id).then(() => setLiked(!liked));
  };

  const addToFavourites = () => {
    postFavourite(id).then(() => setFavourite(!favourite));
  };

  const addComment = (e) => {
    e.preventDefault();
    if (!comment) return alertMessage("warning", "Add your comment!");
    postComment(id, comment).then((res) => {
      setComment("");
      refreshComments();
    });
  };

  return (
    <>
      <NavBtns />
      <div className={style.gameContainer}>
        {isEdit ? (
          <EditGame
            game={game}
            refreshGame={refreshGame}
            setIsEdit={setIsEdit}
          />
        ) : (
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
              <FormBtns
                denyBtnName={t("common:back")}
                denyBtnOnClick={() => navigate(-1)}
                confirmBtnName={t("common:edit")}
                confirmBtnOnClick={() => setIsEdit(true)}
              />
            )}
          </div>
        )}
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
          <Rating id={id} />
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

          <Comment refreshComments={refreshComments} comments={comments} />
        </div>
      </div>
    </>
  );
};
export default Game;
