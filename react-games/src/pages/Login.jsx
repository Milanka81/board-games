import { useFormik } from "formik";
import axios from "axios";
import * as Yup from "yup";
import { login } from "../service";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../components/AuthContext";

const Login = () => {
  const { t } = useTranslation(["profile", "common"]);
  const navigate = useNavigate();
  const { auth, admin } = useAuth();
  const [, setIsAdmin] = admin;
  const [, setIsAuth] = auth;
  const [error, setError] = useState("");

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required(`${t("profile:required")}`),
      password: Yup.string().required(`${t("profile:required")}`),
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
    <div className="container">
      <form
        className="form u-mt-m form__responsive"
        onSubmit={formik.handleSubmit}
      >
        <h5 className="title u-mb-s">{t("profile:login")}</h5>
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
            <p className="helperText">{formik.errors.password}</p>
          ) : null}
        </div>
        <button className="btn__submit" type="submit">
          {t("profile:log-in")}
        </button>
        {error && <p>{error}</p>}
        <div className="u-flex u-space-between">
          <button
            type="button"
            className="btn__link"
            onClick={() => {
              navigate("/forgot-password");
            }}
          >
            {t("profile:forgotpassword")}?
          </button>
          <button
            type="button"
            className="btn__link"
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
