import { editComment, deleteComment, postComment } from "../service";
import { alertDelete, alertMessage } from "../utils";
import { useState } from "react";
import board from "../img/board.jpg";
import { useTranslation } from "react-i18next";
import ListBtns from "./ListBtns";
import { useAuth } from "./AuthContext";

const Comment = ({ comments, refetch, gameId }) => {
  const { admin } = useAuth();
  const [isAdmin] = admin;
  const { t } = useTranslation(["game", "common"]);
  const [comment, setComment] = useState("");
  const [myComment, setMyComment] = useState("");
  const [commentId, setCommentId] = useState(null);
  const loggedUser = JSON.parse(localStorage.getItem("user"));

  const handleSubmit = () => {
    if (!myComment) return alertMessage("warning", `${t("game:addcomment")}`);
    editComment(myComment.slice(0, 299), commentId).then((res) => {
      setCommentId(null);
      refetch();
    });
  };
  const handleChange = (e) => {
    setComment(e.target.value);
  };

  const addComment = (e) => {
    e.preventDefault();
    if (!comment) return alertMessage("warning", "Add your comment!");
    postComment(gameId, comment.slice(0, 299)).then((res) => {
      refetch();
      setComment("");
    });
  };

  if ((isAdmin && !gameId) || (!gameId && !comments?.length))
    return (
      <div className="image">
        <img className="image__coverImg" alt="game" src={board} />
      </div>
    );

  const title = gameId ? `${t("game:comments")}` : `${t("game:myComments")}`;

  return (
    <div className="u-flex u-column u-gap-s ">
      {!isAdmin && gameId && (
        <form className="u-flex u-mb-s u-gap-s" onSubmit={(e) => addComment(e)}>
          <div className="u-flex u-column u-width u-gap-xs">
            <input
              type="text"
              value={comment}
              className="comment__input"
              onChange={handleChange}
              placeholder={t("game:addcomment")}
              maxLength="300"
            />
            <p className="u-align-self-right">{comment.length}/300</p>
          </div>
          <button
            className="btn__navBtn-small btn--green u-align-self-center"
            type="submit"
          >
            {t("common:submit")}
          </button>
        </form>
      )}
      {comments?.length ? <h3 className="title u-mb-s">{title}:</h3> : null}
      {comments?.map((el) => (
        <div
          className="grid-2-cols u-mb-s u-padding u-shadow"
          key={el.comment_id}
        >
          <strong className="comment__info">{el.username || el.game}</strong>
          <span className="comment__info ">
            {el.comm_date.slice(0, 10)}

            <span className="u-ml-s">{el.comm_date.slice(11, 16)}</span>
          </span>
          <div className="u-flex grid-2-cols__row">
            {commentId === el.comment_id ? (
              <>
                <textarea
                  defaultValue={myComment}
                  maxLength={300}
                  rows="3"
                  className="comment__input-edit"
                  name="comment"
                  onChange={(e) => setMyComment(e.target.value)}
                ></textarea>
                {(el.user_id === loggedUser.user_id || isAdmin) && (
                  <ListBtns
                    denyBtnName={t("common:cancel")}
                    denyBtnOnClick={() => setCommentId(null)}
                    confirmBtnName={t("common:save")}
                    confirmBtnOnClick={handleSubmit}
                  />
                )}
              </>
            ) : (
              <>
                <div className="comment__text" data-testid="comment-text">
                  {el.comm}
                </div>

                {(el.user_id === loggedUser.user_id || isAdmin) && (
                  <ListBtns
                    denyBtnName={t("common:delete")}
                    denyBtnOnClick={() =>
                      alertDelete(deleteComment, el.comment_id, refetch)
                    }
                    confirmBtnName={t("common:edit")}
                    confirmBtnOnClick={() => {
                      setCommentId(el.comment_id);
                      setMyComment(el.comm);
                    }}
                  />
                )}
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
export default Comment;
