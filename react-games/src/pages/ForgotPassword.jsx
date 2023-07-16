import { useFormik } from "formik";
import * as Yup from "yup";
import { forgotPassword } from "../service";
import { alertMessage } from "../utils";
import { useTranslation } from "react-i18next";
const ForgotPassword = () => {
  const { t } = useTranslation(["profile", "common"]);
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Required"),
    }),
    onSubmit: (values) => {
      forgotPassword(values)
        .then((res) => {
          res.data.error
            ? alertMessage(res.data.icon, res.data.message)
            : window.location.replace(`${res.data}`);
        })
        .catch((err) => console.log(err));
    },
  });

  return (
    <div className=" container ">
      <form className="form" onSubmit={formik.handleSubmit}>
        <h5 className="form-title">{t("profile:forgotpassword")}?</h5>
        <div className="fields">
          <input
            className="form-field"
            id="email"
            placeholder={t("profile:enternewpassword")}
            variant="outlined"
            type="text"
            value={formik.values.email}
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
export default ForgotPassword;