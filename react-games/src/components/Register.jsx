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
      register(values)
        .then((res) => {
          if (res.data.error)
            return alertMessage(res.data.icon, res.data.message);

          alertMessage(res.data.icon, res.data.message);
          navigate("/login");
        })
        .catch((err) => alertMessage("error", err.message));
    },
  });

  return (
    <div className=" container ">
      <form className="form" onSubmit={formik.handleSubmit}>
        <h5 className="form-title">{t("profile:register")}</h5>
        <div className="fields">
          <input
            className="form-field"
            id="firstName"
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
        </div>
        <div className="fields">
          <input
            className="form-field"
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
        </div>
        <div className="fields">
          <input
            className="form-field"
            id="username"
            placeholder={t("profile:username")}
            variant="outlined"
            type="text"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.username && formik.errors.username ? (
            <p className="helper-text">{formik.errors.username}</p>
          ) : null}
        </div>
        <div className="fields">
          <input
            className="form-field"
            id="password"
            placeholder={t("profile:password")}
            variant="outlined"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.password && formik.errors.password ? (
            <p className="helper-text">{formik.errors.password}</p>
          ) : null}
        </div>
        <div className="fields">
          <input
            className="form-field"
            id="email"
            placeholder={t("profile:email")}
            variant="outlined"
            type="text"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.email && formik.errors.email ? (
            <p className="helper-text">{formik.errors.email}</p>
          ) : null}
        </div>
        <button className="btn-form-submit" type="submit">
          {t("common:submit")}
        </button>
        <button
          type="button"
          className="btn-link rgs"
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
