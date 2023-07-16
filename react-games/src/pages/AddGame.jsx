import { useFormik } from "formik";
import { addGame } from "../service";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { alertMessage } from "../utils";
import { useTranslation } from "react-i18next";

const AddGame = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(["game", "common"]);
  const formik = useFormik({
    initialValues: {
      img: "",
      name: "",
      minPlayers: "",
      maxPlayers: "",
      year: "",
      gameLength: "",
      artist: "",
      designer: "",
      category: "",
    },
    onSubmit: (values) => {
      addGame(values)
        .then((res) => navigate("/games"))
        .catch((err) => alertMessage("error", err.message));
    },
    validationSchema: Yup.object().shape({
      img: Yup.mixed().required("Image is required"),
      name: Yup.string().required("Name is required"),
      minPlayers: Yup.number()
        .integer()
        .required("Minimum number of players is required"),
      maxPlayers: Yup.number()
        .integer()
        .min(
          Yup.ref("minPlayers"),
          "Maximum number of players shouldn't be less than minimum number of players"
        )
        .required("Maximum number of players is required"),
      year: Yup.number().integer().required("Year is required"),
      gameLength: Yup.string().required("Game length is required"),
    }),
  });

  return (
    <div className=" container ">
      <form
        className="form"
        onSubmit={formik.handleSubmit}
        encType="multipart/form-data"
      >
        <h5 className="form-title">{t("game:addnewgame")}</h5>
        <div className="user-comment">
          <input
            name="img"
            id="img"
            type="file"
            accept="image/*"
            onChange={(e) => formik.setFieldValue("img", e.target.files[0])}
          />
          {formik.values.img && (
            <img
              className="add-img"
              src={URL.createObjectURL(formik.values.img)}
              alt="game"
            />
          )}
          {formik.touched.img && formik.errors.img
            ? alertMessage("warning", `${formik.errors.img}`)
            : null}
        </div>
        <div className="fields">
          <input
            className="form-field"
            name="name"
            id="name"
            placeholder={t("game:name")}
            variant="outlined"
            type="text"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.name && formik.errors.name ? (
            <p className="helper-text">{formik.errors.name}</p>
          ) : null}
        </div>
        <div className="fields">
          <input
            className="form-field"
            id="minPlayers"
            placeholder={t("game:minplayers")}
            variant="outlined"
            type="text"
            value={formik.values.minPlayers}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.minPlayers && formik.errors.minPlayers ? (
            <p className="helper-text">{formik.errors.minPlayers}</p>
          ) : null}
        </div>
        <div className="fields">
          <input
            className="form-field"
            id="maxPlayers"
            placeholder={t("game:maxplayers")}
            variant="outlined"
            type="text"
            value={formik.values.maxPlayers}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.maxPlayers && formik.errors.maxPlayers ? (
            <p className="helper-text">{formik.errors.maxPlayers}</p>
          ) : null}
        </div>
        <div className="fields">
          <input
            className="form-field"
            id="year"
            placeholder={t("game:year")}
            variant="outlined"
            type="text"
            value={formik.values.year}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.year && formik.errors.year ? (
            <p className="helper-text">{formik.errors.year}</p>
          ) : null}
        </div>
        <div className="fields">
          <input
            className="form-field"
            id="gameLength"
            placeholder={t("game:playingtime")}
            variant="outlined"
            type="number"
            min={1}
            value={formik.values.gameLength}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.gameLength && formik.errors.gameLength ? (
            <p className="helper-text">{formik.errors.gameLength}</p>
          ) : null}
        </div>
        <div className="fields">
          <input
            className="form-field"
            name="artist"
            id="artist"
            placeholder={t("game:artist")}
            variant="outlined"
            type="text"
            value={formik.values.artist}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.artist && formik.errors.artist ? (
            <p className="helper-text">{formik.errors.artist}</p>
          ) : null}
        </div>
        <div className="fields">
          <input
            className="form-field"
            name="designer"
            id="designer"
            placeholder={t("game:designer")}
            variant="outlined"
            type="text"
            value={formik.values.designer}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.designer && formik.errors.designer ? (
            <p className="helper-text">{formik.errors.designer}</p>
          ) : null}
        </div>
        <div className="fields">
          <input
            className="form-field"
            name="category"
            id="category"
            placeholder={t("game:category")}
            variant="outlined"
            type="text"
            value={formik.values.category}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.category && formik.errors.category ? (
            <p className="helper-text">{formik.errors.category}</p>
          ) : null}
        </div>
        <button
          className="btn-form-submit save"
          type="submit"
          onClick={formik.handleSubmit}
        >
          {t("common:save")}
        </button>
        <button
          className="btn-form-submit cancel"
          type="button"
          onClick={() => navigate(-1)}
        >
          {t("common:cancel")}
        </button>
      </form>
    </div>
  );
};
export default AddGame;