import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { deleteGame, getFilteredGames } from "../service";
// import "../css/Table.css";
import { imgSrc, handleEmpty, alertDelete, alertMessage } from "../utils";
import SearchBar from "../components/SearchBar";
import { useCallback } from "react";
import Pagination from "../components/Pagination";
import { useTranslation } from "react-i18next";
import Loader from "../components/Loader";
import style from "./List.module.css";

const ListOfGames = (idRow) => {
  const { t } = useTranslation(["game", "common", "home"]);
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const [filteredGames, setFilteredGames] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("game_id");
  const [isLoading, setIsLoading] = useState(true);
  const limit = 5;

  const fetchGames = useCallback(() => {
    getFilteredGames(currentPage, limit, searchInput, sortBy)
      .then((res) => {
        setFilteredGames(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        alertMessage("error", err.message);
        setIsLoading(false);
      });
  }, [currentPage, searchInput, sortBy]);

  useEffect(() => {
    const filter = setTimeout(() => {
      fetchGames();
    }, 1000);
    return () => clearTimeout(filter);
  }, [fetchGames]);

  const handleChange = (e) => {
    setSearchInput(e.target.value);
  };
  const handleClick = (e, value) => {
    e.preventDefault();
    sortBy.endsWith("asc")
      ? setSortBy(`${value} desc`)
      : setSortBy(`${value} asc`);
  };
  const styleClass = (value) =>
    sortBy.includes(value)
      ? `${`${style.pointer} ${style.sort}`}`
      : `${style.pointer}`;

  const arrows = (value) => (sortBy.endsWith(`${value} desc`) ? "▼" : "▲");

  return (
    <>
      {isLoading ? (
        <Loader message={t("home:loading")} />
      ) : (
        <div>
          <div className={style.flex}>
            <button
              className={style.navBtn}
              onClick={() => {
                navigate("/users");
              }}
            >
              👤 {t("home:users")}
            </button>

            <SearchBar
              handleChange={handleChange}
              placeholder={t("home:searchplaceholder")}
            />
          </div>
          <table className={style.tableList}>
            <thead>
              <tr>
                <th></th>
                <th>{t("game:image")}</th>
                <th
                  className={styleClass("name")}
                  onClick={(e) => handleClick(e, "name")}
                >
                  {arrows("name")} {t("game:name")}
                </th>
                <th
                  className={styleClass("added_date")}
                  onClick={(e) => handleClick(e, "added_date")}
                >
                  {arrows("added_date")} {t("game:dateadded")}
                </th>
                <th
                  className={styleClass("min_players")}
                  onClick={(e) => handleClick(e, "min_players")}
                >
                  {arrows("min_players")} {t("game:minplayers")}
                </th>
                <th
                  className={styleClass("max_players")}
                  onClick={(e) => handleClick(e, "max_players")}
                >
                  {arrows("max_players")} {t("game:maxplayers")}
                </th>
                <th
                  className={styleClass("year")}
                  onClick={(e) => handleClick(e, "year")}
                >
                  {arrows("year")} {t("game:year")}
                </th>
                <th
                  className={styleClass("game_length")}
                  onClick={(e) => handleClick(e, "game_length")}
                >
                  {arrows("game_length")} {t("game:playingtime")}
                </th>
                <th>{t("game:artist")}</th>
                <th>{t("game:designer")}</th>
                <th>{t("game:category")}</th>
                <th>
                  {" "}
                  <button
                    className={`${style.navBtn} ${style.btnAdd}`}
                    onClick={() => {
                      navigate(`/addGame`);
                    }}
                  >
                    {t("game:addnewgame")}
                  </button>
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredGames.map((game, i) => (
                <tr key={`${idRow}-${game.game_id}`}>
                  <td>{(currentPage - 1) * limit + i + 1}</td>
                  <td>
                    <img
                      className={style.gameImg}
                      src={imgSrc(game.img)}
                      alt={game.name}
                    />
                  </td>
                  <td>{game.name}</td>
                  <td>{handleEmpty(game.added_date).slice(0, 10)}</td>
                  <td>{handleEmpty(game.min_players)}</td>
                  <td>{handleEmpty(game.max_players)}</td>
                  <td>{handleEmpty(game.year)}</td>
                  <td>{handleEmpty(game.game_length)}</td>
                  <td>{game.artist}</td>
                  <td>{game.designer}</td>
                  <td>{game.category}</td>
                  <td className={`${style.actionBtns} ${style.games}`}>
                    <button
                      className={`${style.btn} ${style.green}`}
                      onClick={() => {
                        navigate(`/game/${game.game_id}`);
                        document.title = `Board Game | ${game.name}`;
                      }}
                    >
                      {t("common:view")} / {t("common:edit")}
                    </button>
                    <button
                      className={`${style.btn} ${style.red}`}
                      onClick={() =>
                        alertDelete(deleteGame, game.game_id, fetchGames)
                      }
                    >
                      {t("common:delete")}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            limit={limit}
            list="gamesList"
          />
        </div>
      )}
    </>
  );
};
export default ListOfGames;
