import { NavLink, useNavigate } from "react-router-dom";
import { logout, handleEmpty } from "../utils";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import Select from "./Select";
import style from "./Header.module.css";

const Header = () => {
  const { i18n, t } = useTranslation(["common"]);
  const navigate = useNavigate();

  const loggedUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (localStorage.getItem("i18nextLng")?.length > 2) {
      i18next.changeLanguage("en");
    }
  }, []);

  const handleLanguageChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };
  return (
    <div className={style.mainHeader}>
      {loggedUser ? (
        <>
          <p className={style.loggedUser}>
            {" "}
            {t("welcome")} <strong> {handleEmpty(loggedUser.username)}</strong>
          </p>
          <ul className={style.mainNavList}>
            <li>
              {/* <button
                className="btn"
                onClick={() => {
                  navigate("/");
                }}
              >
                {t("home")}
              </button> */}
              <NavLink to="/">{t("home")}</NavLink>
            </li>
            <li>
              {/* <button
                className="btn"
                onClick={() => {
                  navigate("/profile");
                }}
              >
                {t("profile")}
              </button> */}
              <NavLink to="/profile">{t("profile")}</NavLink>
            </li>

            <Select handleLanguageChange={handleLanguageChange} />

            <li>
              <button
                className={style.btnLogout}
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
              >
                {t("logout")}
              </button>
            </li>
          </ul>{" "}
        </>
      ) : (
        <>
          <p className={style.appTitle}> 🎲 {t("apptitle")} 🎲</p>
          <Select handleLanguageChange={handleLanguageChange} />
        </>
      )}
    </div>
  );
};
export default Header;
