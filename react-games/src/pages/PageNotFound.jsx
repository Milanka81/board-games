import { useTranslation } from "react-i18next";

const PageNotFound = () => {
  const { t } = useTranslation(["common"]);
  return (
    <div className="loader">
      <h1 className="notfound">404</h1>
      <h3 className="form-title"> {t("pagenotfound")}</h3>
    </div>
  );
};

export default PageNotFound;
