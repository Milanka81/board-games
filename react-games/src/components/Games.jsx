import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { numberPlayers, imgSrc } from "../utils";
import { useTranslation } from "react-i18next";

const Games = ({ header, games, id }) => {
  const navigate = useNavigate();
  const [gameHovering, setGameHovering] = useState("");
  const { t } = useTranslation(["game"]);

  const HoverText = ({ game }) => {
    return (
      <div className="games__details">
        <h3 className="u-m-xs">{game.name}</h3>
        <p>
          {t("year")}: <strong>{game.year}</strong>
        </p>
        <p>
          {t("numberofplayers")}:{" "}
          <strong>{numberPlayers(game.min_players, game.max_players)}</strong>
        </p>
        <p>
          {t("playingtime")}: <strong>{game.game_length}</strong>
        </p>
      </div>
    );
  };

  return (
    <div className="games__container">
      <h2 className="title u-m-m">{header}</h2>
      <div className="games__grid">
        {games &&
          games.map((game) => (
            <div
              className="games__gameHover"
              onClick={() => {
                navigate(`/game/${game.game_id}`);
                document.title = `Board Game | ${game.name}`;
              }}
              onMouseLeave={() => setGameHovering("")}
              onMouseEnter={() => setGameHovering(game.name)}
              key={`${id}-${game.game_id}`}
            >
              <img
                className="games__gameImg"
                src={imgSrc(game.img)}
                alt={game.name}
              />

              {game.name === gameHovering && <HoverText game={game} />}

              <div className="games__small">
                <h3 className="u-m-xs">{game.name}</h3>
                <p>
                  {t("year")}: <strong>{game.year}</strong>
                </p>
                <p>
                  {t("numberofplayers")}:{" "}
                  <strong>
                    {numberPlayers(game.min_players, game.max_players)}
                  </strong>
                </p>
                <p>
                  {t("playingtime")}: <strong>{game.game_length}</strong>
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
export default Games;
