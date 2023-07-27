import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import style from "./HomePage.module.css";

const AdminHomePage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(["home"]);

  return (
    <div>
      <div className={style.flex}>
        <button
          className={style.navBtn}
          onClick={() => {
            navigate("/users");
          }}
        >
          👤 {t("users")}
        </button>
        <button
          className={style.navBtn}
          onClick={() => {
            navigate("/games");
          }}
        >
          🎲 {t("games")}
        </button>
      </div>
    </div>
  );
};

export default AdminHomePage;
