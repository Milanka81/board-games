import { useNavigate } from "react-router-dom";
import { logout, handleEmpty } from "../utils";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import Select from "./Select";

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
    <div className="main-header">
      {loggedUser ? (
        <>
          <p className="loggedUser">
            {" "}
            {t("welcome")} <strong> {handleEmpty(loggedUser.username)}</strong>
          </p>
          <ul className="main-nav-list">
            <li>
              <button
                className="btn"
                onClick={() => {
                  navigate("/");
                }}
              >
                {t("home")}
              </button>
            </li>
            <li>
              <button
                className="btn"
                onClick={() => {
                  navigate("/profile");
                }}
              >
                {t("profile")}
              </button>
            </li>

            <Select handleLanguageChange={handleLanguageChange} />

            <li>
              <button
                className="btn-nav"
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
          <p className="form-title nav-title"> 🎲 {t("apptitle")} 🎲</p>
          <Select handleLanguageChange={handleLanguageChange} />
        </>
      )}
    </div>
  );
};
export default Header;
