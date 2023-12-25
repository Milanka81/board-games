import { useFormik } from "formik";
import { addGame } from "../service";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import FormBtns from "../components/FormBtns";
const AddGame = ({ className, setOpenModal }) => {
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
      addGame(values).then((res) => navigate("/games"));
    },
    validationSchema: Yup.object().shape({
      img: Yup.mixed().required(`${t("game:imagerequired")}`),
      name: Yup.string().required(`${t("game:namerequired")}`),
      minPlayers: Yup.number()
        .integer()
        .required(`${t("game:minnumberplayersrequired")}`),
      maxPlayers: Yup.number()
        .integer()
        .required(`${t("game:maxnumberplayersrequired")}`)
        .min(Yup.ref("minPlayers"), `${t("game:maxgraterthanmin")}`),
      year: Yup.number()
        .integer()
        .required(`${t("game:yearrequired")}`),
      gameLength: Yup.string().required(`${t("game:gamelengthrequired")}`),
    }),
  });
  // console.log(typeof formik.values.img);
  return (
    <>
      <form
        className={className}
        onSubmit={formik.handleSubmit}
        encType="multipart/form-data"
      >
        <h5 className="title">{t("game:addnewgame")}</h5>
        <div className="u-flex u-column u-gap-m">
          <label htmlFor="img" className="game__customFileUpload">
            {t("common:uploadimage")}{" "}
          </label>
          <input
            name="img"
            id="img"
            type="file"
            accept="image/*"
            onChange={(e) => formik.setFieldValue("img", e.target.files[0])}
          />

          {formik.values.img && (
            <img
              className="game__addImg"
              src={URL.createObjectURL(formik.values.img)}
              alt="game"
            />
          )}
          {formik.touched.img && formik.errors.img ? (
            <p className="helperText">{formik.errors.img}</p>
          ) : null}
        </div>
        <div className="u-flex u-column">
          <input
            className="form__inputField-edit u-height-s"
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
            <p className="helperText">{formik.errors.name}</p>
          ) : null}
        </div>
        <div className="u-flex u-column">
          <input
            className="form__inputField-edit u-height-s"
            id="minPlayers"
            placeholder={t("game:minplayers")}
            variant="outlined"
            type="text"
            value={formik.values.minPlayers}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.minPlayers && formik.errors.minPlayers ? (
            <p className="helperText">{formik.errors.minPlayers}</p>
          ) : null}
        </div>
        <div className="u-flex u-column">
          <input
            className="form__inputField-edit u-height-s"
            id="maxPlayers"
            placeholder={t("game:maxplayers")}
            variant="outlined"
            type="text"
            value={formik.values.maxPlayers}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.maxPlayers && formik.errors.maxPlayers ? (
            <p className="helperText">{formik.errors.maxPlayers}</p>
          ) : null}
        </div>
        <div className="u-flex u-column">
          <input
            className="form__inputField-edit u-height-s"
            id="year"
            placeholder={t("game:year")}
            variant="outlined"
            type="text"
            value={formik.values.year}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.year && formik.errors.year ? (
            <p className="helperText">{formik.errors.year}</p>
          ) : null}
        </div>
        <div className="u-flex u-column">
          <input
            className="form__inputField-edit u-height-s"
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
            <p className="helperText">{formik.errors.gameLength}</p>
          ) : null}
        </div>
        <div className="u-flex u-column">
          <input
            className="form__inputField-edit u-height-s"
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
            <p className="helperText">{formik.errors.artist}</p>
          ) : null}
        </div>
        <div className="u-flex u-column">
          <input
            className="form__inputField-edit u-height-s"
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
            <p className="helperText">{formik.errors.designer}</p>
          ) : null}
        </div>
        <div className="u-flex u-column">
          <input
            className="form__inputField-edit u-height-s"
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
            <p className="helperText">{formik.errors.category}</p>
          ) : null}
        </div>
        <FormBtns
          denyBtnName={t("common:cancel")}
          denyBtnOnClick={() => setOpenModal(false)}
          confirmBtnName={t("common:save")}
          confirmBtnOnClick={formik.handleSubmit}
        />
      </form>
    </>
  );
};
export default AddGame;
