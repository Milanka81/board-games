import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getFavoriteGames,
  getMostLiked,
  getNewGames,
  getFilteredGames,
  getUserPreferences,
  getRecommendedGames,
} from "../service";
import { useContext } from "react";
import { AuthContext } from "../App";
import Games from "../components/Games";
import SearchBar from "../components/SearchBar";
import Preferences from "./Preferences";
import { useTranslation } from "react-i18next";
import Loader from "../components/Loader";
import { alertMessage } from "../utils";
import style from "./UserHomePage.module.css";

const UserHomePage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(["home"]);
  const { admin } = useContext(AuthContext);
  const [isAdmin] = admin;
  const [mostLiked, setMostLiked] = useState([]);
  const [newGames, setNewGames] = useState([]);
  const [gamesFavourite, setGamesFavourite] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [preferences, setPreferences] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const currentPage = 1;
  const limit = "";
  const sortBy = "game_id";

  useEffect(() => {
    getMostLiked()
      .then((res) => setMostLiked(res.data))
      .catch((err) => alertMessage("error", err.message));
  }, []);

  useEffect(() => {
    if (!isAdmin) {
      getRecommendedGames()
        .then((res) => setRecommended(res.data))
        .catch((err) => alertMessage("error", err.message));
    }
  }, [isAdmin]);

  useEffect(() => {
    setInterval(() => {
      if (!preferences) {
        setPreferences(false);
      }
    }, 9000);
  }, [preferences]);

  useEffect(() => {
    if (!isAdmin) {
      getUserPreferences()
        .then((res) => setPreferences(!!res.data.length))
        .catch((err) => alertMessage("error", err.message));
    }
  }, [isAdmin]);

  useEffect(() => {
    const filter = setTimeout(() => {
      getFilteredGames(currentPage, limit, searchInput, sortBy)
        .then((res) => {
          setFilteredGames(res.data);
          setIsLoading(false);
        })
        .catch((err) => {
          alertMessage("error", err.message);
          setIsLoading(false);
        });
    }, 1000);

    return () => clearTimeout(filter);
  }, [currentPage, searchInput]);

  useEffect(() => {
    if (!isAdmin) {
      getFavoriteGames()
        .then((res) => setGamesFavourite(res.data))
        .catch((err) => alertMessage("error", err.message));
    }
  }, [isAdmin]);

  useEffect(() => {
    getNewGames()
      .then((res) => setNewGames(res.data))
      .catch((err) => alertMessage("error", err.message));
  }, []);

  const handleChange = (e) => {
    setSearchInput(e.target.value);
  };

  return (
    <div>
      {!preferences && !isAdmin && (
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
      {isLoading ? (
        <Loader message={t("loading")} />
      ) : (
        // <Loader></Loader>
        <>
          {isAdmin ? (
            <div className={style.flex}>
              <button
                className={style.navBtn}
                onClick={() => {
                  navigate("/users");
                }}
              >
                👤 {t("users")}
              </button>
              <button
                className={style.navBtn}
                onClick={() => {
                  navigate("/games");
                }}
              >
                🎲 {t("games")}
              </button>
            </div>
          ) : (
            <div className={style.search}>
              <SearchBar
                handleChange={handleChange}
                placeholder={t("searchplaceholder")}
              />
            </div>
          )}

          <Games header={t("allgames")} games={filteredGames} id="allGames" />
          <Games header={t("newgames")} games={newGames} id="newGames" />
          <Games
            header={t("mostlikedgames")}
            games={mostLiked}
            id="likedGames"
          />
          {gamesFavourite.length ? (
            <Games
              header={t("favouritegames")}
              games={gamesFavourite}
              id="favouriteGames"
            />
          ) : null}
          {!isAdmin && (
            <Games
              header={t("recommendedgames")}
              games={recommended}
              id="recommendedGames"
            />
          )}
        </>
      )}
    </div>
  );
};
export default UserHomePage;
