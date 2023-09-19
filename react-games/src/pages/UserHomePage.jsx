import Preferences from "./Preferences";
import Games from "../components/Games";
import { useTranslation } from "react-i18next";
import { useFavouriteGames, useRecommendedGames } from "../hooks/games";
import Modal from "../components/Modal";
import { useIsPreferences } from "../hooks/preferences";

const UserHomePage = () => {
  const { t } = useTranslation(["home"]);
  const { data: recommended } = useRecommendedGames();
  const { data: gamesFavourite } = useFavouriteGames();
  const { data: preferences } = useIsPreferences();

  return (
    <div>
      {!preferences?.length && (
        <Modal>
          <Preferences
            className="form__preferencesContainer"
            componentState="isAdding"
            title={t("addgamepreferences")}
          />
        </Modal>
      )}

      {gamesFavourite?.length ? (
        <Games
          header={t("favouritegames")}
          games={gamesFavourite}
          id="favouriteGames"
        />
      ) : null}
      {recommended?.length ? (
        <Games
          header={t("recommendedgames")}
          games={recommended}
          id="recommendedGames"
        />
      ) : null}
    </div>
  );
};

export default UserHomePage;
