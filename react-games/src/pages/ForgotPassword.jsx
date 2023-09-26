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
      forgotPassword(values).then((res) => {
        res.data.error
          ? alertMessage(res.data.icon, res.data.message)
          : window.location.replace(`${res.data}`);
      });
    },
  });

  return (
    <div className="container">
      <form
        className="form u-mt-m form__responsive"
        onSubmit={formik.handleSubmit}
      >
        <h5 className="title u-mb-s">{t("profile:forgotpassword")}?</h5>
        <div className="fieldsContainer">
          <input
            className="form__inputField form__inputField-edit"
            id="email"
            placeholder={t("profile:enternewpassword")}
            variant="outlined"
            type="text"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </div>
        <button className="btn__submit" type="submit">
          {t("common:submit")}
        </button>
      </form>
    </div>
  );
};
export default ForgotPassword;
