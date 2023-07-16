import { alertDelete } from "../utils";
import { deleteUser } from "../service";
import { useTranslation } from "react-i18next";
import style from "./ViewEditUsers.module.css";

const ViewUsers = ({ user, i, handleEdit, fetchUsers }) => {
  const { t } = useTranslation(["profile", "common"]);

  return (
    <tr>
      <td>{i + 1}</td>
      <td>{user.first_name}</td>
      <td>{user.last_name}</td>
      <td>{user.username}</td>
      <td>{user.email}</td>
      <td>{user.role}</td>
      <td className={style.actionBtns}>
        <button
          className={`${style.btn} ${style.green}`}
          onClick={(e) => {
            handleEdit(e, user);
          }}
        >
          {t("common:edit")}
        </button>

        <button
          className={`${style.btn} ${style.red}`}
          onClick={(e) => {
            e.preventDefault();
            alertDelete(deleteUser, user.user_id, fetchUsers);
          }}
        >
          {t("common:delete")}
        </button>
      </td>
    </tr>
  );
};
export default ViewUsers;
