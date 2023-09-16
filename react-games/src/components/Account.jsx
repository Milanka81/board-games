import { handleEmpty, refreshPage, alertDelete, logout } from "../utils";
import { deleteUser } from "../service";
import { useTranslation } from "react-i18next";
import FormBtns from "./FormBtns";
const Account = ({ user = {}, handleEdit }) => {
  const { t } = useTranslation(["common"]);
  const { first_name, last_name, username, email, role, user_id } = user;

  const handleDelete = (e) => {
    e.preventDefault();
    alertDelete(deleteUser, user_id, refreshPage, logout);
  };

  return (
    <form className="form">
      <div className="form__inputField">{handleEmpty(first_name)}</div>
      <div className="form__inputField">{handleEmpty(last_name)}</div>
      <div className="form__inputField">{handleEmpty(username)}</div>
      <div className="form__inputField">{handleEmpty(email)}</div>
      <div className="form__inputField">{handleEmpty(role)}</div>
      <FormBtns
        denyBtnName={t("delete")}
        denyBtnOnClick={handleDelete}
        confirmBtnName={t("edit")}
        confirmBtnOnClick={handleEdit}
      />
    </form>
  );
};

export default Account;
