import { useFormik } from "formik";
import { useState } from "react";
import { editGame } from "../service";
import { useParams } from "react-router-dom";
import * as Yup from "yup";
import { handleEmpty, imgSrc } from "../utils";
import { useTranslation } from "react-i18next";
import FormBtns from "../components/FormBtns";

const EditGame = ({ game, isSuccess, refreshGame, setIsEdit }) => {
  const { t } = useTranslation(["game", "common", "home"]);

  const { id } = useParams();

  const [isEditingImg, setIsEditingImg] = useState(false);

  const {
    img,
    name,
    min_players,
    max_players,
    year,
    game_length,
    artist,
    designer,
    category,
  } = game;

  const formik = useFormik({
    initialValues: {
      img: img,
      name: name,
      minPlayers: min_players,
      maxPlayers: max_players,
      year: year,
      gameLength: game_length,
      artist: handleEmpty(artist),
      designer: handleEmpty(designer),
      category: handleEmpty(category),
    },
    onSubmit: (values) => {
      if (!isEditingImg) {
        const { img, ...dataGame } = values;

        editGame({ ...dataGame, id }).then((res) => {
          setIsEdit(false);
          refreshGame();
        });
      } else {
        const formData = new FormData();
        formData.append("values", JSON.stringify(values));
        formData.append("id", id);
        formData.append("img", values.img);

        editGame(formData).then((res) => {
          setIsEdit(false);
          refreshGame();
        });
      }
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required(`${t("game:namerequired")}`),
      minPlayers: Yup.number()
        .integer()
        .required(`${t("game:minnumberplayersrequired")}`),
      maxPlayers: Yup.number()
        .integer()
        .min(Yup.ref("minPlayers"), `${t("game:minnumberplayersrequired")}`)
        .required(`${t("game:maxgraterthanmin")}`),
      year: Yup.number()
        .integer()
        .required(`${t("game:yearrequired")}`),
      gameLength: Yup.string().required(`${t("game:gamelengthrequired")}`),
    }),
  });

  if (isSuccess)
    return (
      <form
        className="flexContainer"
        onSubmit={formik.handleSubmit}
        encType="multipart/form-data"
      >
        <div className="form u-width">
          <div className="image__flex">
            <label htmlFor="img" className="game__customFileUpload">
              <input
                name="img"
                id="img"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  setIsEditingImg(true);
                  formik.setFieldValue("img", e.target.files[0]);
                }}
              />
              {t("common:editimage")}
            </label>
            {!isEditingImg ? (
              <div className="game__imgContainer game__imgContainer-edit">
                <img
                  className="game__img-edit"
                  src={handleEmpty(imgSrc(formik.values.img))}
                  alt={handleEmpty(formik.values.name)}
                />
              </div>
            ) : (
              <div className="game__imgContainer game__imgContainer-edit">
                <img
                  className="game__img-edit"
                  src={handleEmpty(URL.createObjectURL(formik.values.img))}
                  alt={handleEmpty(formik.values.name)}
                />
                <button
                  className="btn__link"
                  onClick={() => {
                    setIsEditingImg(false);
                    formik.setFieldValue("img", game.img);
                  }}
                >
                  {t("common:dropimage")}
                </button>
              </div>
            )}
          </div>
          <div className="u-flex u-column u-gap-s">
            <p className="form__gridField">
              <label htmlFor="name" className="u-font-label">
                {t("game:name")}:
              </label>
              <input
                className="form__inputField-edit"
                name="name"
                id="name"
                variant="outlined"
                type="text"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.name && formik.errors.name ? (
                <p className="helperText">{formik.errors.name}</p>
              ) : null}
            </p>

            <p className="form__gridField">
              <label htmlFor="minPlayers" className="u-font-label">
                {t("game:minplayers")}:
              </label>
              <input
                className="form__inputField-edit"
                id="minPlayers"
                variant="outlined"
                type="text"
                value={formik.values.minPlayers}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.minPlayers && formik.errors.minPlayers ? (
                <p className="helperText">{formik.errors.minPlayers}</p>
              ) : null}
            </p>
            <p className="form__gridField">
              <label htmlFor="maxPlayers" className="u-font-label">
                {t("game:maxplayers")}:
              </label>
              <input
                className="form__inputField-edit"
                id="maxPlayers"
                variant="outlined"
                type="text"
                value={formik.values.maxPlayers}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.maxPlayers && formik.errors.maxPlayers ? (
                <p className="helperText">{formik.errors.maxPlayers}</p>
              ) : null}
            </p>
            <p className="form__gridField">
              <label htmlFor="year" className="u-font-label">
                {t("game:year")}:
              </label>
              <input
                className="form__inputField-edit"
                id="year"
                variant="outlined"
                type="text"
                value={formik.values.year}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.year && formik.errors.year ? (
                <p className="helperText">{formik.errors.year}</p>
              ) : null}
            </p>
            <p className="form__gridField">
              <label htmlFor="gameLength" className="u-font-label">
                {t("game:playingtime")}:
              </label>
              <input
                className="form__inputField-edit"
                id="gameLength"
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
            </p>
            <p className="form__gridField">
              <label htmlFor="artist" className="u-font-label">
                {t("game:artist")}:
              </label>
              <input
                className="form__inputField-edit"
                name="artist"
                id="artist"
                variant="outlined"
                type="text"
                value={formik.values.artist}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.artist && formik.errors.artist ? (
                <p className="helperText">{formik.errors.artist}</p>
              ) : null}
            </p>
            <p className="form__gridField">
              <label htmlFor="designer" className="u-font-label">
                {t("game:designer")}:
              </label>
              <input
                className="form__inputField-edit"
                name="designer"
                id="designer"
                variant="outlined"
                type="text"
                value={formik.values.designer}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.designer && formik.errors.designer ? (
                <p className="helperText">{formik.errors.designer}</p>
              ) : null}
            </p>
            <p className="form__gridField">
              <label htmlFor="category" className="u-font-label">
                {t("game:category")}:
              </label>
              <input
                className="form__inputField-edit"
                name="category"
                id="category"
                variant="outlined"
                type="text"
                value={formik.values.category}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.category && formik.errors.category ? (
                <p className="helperText">{formik.errors.category}</p>
              ) : null}
            </p>
            <FormBtns
              denyBtnName={t("common:cancel")}
              denyBtnOnClick={() => setIsEdit(false)}
              confirmBtnName={t("common:save")}
              confirmBtnOnClick={formik.handleSubmit}
              type="submit"
            />
          </div>
        </div>
      </form>
    );
};
export default EditGame;
