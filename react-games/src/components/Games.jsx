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
      <div className="details">
        <h3>{game.name}</h3>
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
    <div className="container">
      <h2 className="listOfGamesTitle form-title">{header}</h2>
      <div className="grid">
        {games &&
          games.map((game) => (
            <div
              className="game-hover"
              onClick={() => {
                navigate(`/game/${game.game_id}`);
                document.title = `Board Game | ${game.name}`;
              }}
              onMouseLeave={() => setGameHovering("")}
              onMouseEnter={() => setGameHovering(game.name)}
              key={`${id}-${game.game_id}`}
            >
              <img
                className="game-img"
                src={imgSrc(game.img)}
                alt={game.name}
              />

              {game.name === gameHovering && <HoverText game={game} />}
            </div>
          ))}
      </div>
    </div>
  );
};
export default Games;
