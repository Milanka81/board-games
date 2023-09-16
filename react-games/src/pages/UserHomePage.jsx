import { useEffect, useState } from "react";
import Preferences from "./Preferences";
import Games from "../components/Games";
import { useTranslation } from "react-i18next";
import { useFavouriteGames, useRecommendedGames } from "../hooks/games";
import Modal from "../components/Modal";

const UserHomePage = () => {
  const { t } = useTranslation(["home"]);
  const [isPreferences, setIsPreferences] = useState(true);
  const { data: recommended } = useRecommendedGames();
  const { data: gamesFavourite, isSuccess: fetchedFav } = useFavouriteGames();
  const { data: preferences, isSuccess: fetchedPreferences } =
    useFavouriteGames();

  useEffect(() => {
    setInterval(() => {
      if (!preferences?.at[0]) {
        setIsPreferences(false);
      }
    }, 9000);
  }, [fetchedPreferences, preferences]);

  return (
    <div>
      {!isPreferences && (
        <Modal>
          <Preferences
            className="form__preferencesContainer"
            componentState="isAdding"
            title={t("addgamepreferences")}
          />
        </Modal>
      )}

      {fetchedFav && gamesFavourite ? (
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
