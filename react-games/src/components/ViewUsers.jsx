import { alertDelete } from "../utils";
import { deleteUser } from "../service";
import { useTranslation } from "react-i18next";
import ListBtns from "./ListBtns";

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
      <td>
        <ListBtns
          denyBtnName={t("common:delete")}
          denyBtnOnClick={(e) => {
            e.preventDefault();
            alertDelete(deleteUser, user.user_id, fetchUsers);
          }}
          confirmBtnName={t("common:edit")}
          confirmBtnOnClick={(e) => {
            handleEdit(e, user);
          }}
        />
      </td>
    </tr>
  );
};
export default ViewUsers;
