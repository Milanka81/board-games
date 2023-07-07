import "../css/Rating.css";
import { FaStar } from "react-icons/fa";
import { useState, useEffect } from "react";
import { getRating, getAvgRating, postRating } from "../service";
import { alertMessage } from "../utils";
import { useTranslation } from "react-i18next";

const Rating = ({ id, isAdmin }) => {
  const { t } = useTranslation(["game"]);
  const [rating, setRating] = useState(null);
  const [hover, setHover] = useState(null);
  const [avgRating, setAvgRating] = useState(null);
  const loggedUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    getRating(id)
      .then((res) => {
        const filter = res.data.filter(
          (el) => el.user_id === loggedUser.user_id
        );
        if (!filter[0]) return setRating(0);
        setRating(filter[0].user_rate);
      })
      .catch((err) => console.log(err));

    // eslint-disable-next-line
  }, []);

  const fetchAvg = () => {
    getAvgRating(id)
      .then((res) => {
        if (!res.data[0].avg) return setAvgRating(0);
        const rate = res.data[0].avg;
        setAvgRating(rate.slice(0, 4));
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchAvg();
    // eslint-disable-next-line
  }, []);

  const rateGame = (rating) => {
    setRating(rating);
    postRating(id, rating)
      .then(() => {
        fetchAvg();
      })
      .catch((err) => alertMessage("error", err.message));
  };

  return (
    <>
      <div className="game-rating">
        {!isAdmin && (
          <div className="stars">
            {/* {[...Array(5)].map((_, i) => { */}
            {Array.from({ length: 5 }, (_, i) => {
              const ratingValue = i + 1;
              return (
                <label key={i}>
                  <input
                    type="radio"
                    name="rating"
                    id="rating"
                    value={ratingValue}
                    onClick={() => rateGame(ratingValue)}
                  />
                  <FaStar
                    className="star"
                    size={25}
                    color={
                      ratingValue <= (hover || rating) ? "#ffc107" : "#aaa"
                    }
                    onMouseEnter={() => setHover(ratingValue)}
                    onMouseLeave={() => setHover(null)}
                  />
                </label>
              );
            })}
          </div>
        )}
        <div className="avg-rating">
          {t("avgrating")}: (<strong>{avgRating}</strong>/ 5)
        </div>
      </div>
    </>
  );
};

export default Rating;
