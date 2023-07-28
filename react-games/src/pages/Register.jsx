import { useFormik } from "formik";
import * as Yup from "yup";
import { register } from "../service";
import { useNavigate } from "react-router-dom";
import { alertMessage } from "../utils";
import { useTranslation } from "react-i18next";
import style from "./Form.module.css";

const Register = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(["profile", "common"]);
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      username: "",
      password: "",
      email: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .max(20, "Must be less than 20 chars")
        .required("Required"), //react i18n next
      lastName: Yup.string()
        .max(20, "Must be less than 20 chars")
        .required("Required"),
      username: Yup.string()
        .max(20, "Must be less than 20 chars")
        .required("Required"),
      password: Yup.string().required("Required"),
      email: Yup.string().email("Invalid email").required("Required"),
    }),
    onSubmit: (values) => {
      register(values).then((res) => {
        if (res.data.error)
          return alertMessage(res.data.icon, res.data.message);

        alertMessage(res.data.icon, res.data.message);
        navigate("/login");
      });
    },
  });

  return (
    <div className={style.container}>
      <form className={style.form} onSubmit={formik.handleSubmit}>
        <h5 className={style.title}>{t("profile:register")}</h5>
        <div className={style.fields}>
          <input
            className={style.editFormField}
            id="firstName"
            placeholder={t("profile:firstname")}
            variant="outlined"
            type="text"
            value={formik.values.firstName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.firstName && formik.errors.firstName ? (
            <p className={style.helperText}>{formik.errors.firstName}</p>
          ) : null}
        </div>
        <div className={style.fields}>
          <input
            className={style.editFormField}
            id="lastName"
            placeholder={t("profile:lastname")}
            variant="outlined"
            type="text"
            value={formik.values.lastName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.lastName && formik.errors.lastName ? (
            <p className={style.helperText}>{formik.errors.lastName}</p>
          ) : null}
        </div>
        <div className={style.fields}>
          <input
            className={style.editFormField}
            id="username"
            placeholder={t("profile:username")}
            variant="outlined"
            type="text"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.username && formik.errors.username ? (
            <p className={style.helperText}>{formik.errors.username}</p>
          ) : null}
        </div>
        <div className={style.fields}>
          <input
            className={style.editFormField}
            id="password"
            placeholder={t("profile:password")}
            variant="outlined"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.password && formik.errors.password ? (
            <p className={style.helperText}>{formik.errors.password}</p>
          ) : null}
        </div>
        <div className={style.fields}>
          <input
            className={style.editFormField}
            id="email"
            placeholder={t("profile:email")}
            variant="outlined"
            type="text"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.email && formik.errors.email ? (
            <p className={style.helperText}>{formik.errors.email}</p>
          ) : null}
        </div>
        <button className={style.btnFormSubmit} type="submit">
          {t("common:submit")}
        </button>
        <button
          type="button"
          className={style.btnLink}
          onClick={() => {
            navigate("/login");
          }}
        >
          {t("common:cancel")}
        </button>
      </form>
    </div>
  );
};
export default Register;
