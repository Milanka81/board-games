import { useTranslation } from "react-i18next";

const Loader = ({ isLoading, children }) => {
  const { t } = useTranslation(["home"]);

  if (isLoading) {
    return (
      <div className="loader">
        <span className="loader__spinner">🎲</span>
        <h3>{t("loading")}</h3>
      </div>
    );
  }
  return children;
};

export default Loader;
