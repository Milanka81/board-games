import "../css/Table.css";
import { alertDelete } from "../utils";
import { deleteUser } from "../service";
import { useTranslation } from "react-i18next";

const ViewUsers = ({ user, i, handleEdit, fetchUsers }) => {
  const { t } = useTranslation(["profile", "common"]);
  console.log(user);
  return (
    <tr>
      <td>{i + 1}</td>
      <td>{user.first_name}</td>
      <td>{user.last_name}</td>
      <td>{user.username}</td>
      <td>{user.email}</td>
      <td>{user.role}</td>
      <td className="action-btns">
        <button
          className="btn game-btn save"
          onClick={(e) => {
            handleEdit(e, user);
          }}
        >
          {t("common:edit")}
        </button>

        <button
          className="btn game-btn cancel"
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
