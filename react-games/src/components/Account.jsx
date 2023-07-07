import { handleEmpty, refreshPage, alertDelete, logout } from "../utils";
import { deleteUser } from "../service";
import { useTranslation } from "react-i18next";

const Account = ({ user, handleEdit }) => {
  const { t } = useTranslation(["common"]);
  const { first_name, last_name, username, email, role, user_id } = user;

  return (
    <form className="form account">
      <div className="form-field field-back comments-title">
        {handleEmpty(first_name)}
      </div>
      <div className="form-field field-back comments-title">
        {handleEmpty(last_name)}
      </div>
      <div className="form-field field-back comments-title">
        {handleEmpty(username)}
      </div>
      <div className="form-field field-back comments-title">
        {handleEmpty(email)}
      </div>
      <div className="form-field field-back comments-title">
        {handleEmpty(role)}
      </div>
      <div className="btns-container">
        <button
          className="btn-form-submit save"
          type="button"
          onClick={handleEdit}
        >
          {t("edit")}
        </button>
        <button
          className="btn-form-submit cancel"
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
