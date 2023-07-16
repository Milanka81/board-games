import { useTranslation } from "react-i18next";
import style from "./PageNotFound.module.css";

const PageNotFound = () => {
  const { t } = useTranslation(["common"]);
  return (
    <div className={style.container}>
      <h1 className={style.error}>404</h1>
      <h3 className={style.message}> {t("pagenotfound")}</h3>
    </div>
  );
};

export default PageNotFound;
