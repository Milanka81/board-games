import { useFormik } from "formik";
import * as Yup from "yup";
import { editUser } from "../service";
import { alertMessage } from "../utils";
import { useTranslation } from "react-i18next";
import FormBtns from "./FormBtns";

const EditAccount = ({ user = {}, handleCancel, fetchUser }) => {
  const { t } = useTranslation(["common", "profile"]);
  const { first_name, last_name, username, email, role, user_id } = user;

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
        fetchUser();
        handleCancel();
      });
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .max(20, `${t("profile:lessthan20")}`)
        .required(`${t("profile:required")}`), //react i18n next
      lastName: Yup.string()
        .max(20, `${t("profile:lessthan20")}`)
        .required(`${t("profile:required")}`),
      username: Yup.string()
        .max(20, `${t("profile:lessthan20")}`)
        .required(`${t("profile:required")}`),
      email: Yup.string()
        .email(`${t("profile:invalidemail")}`)
        .required(`${t("profile:required")}`),
    }),
  });

  return (
    <form className="form" onSubmit={formik.handleSubmit}>
      <div className="fieldsContainer">
        <input
          className="form__inputField form__inputField-edit"
          id="firstName"
          placeholder={t("profile:firstname")}
          variant="outlined"
          type="text"
          value={formik.values.firstName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.firstName && formik.errors.firstName ? (
          <p className="helperText">{formik.errors.firstName}</p>
        ) : null}
      </div>
      <div className="fieldsContainer">
        <input
          className="form__inputField form__inputField-edit"
          id="lastName"
          placeholder={t("profile:lastname")}
          variant="outlined"
          type="text"
          value={formik.values.lastName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.lastName && formik.errors.lastName ? (
          <p className="helperText">{formik.errors.lastName}</p>
        ) : null}
      </div>
      <div className="fieldsContainer">
        <input
          className="form__inputField"
          id="username"
          placeholder={t("profile:username")}
          variant="outlined"
          type="text"
          value={formik.values.username}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          disabled
        />
        {formik.touched.username && formik.errors.username ? (
          <p className="helperText">{formik.errors.username}</p>
        ) : null}
      </div>
      <div className="fieldsContainer">
        <input
          className="form__inputField form__inputField-edit"
          id="email"
          placeholder={t("profile:email")}
          variant="outlined"
          type="text"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.email && formik.errors.email ? (
          <p className="helperText">{formik.errors.email}</p>
        ) : null}
      </div>
      <div className="fieldsContainer">
        <input
          className="form__inputField"
          id="role"
          placeholder={t("profile:role")}
          variant="outlined"
          type="text"
          disabled
          defaultValue={formik.values.role}
        />
      </div>
      <FormBtns
        denyBtnName={t("cancel")}
        denyBtnOnClick={handleCancel}
        confirmBtnName={t("save")}
        confirmBtnOnClick={formik.handleSubmit}
        type="submit"
      />
    </form>
  );
};
export default EditAccount;
