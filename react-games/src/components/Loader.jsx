import style from "./Loader.module.css";
import { useTranslation } from "react-i18next";

const Loader = () => {
  const { t } = useTranslation(["home"]);

  return (
    <div className={style.loader}>
      <span className={style.spinner}>🎲</span>
      <h3>{t("loading")}</h3>
    </div>
  );
};

export default Loader;
