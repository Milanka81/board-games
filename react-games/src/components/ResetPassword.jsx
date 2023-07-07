import { useFormik } from "formik";
import * as Yup from "yup";
import { alertMessage } from "../utils";
import { resetPassword } from "../service";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
const ResetPassword = () => {
  const { t } = useTranslation(["profile", "common"]);
  const navigate = useNavigate();
  const { id, token } = useParams();
  const formik = useFormik({
    initialValues: {
      password: "",
    },
    validationSchema: Yup.object({
      password: Yup.string().required("Required"),
    }),
    onSubmit: (values) => {
      resetPassword(id, token, values).then((res) => {
        res.data.error
          ? alertMessage(res.data.icon, res.data.message)
          : navigate("/");
      });
    },
  });

  return (
    <div className=" container ">
      <form className="form" onSubmit={formik.handleSubmit}>
        <h5 className="form-title">{t("profile:resetpassword")}</h5>
        <div className="fields">
          <input
            className="form-field"
            id="password"
            placeholder={t("profile:enternewpassword")}
            variant="outlined"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </div>
        <button className="btn-form-submit" type="submit">
          {t("common:submit")}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
