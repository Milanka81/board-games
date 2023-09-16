import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteGame } from "../service";
import { imgSrc, handleEmpty, alertDelete } from "../utils";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import { useTranslation } from "react-i18next";
import Loader from "../components/Loader";
import ListBtns from "../components/ListBtns";
import AddGame from "./AddGame";
import { useDebounce } from "../hooks/utilsHooks";
import { useFilteredGames } from "../hooks/useFilteredGames";
import Modal from "../components/Modal";
import NavBtn from "../components/NavBtn";

const ListOfGames = (idRow) => {
  const { t } = useTranslation(["game", "common", "home"]);
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("game_id");
  const [openModal, setOpenModal] = useState(false);
  const limit = 5;

  const search = useDebounce(searchInput);
  const enabled = searchInput === "" || !!search;
  const { filteredGames, isLoading, isSuccess, refetch, pageCount } =
    useFilteredGames(currentPage, limit, search, sortBy, enabled);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchInput]);

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
    sortBy.includes(value) ? "u-pointer u-color-primary" : "u-pointer";

  const arrows = (value) => (sortBy.endsWith(`${value} desc`) ? "▼" : "▲");

  return (
    <>
      <div>
        {openModal && (
          <Modal>
            <AddGame
              className="game__addContainer"
              setOpenModal={setOpenModal}
            />
          </Modal>
        )}
        <div className="table__flex">
          <NavBtn path="/users" />
          <SearchBar
            handleChange={handleChange}
            placeholder={t("home:searchplaceholder")}
          />
        </div>
        <Loader isLoading={isLoading}>
          <table className="table__list">
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
                  <span>{arrows("max_players")}</span>{" "}
                  <span>{t("game:maxplayers")}</span>
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
                    className="btn__navBtn"
                    onClick={() => setOpenModal(true)}
                  >
                    {t("game:addnewgame")}
                  </button>
                </th>
              </tr>
            </thead>

            <tbody>
              {isSuccess &&
                filteredGames.map((game, i) => (
                  <tr key={`${idRow}-${game.game_id}`}>
                    <td>{(currentPage - 1) * limit + i + 1}</td>
                    <td>
                      <img
                        className="table__gameImg"
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
                    <td>
                      <ListBtns
                        denyBtnName={t("common:cancel")}
                        denyBtnOnClick={() =>
                          alertDelete(deleteGame, game.game_id, refetch)
                        }
                        confirmBtnName={`${t("common:view")} / ${t(
                          "common:edit"
                        )}`}
                        confirmBtnOnClick={() => {
                          navigate(`/game/${game.game_id}`);
                          document.title = `Board Game | ${game.name}`;
                        }}
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            count={pageCount}
          />
        </Loader>
      </div>
    </>
  );
};
export default ListOfGames;
