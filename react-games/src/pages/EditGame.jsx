import { useFormik } from "formik";
import { useCallback, useEffect, useState } from "react";
import { editGame, getGame, getGameComments, editComment } from "../service";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import { handleEmpty, imgSrc, alertMessage } from "../utils";
import { useTranslation } from "react-i18next";
import style from "./ViewEditGame.module.css";

const EditGame = () => {
  const { t } = useTranslation(["game", "common", "home"]);
  const navigate = useNavigate();
  const { id } = useParams();
  const [game, setGame] = useState({});
  const [comments, setComments] = useState([]);
  const [isEditingImg, setIsEditingImg] = useState(false);
  const [commentId, setCommentId] = useState(null);
  const [comment, setComment] = useState("");

  useEffect(() => {
    getGame(id).then((res) => {
      setGame(res.data);
    });
  }, [id]);

  const refreshComments = useCallback(() => {
    getGameComments(id).then((res) => setComments(res.data));
  }, [id]);

  useEffect(() => {
    refreshComments(id);
  }, [refreshComments, id]);

  const handleSubmit = () => {
    if (!comment) return alertMessage("warning", "Add your comment!");

    editComment(comment, commentId).then((res) => {
      setCommentId(null);
      refreshComments();
    });
  };

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
    enableReinitialize: true,

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
          navigate("/games");
        });

        const formData = new FormData();
        formData.append("values", JSON.stringify(values));
        formData.append("id", id);
        formData.append("img", values.img);

        editGame(formData).then((res) => {
          navigate("/games");
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
    <>
      <button
        className={style.navBtn}
        onClick={() => {
          navigate(-1);
        }}
      >
        ⬅️ {t("common:back")}
      </button>

      <div className={style.gameContainer}>
        <form
          className={style.gameInfo}
          onSubmit={formik.handleSubmit}
          encType="multipart/form-data"
        >
          <div>
            {/* <h5 className="form-title">EDIT GAME</h5> */}

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
                <label className={style.label}>{t("game:name")}:</label>
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
                <label className={style.label}>{t("game:minplayers")}:</label>
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
                <label className={style.label}>{t("game:maxplayers")}:</label>
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
                <label className={style.label}>{t("game:year")}:</label>
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
                <label className={style.label}>{t("game:playingtime")}:</label>
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
                <label className={style.label}>{t("game:artist")}:</label>
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
                <label className={style.label}>{t("game:designer")}:</label>
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
                <label className={style.label}>{t("game:category")}:</label>
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
            <div className={style.btnsContainer}>
              <button
                className={`${style.btnFormSubmit} ${style.red}`}
                type="button"
                onClick={() => navigate(-2)}
              >
                {t("common:cancel")}
              </button>
              <button
                className={`${style.btnFormSubmit} ${style.green}`}
                type="submit"
                onClick={formik.handleSubmit}
              >
                {t("common:save")}
              </button>
            </div>
          </div>
        </form>
        <div className={style.gameOpinions}>
          <div className={style.userComment}>
            <h3 className={style.title}>Comments:</h3>
            {comments.map((el) => (
              <div className={style.gameComments} key={el.comment_id}>
                <p className={style.commentUsername}>{el.username}</p>
                <span className={style.commentDate}>
                  {el.comm_date.slice(0, 10)}
                </span>
                {commentId === el.comment_id ? (
                  <>
                    <textarea
                      defaultValue={comment}
                      cols="40"
                      rows="5"
                      className={style.formField}
                      name="comment"
                      onChange={(e) => setComment(e.target.value)}
                    ></textarea>
                    <div className={style.btnsContainer}>
                      <button
                        className={`${style.btn} ${style.green}`}
                        type="submit"
                        onClick={handleSubmit}
                      >
                        {t("common:save")}
                      </button>
                      <button
                        className={`${style.btn} ${style.red}`}
                        type="submit"
                        onClick={() => setCommentId(null)}
                      >
                        {t("common:cancel")}
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className={style.commentText}>{el.comm}</div>
                    <button
                      className={`${style.btn} ${style.green}`}
                      onClick={() => {
                        setCommentId(el.comment_id);
                        setComment(el.comm);
                      }}
                    >
                      {t("common:edit")}
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
export default EditGame;
