import { useTranslation } from "react-i18next";

const PageNotFound = () => {
  const { t } = useTranslation(["common"]);
  return (
    <div className="container">
      <h1 className="error u-mb-s ">404</h1>
      <h3 className="title"> {t("pagenotfound")}</h3>
    </div>
  );
};

export default PageNotFound;
