import { FaStar } from "react-icons/fa";
import { useState, useEffect, useCallback } from "react";
import { getRating, getAvgRating, postRating } from "../service";
import { useTranslation } from "react-i18next";
import { useAuth } from "./AuthContext";
import { handleEmpty } from "../utils";

const Rating = ({ id }) => {
  const { admin } = useAuth();
  const [isAdmin] = admin;
  const { t } = useTranslation(["game"]);
  const [rating, setRating] = useState(null);
  const [hover, setHover] = useState(null);
  const [avgRating, setAvgRating] = useState(null);
  const loggedUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    getRating(id).then((res) => {
      const filter = res.data.filter((el) => el.user_id === loggedUser.user_id);
      if (!filter[0]) return setRating(0);
      setRating(filter[0].user_rate);
    });
  }, [loggedUser.user_id, id]);

  const fetchAvg = useCallback(() => {
    getAvgRating(id).then((res) => {
      if (!res.data[0].avg) return setAvgRating(0);
      const rate = res.data[0].avg;
      setAvgRating(rate.slice(0, 4));
    });
  }, [id]);

  useEffect(() => {
    fetchAvg();
  }, [fetchAvg]);

  const rateGame = (rating) => {
    setRating(rating);
    postRating(id, rating).then((res) => {
      fetchAvg();
    });
  };

  return (
    <div className="rating__gameRating">
      <div>
        {/* {[...Array(5)].map((_, i) => { */}
        {Array.from({ length: 5 }, (_, i) => {
          const ratingValue = i + 1;
          return (
            <label key={i}>
              {!isAdmin ? (
                <>
                  <input
                    type="radio"
                    name="rating"
                    id="rating"
                    value={ratingValue}
                    onClick={() => rateGame(ratingValue)}
                  />
                  <FaStar
                    className="rating__star"
                    data-testid="star"
                    size={25}
                    color={
                      ratingValue <= (hover || rating) ? "#ffc107" : "#aaa"
                    }
                    onMouseEnter={() => setHover(ratingValue)}
                    onMouseLeave={() => setHover(null)}
                  />
                </>
              ) : (
                <>
                  <input
                    type="radio"
                    name="rating"
                    id="rating"
                    value={handleEmpty(avgRating)}
                  />
                  <FaStar
                    className="rating__star"
                    size={25}
                    color={avgRating + 1 <= ratingValue ? "#aaa" : "#ffc107"}
                  />
                </>
              )}
            </label>
          );
        })}
      </div>

      <div className="rating__avgRating">
        {t("avgrating")}: (<strong>{avgRating}</strong>/ 5)
      </div>
    </div>
  );
};

export default Rating;
