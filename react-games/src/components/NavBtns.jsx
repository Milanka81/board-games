import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import style from "../pages/ViewEditGame.module.css";

const NavBtns = () => {
  const { t } = useTranslation(["home", "common"]);
  const navigate = useNavigate();
  const { admin } = useAuth();
  const [isAdmin] = admin;
  return (
    <>
      {isAdmin ? (
        <button
          className={style.navBtn}
          onClick={() => {
            navigate("/games");
          }}
        >
          🎲 {t("home:games")}
        </button>
      ) : (
        <button
          className={style.navBtn}
          onClick={() => {
            navigate(-1);
          }}
        >
          ⬅️ {t("common:back")}
        </button>
      )}
    </>
  );
};

export default NavBtns;
