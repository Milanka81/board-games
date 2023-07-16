import { handleEmpty, refreshPage, alertDelete, logout } from "../utils";
import { deleteUser } from "../service";
import { useTranslation } from "react-i18next";
import style from "./Account.module.css";

const Account = ({ user, handleEdit }) => {
  const { t } = useTranslation(["common"]);
  const { first_name, last_name, username, email, role, user_id } = user;

  return (
    <form className={style.form}>
      <div className={style.formField}>{handleEmpty(first_name)}</div>
      <div className={style.formField}>{handleEmpty(last_name)}</div>
      <div className={style.formField}>{handleEmpty(username)}</div>
      <div className={style.formField}>{handleEmpty(email)}</div>
      <div className={style.formField}>{handleEmpty(role)}</div>
      <div className={style.btnsContainer}>
        <button
          className={`${style.btnFormSubmit} ${style.green}`}
          type="button"
          onClick={handleEdit}
        >
          {t("edit")}
        </button>
        <button
          className={`${style.btnFormSubmit} ${style.red}`}
          type="button"
          onClick={(e) => {
            e.preventDefault();
            alertDelete(deleteUser, user_id, refreshPage, logout);
          }}
        >
          {t("delete")}
        </button>
      </div>
    </form>
  );
};

export default Account;
