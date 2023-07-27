import { useEffect, useState } from "react";
import {
  getRecommendedGames,
  getUserPreferences,
  getFavoriteGames,
} from "../service";
import { alertMessage } from "../utils";
import Preferences from "./Preferences";
import Games from "../components/Games";
import { useTranslation } from "react-i18next";
import style from "./HomePage.module.css";

const UserHomePage = () => {
  const { t } = useTranslation(["home"]);
  const [recommended, setRecommended] = useState([]);
  const [preferences, setPreferences] = useState(true);
  const [gamesFavourite, setGamesFavourite] = useState([]);

  useEffect(() => {
    getRecommendedGames()
      .then((res) => setRecommended(res.data))
      .catch((err) => alertMessage("error", err.message));
  }, []);

  useEffect(() => {
    setInterval(() => {
      if (!preferences) {
        setPreferences(false);
      }
    }, 9000);
  }, [preferences]);

  useEffect(() => {
    getUserPreferences()
      .then((res) => setPreferences(!!res.data.length))
      .catch((err) => alertMessage("error", err.message));
  }, []);

  useEffect(() => {
    getFavoriteGames()
      .then((res) => setGamesFavourite(res.data))
      .catch((err) => alertMessage("error", err.message));
  }, []);

  return (
    <div>
      {!preferences && (
        <div>
          <div className={style.overlay}></div>
          <Preferences
            componentState="isAdding"
            className={style.modalAdd}
            title={t("addgamepreferences")}
            fieldClassName={style.editFormField}
          />
        </div>
      )}

      {gamesFavourite.length ? (
        <Games
          header={t("favouritegames")}
          games={gamesFavourite}
          id="favouriteGames"
        />
      ) : null}
      <Games
        header={t("recommendedgames")}
        games={recommended}
        id="recommendedGames"
      />
    </div>
  );
};

export default UserHomePage;
