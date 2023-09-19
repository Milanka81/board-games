import { useFormik } from "formik";
import * as Yup from "yup";
import { editUser, deleteUser } from "../service";
import { alertMessage, alertDelete } from "../utils";
import { useTranslation } from "react-i18next";
import ListBtns from "./ListBtns";

const User = ({
  i,
  user,
  handleCancel,
  handleEdit,
  fetchUsers,
  isEditing,
  isViewing,
}) => {
  const { t } = useTranslation(["profile", "common"]);
  const { user_id, first_name, last_name, username, email, role } = user;

  const fieldClassName = isEditing
    ? "user__field user__field-edit"
    : "user__field ";

  const formik = useFormik({
    initialValues: {
      firstName: first_name,
      lastName: last_name,
      username: username,
      email: email,
      role: role,
    },
    onSubmit: (values) => {
      editUser(values, user_id).then((res) => {
        if (res.data.error) {
          alertMessage(res.data.icon, res.data.message);
        }
        fetchUsers();
        handleCancel();
      });
    },

    validationSchema: Yup.object({
      firstName: Yup.string()
        .max(20, "Must be less than 20 chars")
        .required("Required"), //react i18n next
      lastName: Yup.string()
        .max(20, "Must be less than 20 chars")
        .required("Required"),
    }),
  });

  return (
    <tr>
      <td>{i + 1}</td>
      <td>
        <input
          className={fieldClassName}
          name="firstName"
          placeholder={t("profile:firstname")}
          variant="outlined"
          type="text"
          value={formik.values.firstName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          disabled={isViewing}
        />
        {formik.touched.firstName && formik.errors.firstName ? (
          <p className="helperText">{formik.errors.firstName}</p>
        ) : null}
      </td>

      <td>
        <input
          className={fieldClassName}
          id="lastName"
          placeholder={t("profile:lastname")}
          variant="outlined"
          type="text"
          value={formik.values.lastName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          disabled={isViewing}
        />
        {formik.touched.lastName && formik.errors.lastName ? (
          <p className="helperText">{formik.errors.lastName}</p>
        ) : null}
      </td>
      <td>
        <input
          className="user__field"
          id="username"
          placeholder={t("profile:username")}
          variant="outlined"
          type="text"
          value={formik.values.username}
          disabled
        />
      </td>
      <td>
        <input
          className="user__field"
          id="email"
          placeholder={t("profile:email")}
          variant="outlined"
          type="text"
          value={formik.values.email}
          disabled
        />
      </td>

      <td>
        <input
          className={`${fieldClassName} u-field-width`}
          id="role"
          placeholder={t("profile:role")}
          variant="outlined"
          type="text"
          value={formik.values.role}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          disabled={isViewing}
        />
        {formik.touched.role && formik.errors.role ? (
          <p className="helperText">{formik.errors.role}</p>
        ) : null}
      </td>
      <td>
        {isEditing ? (
          <ListBtns
            denyBtnName={t("common:cancel")}
            denyBtnOnClick={handleCancel}
            confirmBtnName={t("common:save")}
            confirmBtnOnClick={formik.handleSubmit}
          />
        ) : (
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
        )}
      </td>
    </tr>
  );
};
export default User;
