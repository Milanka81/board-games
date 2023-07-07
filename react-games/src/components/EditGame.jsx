import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { editGame, getGame, getGameComments, editComment } from "../service";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import { handleEmpty, imgSrc, alertMessage } from "../utils";
import { useTranslation } from "react-i18next";

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
    getGame(id)
      .then((res) => {
        setGame(res.data);
      })
      .catch((err) => console.log(err));
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    getGameComments(id)
      .then((res) => setComments(res.data))
      .catch((err) => console.log(err));
  }, [id]);

  const refreshComments = () => {
    getGameComments(id)
      .then((res) => setComments(res.data))
      .catch((err) => console.log(err));
  };
  const handleSubmit = () => {
    if (comment) {
      editComment(comment, commentId)
        .then((res) => {
          setCommentId(null);
          refreshComments();
        })
        .catch((err) => alertMessage("error", err.message));
    } else {
      alertMessage("warning", "Add your comment!");
    }
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
      if (isEditingImg) {
        const formData = new FormData();
        formData.append("values", JSON.stringify(values));
        formData.append("id", id);
        formData.append("img", values.img);

        editGame(formData)
          .then((res) => {
            console.log(res);
            navigate("/games");
          })
          .catch((err) => alertMessage("error", err.message));
      } else {
        const { img, ...dataGame } = values;

        editGame({ ...dataGame, id })
          .then((res) => {
            navigate("/games");
          })
          .catch((err) => alertMessage("error", err.message));
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
        className="icon-btn navigation-btn"
        onClick={() => {
          navigate(-1);
        }}
      >
        ⬅️ {t("common:back")}
      </button>
      <div className="container">
        <div className=" game-container ">
          <form
            className="game-info"
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
                  className="game-img1"
                  src={handleEmpty(imgSrc(formik.values.img))}
                  alt={handleEmpty(formik.values.name)}
                />
              ) : (
                <img
                  className="game-img1"
                  src={handleEmpty(URL.createObjectURL(formik.values.img))}
                  alt={handleEmpty(formik.values.name)}
                />
              )}

              {isEditingImg && (
                <button
                  className="btn game-btn rgs"
                  onClick={() => {
                    setIsEditingImg(false);
                    formik.setFieldValue("img", game.img);
                  }}
                >
                  {t("common:cancel")}
                </button>
              )}
            </div>
            <div className="game-details">
              <div className="fields">
                <p className="grid-field">
                  <label className="label">{t("game:name")}:</label>
                  <input
                    className="form-field-name"
                    name="name"
                    id="name"
                    placeholder="Name"
                    variant="outlined"
                    type="text"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.name && formik.errors.name ? (
                    <p className="helper-text">{formik.errors.name}</p>
                  ) : null}
                </p>
              </div>
              <div className="fields">
                <p className="grid-field">
                  <label className="label">{t("game:minplayers")}:</label>
                  <input
                    className="form-field"
                    id="minPlayers"
                    placeholder="Minimum Players"
                    variant="outlined"
                    type="text"
                    value={formik.values.minPlayers}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.minPlayers && formik.errors.minPlayers ? (
                    <p className="helper-text">{formik.errors.minPlayers}</p>
                  ) : null}
                </p>
              </div>
              <div className="fields">
                <p className="grid-field">
                  <label className="label">{t("game:maxplayers")}:</label>
                  <input
                    className="form-field"
                    id="maxPlayers"
                    placeholder="Maximum Players"
                    variant="outlined"
                    type="text"
                    value={formik.values.maxPlayers}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.maxPlayers && formik.errors.maxPlayers ? (
                    <p className="helper-text">{formik.errors.maxPlayers}</p>
                  ) : null}
                </p>
              </div>
              <div className="fields">
                <p className="grid-field">
                  <label className="label">{t("game:year")}:</label>
                  <input
                    className="form-field"
                    id="year"
                    placeholder="year"
                    variant="outlined"
                    type="text"
                    value={formik.values.year}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.year && formik.errors.year ? (
                    <p className="helper-text">{formik.errors.year}</p>
                  ) : null}
                </p>
              </div>
              <div className="fields">
                <p className="grid-field">
                  <label className="label">{t("game:playingtime")}:</label>
                  <input
                    className="form-field"
                    id="gameLength"
                    placeholder="Game Length"
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
                </p>
              </div>
              <div className="fields">
                <p className="grid-field">
                  <label className="label">{t("game:artist")}:</label>
                  <input
                    className="form-field"
                    name="artist"
                    id="artist"
                    placeholder="Artist"
                    variant="outlined"
                    type="text"
                    value={formik.values.artist}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.artist && formik.errors.artist ? (
                    <p className="helper-text">{formik.errors.artist}</p>
                  ) : null}
                </p>
              </div>
              <div className="fields">
                <p className="grid-field">
                  <label className="label">{t("game:designer")}:</label>
                  <input
                    className="form-field"
                    name="designer"
                    id="designer"
                    placeholder="Designer"
                    variant="outlined"
                    type="text"
                    value={formik.values.designer}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.designer && formik.errors.designer ? (
                    <p className="helper-text">{formik.errors.designer}</p>
                  ) : null}
                </p>
              </div>
              <div className="fields">
                <p className="grid-field">
                  <label className="label">{t("game:category")}:</label>
                  <input
                    className="form-field"
                    name="category"
                    id="category"
                    placeholder="Category"
                    variant="outlined"
                    type="text"
                    value={formik.values.category}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.category && formik.errors.category ? (
                    <p className="helper-text">{formik.errors.category}</p>
                  ) : null}
                </p>
              </div>
              <div className="btns-container">
                <button
                  className="btn-form-submit cancel"
                  type="button"
                  onClick={() => navigate(-2)}
                >
                  {t("common:cancel")}
                </button>
                <button
                  className="btn-form-submit save"
                  type="submit"
                  onClick={formik.handleSubmit}
                >
                  {t("common:save")}
                </button>
              </div>
            </div>
          </form>
          <div className="game-opinions">
            <div className="user-comment">
              <h3 className="comments-title">Comments:</h3>
              {comments.map((el) => (
                <div className="game-comments" key={el.comment_id}>
                  <p className="comment-username">{el.username}</p>
                  <span className="comment-date">
                    {el.comm_date.slice(0, 10)}
                  </span>
                  {commentId === el.comment_id ? (
                    <>
                      <textarea
                        defaultValue={comment}
                        cols="40"
                        rows="5"
                        className="form-field"
                        name="comment"
                        onChange={(e) => setComment(e.target.value)}
                      ></textarea>
                      <div className="comment-btns">
                        <button
                          className="btn game-btn save"
                          type="submit"
                          onClick={handleSubmit}
                        >
                          {t("common:save")}
                        </button>
                        <button
                          className="btn game-btn cancel"
                          type="submit"
                          onClick={() => setCommentId(null)}
                        >
                          {t("common:cancel")}
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="comment-text">{el.comm}</div>
                      <button
                        className="btn game-btn save"
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
      </div>
    </>
  );
};
export default EditGame;
