import { useFormik } from "formik";
import * as Yup from "yup";
import { editUser } from "../service";
import { alertMessage } from "../utils";
import { useTranslation } from "react-i18next";
import style from "./ViewEditUsers.module.css";

const EditUser = ({ i, user, handleCancel, fetchUsers }) => {
  const { t } = useTranslation(["profile", "common"]);
  const { user_id, first_name, last_name, username, email, role } = user;

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
          className={style.editField}
          name="firstName"
          placeholder={t("profile:firstname")}
          variant="outlined"
          type="text"
          value={formik.values.firstName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.firstName && formik.errors.firstName ? (
          <p className="helper-text">{formik.errors.firstName}</p>
        ) : null}
      </td>

      <td>
        <input
          className={style.editField}
          id="lastName"
          placeholder={t("profile:lastname")}
          variant="outlined"
          type="text"
          value={formik.values.lastName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.lastName && formik.errors.lastName ? (
          <p className="helper-text">{formik.errors.lastName}</p>
        ) : null}
      </td>
      <td>{formik.values.username}</td>
      <td>{formik.values.email}</td>
      <td>
        <input
          className={style.editField}
          id="role"
          placeholder={t("profile:role")}
          variant="outlined"
          type="text"
          value={formik.values.role}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.role && formik.errors.role ? (
          <p className="helper-text">{formik.errors.role}</p>
        ) : null}
      </td>
      <td className={style.actionBtns}>
        <button
          className={`${style.btn} ${style.green}`}
          type="submit"
          onClick={formik.handleSubmit}
        >
          {t("common:save")}
        </button>

        <button
          className={`${style.btn} ${style.red}`}
          type="button"
          onClick={handleCancel}
        >
          {t("common:cancel")}
        </button>
      </td>
    </tr>
  );
};
export default EditUser;
