import { useFormik } from "formik";
import * as Yup from "yup";
import { register } from "../service";
import { useNavigate } from "react-router-dom";
import { alertMessage } from "../utils";
import { useTranslation } from "react-i18next";

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
    <div className="container">
      <form
        className="form u-mt-m form__responsive"
        onSubmit={formik.handleSubmit}
      >
        <h5 className="title u-mb-s">{t("profile:register")}</h5>
        <div className="fieldsContainer">
          <input
            className="form__inputField-edit"
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
        <div className="form__fieldsContainer">
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
        <div className="form__fieldsContainer">
          <input
            className="form__inputField form__inputField-edit"
            id="username"
            placeholder={t("profile:username")}
            variant="outlined"
            type="text"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.username && formik.errors.username ? (
            <p className="helperText">{formik.errors.username}</p>
          ) : null}
        </div>
        <div className="form__fieldsContainer">
          <input
            className="form__inputField form__inputField-edit"
            id="password"
            placeholder={t("profile:password")}
            variant="outlined"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.password && formik.errors.password ? (
            <p cclassName="helperText">{formik.errors.password}</p>
          ) : null}
        </div>
        <div className="form__fieldsContainer">
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
        <button className="btn__submit" type="submit">
          {t("common:submit")}
        </button>
        <button
          type="button"
          className="btn__link"
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
