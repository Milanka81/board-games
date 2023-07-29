import style from "./Loader.module.css";
import { useTranslation } from "react-i18next";

const Loader = ({ isLoading, children }) => {
  const { t } = useTranslation(["home"]);

  if (isLoading) {
    return (
      <div className={style.loader}>
        <span className={style.spinner}>🎲</span>
        <h3>{t("loading")}</h3>
      </div>
    );
  }
  return children;
};

export default Loader;
