import { useState } from "react";
import Games from "../components/Games";
import { useTranslation } from "react-i18next";
import UserHomePage from "./UserHomePage";
import Loader from "../components/Loader";
import SearchBar from "../components/SearchBar";
import { useAuth } from "../components/AuthContext";
import { useMostLikedGames, useNewGames } from "../hooks/games";
import { useDebounce } from "../hooks/utilsHooks";
import { useFilteredGames } from "../hooks/useFilteredGames";
import NavBtn from "../components/NavBtn";

const HomePage = () => {
  const { t } = useTranslation(["home"]);
  const { admin } = useAuth();
  const [isAdmin] = admin;
  const [searchInput, setSearchInput] = useState("");
  const currentPage = 1;
  const limit = "";
  const sortBy = "game_id";

  const search = useDebounce(searchInput);
  const { filteredGames, isLoading } = useFilteredGames(
    currentPage,
    limit,
    search,
    sortBy
  );

  const { data: newGames } = useNewGames();
  const { data: mostLiked } = useMostLikedGames();

  const handleChange = (e) => {
    setSearchInput(e.target.value);
  };

  return (
    <>
      {isAdmin ? (
        <>
          <NavBtn path="/users" />
          <NavBtn path="/games" />
        </>
      ) : (
        <SearchBar
          handleChange={handleChange}
          placeholder={t("searchplaceholder")}
          className="search"
        />
      )}
      <Loader isLoading={isLoading}>
        <Games header={t("allgames")} games={filteredGames} id="allGames" />
        <Games header={t("newgames")} games={newGames} id="newGames" />
        <Games header={t("mostlikedgames")} games={mostLiked} id="likedGames" />
        {!isAdmin && <UserHomePage />}
      </Loader>
    </>
  );
};

export default HomePage;
