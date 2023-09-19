import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Rating from "../components/Rating";
import Comment from "../components/Comment";
import { useTranslation } from "react-i18next";
import { numberPlayers, handleEmpty, imgSrc } from "../utils";
import {
  getGameLike,
  getGameFavourite,
  postLike,
  postFavourite,
} from "../service";
import { useAuth } from "../components/AuthContext";
import NavBtn from "../components/NavBtn";
import FormBtns from "../components/FormBtns";
import EditGame from "./EditGame";
import { useGetGame } from "../hooks/game";
import Loader from "../components/Loader";
import { useGetGameComments } from "../hooks/comment";

const Game = () => {
  let { id } = useParams();
  const { t } = useTranslation(["game", "common", "home"]);
  const navigate = useNavigate();
  const { admin } = useAuth();
  const [isAdmin] = admin;
  const [liked, setLiked] = useState(false);
  const [favourite, setFavourite] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const btnLikeName = () =>
    liked ? `${t("game:liked")} 👍` : `${t("game:like")} 👍🏻`;
  const btnFavName = () =>
    favourite
      ? `${t("game:favourited")} ❤️`
      : `${t("game:addtofavourites")} 🤍`;

  const { data: game, isSuccess, isLoading, refetch } = useGetGame(id);

  const { data: gameComments, refetch: refetchComments } =
    useGetGameComments(id);

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

  const like = () => {
    postLike(id).then(() => setLiked(!liked));
  };

  const addToFavourites = () => {
    postFavourite(id).then(() => setFavourite(!favourite));
  };

  return (
    <>
      <div className="itemsContainer">
        <NavBtn path={-1} />
      </div>
      <div className="gridContainer">
        {isEdit ? (
          <EditGame
            game={game}
            isSuccess={isSuccess}
            refreshGame={refetch}
            setIsEdit={setIsEdit}
          />
        ) : (
          <Loader isLoading={isLoading}>
            <div className="flexContainer">
              {isSuccess && (
                <div className="form u-width">
                  <div className="game__imgContainer">
                    <img
                      className="game__img"
                      src={imgSrc(game.img)}
                      alt={game.name}
                    />
                  </div>
                  <div className="u-flex u-column u-gap-s">
                    <p className="title u-mb-s">
                      <strong>{handleEmpty(game.name)}</strong>
                    </p>
                    <p className="form__gridField">
                      {t("game:year")}:{" "}
                      <strong className="form__inputField">
                        {handleEmpty(game.year)}
                      </strong>
                    </p>
                    <p className="form__gridField">
                      {t("game:numberofplayers")}:
                      <strong className="form__inputField">
                        {numberPlayers(
                          handleEmpty(game.min_players),
                          handleEmpty(game.max_players)
                        )}
                      </strong>
                    </p>
                    <p className="form__gridField">
                      {t("game:playingtime")}:
                      <strong className="form__inputField">
                        {handleEmpty(game.game_length)}
                      </strong>
                    </p>
                    <p className="form__gridField">
                      {t("game:designer")}:{" "}
                      <strong className="form__inputField">
                        {handleEmpty(game.designer)}
                      </strong>
                    </p>
                    <p className="form__gridField">
                      {t("game:artist")}:{" "}
                      <strong className="form__inputField">
                        {handleEmpty(game.artist)}
                      </strong>
                    </p>
                    <p className="form__gridField">
                      {t("game:category")}:{" "}
                      <strong className="form__inputField">
                        {handleEmpty(game.category)}
                      </strong>
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
            </div>
          </Loader>
        )}
        <div className="flexContainer">
          {!isAdmin && (
            <div className="u-flex u-justify-start u-gap-m">
              <button className="btn__reaction" onClick={addToFavourites}>
                {btnFavName()}
              </button>

              <button className="btn__reaction" onClick={like}>
                {btnLikeName()}
              </button>
            </div>
          )}
          <Rating id={id} />

          <Comment
            gameId={id}
            comments={gameComments}
            refetch={refetchComments}
          />
        </div>
      </div>
    </>
  );
};
export default Game;
