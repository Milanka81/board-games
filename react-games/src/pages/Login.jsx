import { useFormik } from "formik";
import axios from "axios";
import * as Yup from "yup";
import { login } from "../service";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../App";
import { useTranslation } from "react-i18next";
import style from "./Form.module.css";

const Login = () => {
  const { t } = useTranslation(["profile", "common"]);
  const navigate = useNavigate();
  const { auth, admin } = useContext(AuthContext);
  const [, setIsAdmin] = admin;
  const [, setIsAuth] = auth;
  const [error, setError] = useState("");

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Required"),
      password: Yup.string().required("Required"),
    }),
    onSubmit: (values) => {
      login(values).then((res) => {
        if (!res.data.result) return setError(res.data.message);
        const { auth, token } = res.data;
        setIsAuth(auth);

        const user = res.data.result[0];

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        const isAdmin = user.role === "admin";
        setIsAdmin(isAdmin);
        axios.defaults.headers.common = { jwt: token };
        navigate("/");
      });
    },
  });

  return (
    <div className={style.container}>
      <form className={style.form} onSubmit={formik.handleSubmit}>
        <h5 className={style.title}>{t("profile:login")}</h5>
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
        <button className={style.btnFormSubmit} type="submit">
          {t("profile:log-in")}
        </button>
        {error && <p>{error}</p>}
        <div className={style.flex}>
          <button
            type="button"
            className={style.btnLink}
            onClick={() => {
              navigate("/forgot-password");
            }}
          >
            {t("profile:forgotpassword")}?
          </button>
          <button
            type="button"
            className={style.btnLink}
            onClick={() => {
              navigate("/register");
            }}
          >
            {t("profile:register")}
          </button>
        </div>
      </form>
    </div>
  );
};
export default Login;
