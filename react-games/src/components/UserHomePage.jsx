import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/UserHomePage.css";
import "../css/Preferences.css";
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
import Games from "./Games";
import SearchBar from "./SearchBar";
import Preferences from "./Preferences";
import { useTranslation } from "react-i18next";
import Loader from "./Loader";

const UserHomePage = () => {
  const { t } = useTranslation(["home"]);
  const { admin } = useContext(AuthContext);
  const [isAdmin] = admin;
  const [mostLiked, setMostLiked] = useState([]);
  const [newGames, setNewGames] = useState([]);
  const [gamesFavourite, setGamesFavourite] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const navigate = useNavigate();
  const [filteredGames, setFilteredGames] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [preferences, setPreferences] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const currentPage = 1;
  const limit = "";
  const sortBy = "game_id";

  useEffect(() => {
    getMostLiked()
      .then((res) => setMostLiked(res.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (!isAdmin) {
      getRecommendedGames()
        .then((res) => setRecommended(res.data))
        .catch((err) => console.log(err));
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
        .catch((err) => console.log(err));
    }
  }, [isAdmin]);

  useEffect(() => {
    const filter = setTimeout(() => {
      getFilteredGames(currentPage, limit, searchInput, sortBy).then((res) => {
        setFilteredGames(res.data);
        setIsLoading(false);
      });
    }, 1000);

    return () => clearTimeout(filter);
  }, [currentPage, searchInput]);

  useEffect(() => {
    if (!isAdmin) {
      getFavoriteGames()
        .then((res) => setGamesFavourite(res.data))
        .catch((err) => console.log(err));
    }
  }, [isAdmin]);

  useEffect(() => {
    getNewGames()
      .then((res) => setNewGames(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handleChange = (e) => {
    setSearchInput(e.target.value);
  };

  return (
    <div>
      {!preferences && !isAdmin && (
        <div>
          <div className="overlay"></div>
          <Preferences
            componentState="isAdding"
            className="modalAdd"
            title="Add Game Preferences"
            fieldClassName="form-field"
          />
        </div>
      )}
      {isLoading ? (
        <Loader message={t("loading")} />
      ) : (
        <>
          {isAdmin ? (
            <div className="flex">
              <div className="flex">
                <button
                  className="icon-btn navigation-btn"
                  onClick={() => {
                    navigate("/users");
                  }}
                >
                  👤 {t("users")}
                </button>
                <button
                  className="icon-btn navigation-btn"
                  onClick={() => {
                    navigate("/games");
                  }}
                >
                  🎲 {t("games")}
                </button>
              </div>
            </div>
          ) : (
            <div className="search">
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
