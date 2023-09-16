import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const NavBtn = ({ path }) => {
  const { t } = useTranslation(["home", "common"]);
  const navigate = useNavigate();

  let name;
  if (path === "/games") name = `🎲 ${t("home:games")}`;
  if (path === "/users") name = `👤 ${t("home:users")}`;
  if (path === -1) name = `⬅️ ${t("common:back")}`;

  return (
    <button
      className="btn__navBtn u-ml-s u-mt-s"
      onClick={() => {
        navigate(path);
      }}
    >
      {name}
    </button>
  );
};

export default NavBtn;
