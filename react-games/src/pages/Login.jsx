import "../css/UserHomePage.css";
import { useFormik } from "formik";
import axios from "axios";
import * as Yup from "yup";
//import Axios from "axios";
import { login } from "../service";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../App";
import { alertMessage } from "../utils";
import { useTranslation } from "react-i18next";

const Login = () => {
  const { t } = useTranslation(["profile", "common"]);
  const navigate = useNavigate();
  const { auth, admin } = useContext(AuthContext);
  const [, setIsAdmin] = admin;
  const [, setIsAuth] = auth;
  const [error, setError] = useState("");

  // Axios.defaults.withCredentials = true;

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
      login(values)
        .then((res) => {
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
        })
        .catch((err) => alertMessage("error", err.message));
    },
  });

  return (
    <div className=" container ">
      <form className="form" onSubmit={formik.handleSubmit}>
        <h5 className="form-title">{t("profile:login")}</h5>
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
        <button className="btn-form-submit" type="submit">
          {t("profile:log-in")}
        </button>
        {error && <p>{error}</p>}
        <div className="flex">
          <button
            type="button"
            className="btn-link rgs"
            onClick={() => {
              navigate("/forgot-password");
            }}
          >
            {t("profile:forgotpassword")}?
          </button>
          <button
            type="button"
            className="btn-link rgs"
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
