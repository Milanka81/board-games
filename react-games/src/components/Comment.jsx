import { editComment, deleteComment } from "../service";
import { alertDelete, alertMessage } from "../utils";
import { useState } from "react";
import { useTranslation } from "react-i18next";
const Comment = ({ refreshComments, comments, isAdmin }) => {
  const { t } = useTranslation(["game", "common"]);
  const [myComment, setMyComment] = useState("");
  const [commentId, setCommentId] = useState(null);
  const loggedUser = JSON.parse(localStorage.getItem("user"));

  const handleSubmit = () => {
    if (!myComment) return alertMessage("warning", `${t("game:addcomment")}`);
    editComment(myComment, commentId)
      .then((res) => {
        setCommentId(null);
        refreshComments();
      })
      .catch((err) => alertMessage("error", err.message));
  };

  return (
    <div className="game-opinions">
      <div className="user-comment">
        <h3 className="form-title">{t("game:comments")}:</h3>
        {comments.map((el) => (
          <div className="game-comments" key={el.comment_id}>
            <p className="comment-username">{el.username || el.game}</p>
            <span className="comment-date">
              {el.comm_date.slice(0, 10)}
              <strong className="margin-left"> </strong>
              {el.comm_date.slice(11, 16)}
            </span>
            {commentId === el.comment_id ? (
              <>
                <textarea
                  defaultValue={myComment}
                  maxLength={300}
                  rows="3"
                  className="form-field"
                  name="comment"
                  onChange={(e) => setMyComment(e.target.value)}
                ></textarea>
                {(el.user_id === loggedUser.user_id || isAdmin) && (
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
                )}
              </>
            ) : (
              <>
                <div className="comment-text">{el.comm}</div>

                {(el.user_id === loggedUser.user_id || isAdmin) && (
                  <>
                    <button
                      className="btn game-btn save"
                      onClick={() => {
                        setCommentId(el.comment_id);
                        setMyComment(el.comm);
                      }}
                    >
                      {t("common:edit")}
                    </button>
                    <button
                      className="btn game-btn cancel"
                      type="btn"
                      onClick={() =>
                        alertDelete(
                          deleteComment,
                          el.comment_id,
                          refreshComments
                        )
                      }
                    >
                      {t("common:delete")}
                    </button>{" "}
                  </>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
export default Comment;
