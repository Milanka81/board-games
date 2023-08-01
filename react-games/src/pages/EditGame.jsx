import { useFormik } from "formik";
import { useState } from "react";
import { editGame } from "../service";
import { useParams } from "react-router-dom";
import * as Yup from "yup";
import { handleEmpty, imgSrc } from "../utils";
import { useTranslation } from "react-i18next";
import FormBtns from "../components/FormBtns";
import style from "./ViewEditGame.module.css";

const EditGame = ({ game, refreshGame, setIsEdit }) => {
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
    <form
      className={style.gameInfo}
      onSubmit={formik.handleSubmit}
      encType="multipart/form-data"
    >
      <div>
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
        {!isEditingImg ? (
          <img
            className={style.gameImg}
            src={handleEmpty(imgSrc(formik.values.img))}
            alt={handleEmpty(formik.values.name)}
          />
        ) : (
          <img
            className={style.gameImg}
            src={handleEmpty(URL.createObjectURL(formik.values.img))}
            alt={handleEmpty(formik.values.name)}
          />
        )}

        {isEditingImg && (
          <button
            className={style.navBtn}
            onClick={() => {
              setIsEditingImg(false);
              formik.setFieldValue("img", game.img);
            }}
          >
            {t("common:cancel")}
          </button>
        )}
      </div>
      <div className={style.gameDetails}>
        <div className={style.fields}>
          <p className={style.gridField}>
            <label htmlFor="name" className={style.label}>
              {t("game:name")}:
            </label>
            <input
              className={style.formFieldName}
              name="name"
              id="name"
              variant="outlined"
              type="text"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.name && formik.errors.name ? (
              <p className={style.helperText}>{formik.errors.name}</p>
            ) : null}
          </p>
        </div>
        <div className={style.fields}>
          <p className={style.gridField}>
            <label htmlFor="minPlayers" className={style.label}>
              {t("game:minplayers")}:
            </label>
            <input
              className={style.formField}
              id="minPlayers"
              variant="outlined"
              type="text"
              value={formik.values.minPlayers}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.minPlayers && formik.errors.minPlayers ? (
              <p className={style.helperText}>{formik.errors.minPlayers}</p>
            ) : null}
          </p>
        </div>
        <div className={style.fields}>
          <p className={style.gridField}>
            <label htmlFor="maxPlayers" className={style.label}>
              {t("game:maxplayers")}:
            </label>
            <input
              className={style.formField}
              id="maxPlayers"
              variant="outlined"
              type="text"
              value={formik.values.maxPlayers}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.maxPlayers && formik.errors.maxPlayers ? (
              <p className={style.helperText}>{formik.errors.maxPlayers}</p>
            ) : null}
          </p>
        </div>
        <div className={style.fields}>
          <p className={style.gridField}>
            <label htmlFor="year" className={style.label}>
              {t("game:year")}:
            </label>
            <input
              className={style.formField}
              id="year"
              variant="outlined"
              type="text"
              value={formik.values.year}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.year && formik.errors.year ? (
              <p className={style.helperText}>{formik.errors.year}</p>
            ) : null}
          </p>
        </div>
        <div className={style.fields}>
          <p className={style.gridField}>
            <label htmlFor="gameLength" className={style.label}>
              {t("game:playingtime")}:
            </label>
            <input
              className={style.formField}
              id="gameLength"
              variant="outlined"
              type="number"
              min={1}
              value={formik.values.gameLength}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.gameLength && formik.errors.gameLength ? (
              <p className={style.helperText}>{formik.errors.gameLength}</p>
            ) : null}
          </p>
        </div>
        <div className={style.fields}>
          <p className={style.gridField}>
            <label htmlFor="artist" className={style.label}>
              {t("game:artist")}:
            </label>
            <input
              className={style.formField}
              name="artist"
              id="artist"
              variant="outlined"
              type="text"
              value={formik.values.artist}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.artist && formik.errors.artist ? (
              <p className={style.helperText}>{formik.errors.artist}</p>
            ) : null}
          </p>
        </div>
        <div className={style.fields}>
          <p className={style.gridField}>
            <label htmlFor="designer" className={style.label}>
              {t("game:designer")}:
            </label>
            <input
              className={style.formField}
              name="designer"
              id="designer"
              variant="outlined"
              type="text"
              value={formik.values.designer}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.designer && formik.errors.designer ? (
              <p className={style.helperText}>{formik.errors.designer}</p>
            ) : null}
          </p>
        </div>
        <div className={style.fields}>
          <p className={style.gridField}>
            <label htmlFor="category" className={style.label}>
              {t("game:category")}:
            </label>
            <input
              className={style.formField}
              name="category"
              id="category"
              variant="outlined"
              type="text"
              value={formik.values.category}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.category && formik.errors.category ? (
              <p className={style.helperText}>{formik.errors.category}</p>
            ) : null}
          </p>
        </div>
        <FormBtns
          denyBtnName={t("common:cancel")}
          denyBtnOnClick={() => setIsEdit(false)}
          confirmBtnName={t("common:save")}
          confirmBtnOnClick={formik.handleSubmit}
          type="submit"
        />
      </div>
    </form>
  );
};
export default EditGame;
