import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteGame } from "../service";
import { imgSrc, handleEmpty, alertDelete } from "../utils";
import { handleClickSort, arrows, styleClass } from "../sortFunctions";
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
          <table>
            <thead>
              <tr>
                <th></th>
                <th>{t("game:image")}</th>
                <th
                  className={styleClass("name", sortBy)}
                  onClick={(e) => handleClickSort(e, "name", sortBy, setSortBy)}
                >
                  {arrows("name", sortBy)} {t("game:name")}
                </th>
                <th
                  className={styleClass("added_date", sortBy)}
                  onClick={(e) =>
                    handleClickSort(e, "added_date", sortBy, setSortBy)
                  }
                >
                  {arrows("added_date", sortBy)} {t("game:dateadded")}
                </th>
                <th
                  className={styleClass("min_players", sortBy)}
                  onClick={(e) =>
                    handleClickSort(e, "min_players", sortBy, setSortBy)
                  }
                >
                  {arrows("min_players", sortBy)} {t("game:minplayers")}
                </th>
                <th
                  className={styleClass("max_players", sortBy)}
                  onClick={(e) =>
                    handleClickSort(e, "max_players", sortBy, setSortBy)
                  }
                >
                  <span>{arrows("max_players", sortBy)}</span>{" "}
                  <span>{t("game:maxplayers")}</span>
                </th>
                <th
                  className={`${styleClass("year", sortBy)} u-text-center`}
                  onClick={(e) => handleClickSort(e, "year", sortBy, setSortBy)}
                >
                  {arrows("year", sortBy)} {t("game:year")}
                </th>
                <th
                  className={`${styleClass(
                    "game_length",
                    sortBy
                  )} u-text-center`}
                  onClick={(e) =>
                    handleClickSort(e, "game_length", sortBy, setSortBy)
                  }
                >
                  {arrows("game_length", sortBy)} {t("game:playingtime")}
                </th>
                <th>{t("game:artist")}</th>
                <th>{t("game:designer")}</th>
                <th>{t("game:category")}</th>
                <th className="u-relative">
                  {" "}
                  <button
                    className="btn__navBtn btn__add"
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
                    <td className="u-text-center">
                      {handleEmpty(game.min_players)}
                    </td>
                    <td className="u-text-center">
                      {handleEmpty(game.max_players)}
                    </td>
                    <td className="u-text-center">{handleEmpty(game.year)}</td>
                    <td className="u-text-center">
                      {handleEmpty(game.game_length)}
                    </td>
                    <td>{game.artist}</td>
                    <td>{game.designer}</td>
                    <td>{game.category}</td>
                    <td>
                      <ListBtns
                        denyBtnName={t("common:cancel")}
                        denyBtnOnClick={() =>
                          alertDelete(deleteGame, game.game_id, refetch)
                        }
                        confirmBtnName={t("common:view")}
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
