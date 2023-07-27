import { useEffect, useState } from "react";
import { getMostLiked, getFilteredGames, getNewGames } from "../service";
import { alertMessage } from "../utils";
import Games from "../components/Games";
import { useTranslation } from "react-i18next";
import UserHomePage from "./UserHomePage";
import Loader from "../components/Loader";
import { useContext } from "react";
import { AuthContext } from "../App";
import AdminHomePage from "./AdminHomePage";
import SearchBar from "../components/SearchBar";
import style from "./HomePage.module.css";

const HomePage = () => {
  const { t } = useTranslation(["home"]);
  const { admin } = useContext(AuthContext);
  const [isAdmin] = admin;
  const [isLoading, setIsLoading] = useState(true);
  const [filteredGames, setFilteredGames] = useState([]);
  const [mostLiked, setMostLiked] = useState([]);
  const [newGames, setNewGames] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const currentPage = 1;
  const limit = "";
  const sortBy = "game_id";

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

  const handleChange = (e) => {
    setSearchInput(e.target.value);
  };

  useEffect(() => {
    getMostLiked()
      .then((res) => setMostLiked(res.data))
      .catch((err) => alertMessage("error", err.message));
  }, []);

  useEffect(() => {
    getNewGames()
      .then((res) => setNewGames(res.data))
      .catch((err) => alertMessage("error", err.message));
  }, []);

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {isAdmin ? (
            <AdminHomePage />
          ) : (
            <SearchBar
              handleChange={handleChange}
              placeholder={t("searchplaceholder")}
              className={style.search}
            />
          )}
          <Games header={t("allgames")} games={filteredGames} id="allGames" />
          <Games header={t("newgames")} games={newGames} id="newGames" />
          <Games
            header={t("mostlikedgames")}
            games={mostLiked}
            id="likedGames"
          />
          {!isAdmin && <UserHomePage />}
        </>
      )}
    </div>
  );
};

export default HomePage;
