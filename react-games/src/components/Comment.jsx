import { editComment, deleteComment } from "../service";
import { alertDelete, alertMessage } from "../utils";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import style from "./Comment.module.css";
import ListBtns from "./ListBtns";
import { useAuth } from "./AuthContext";

const Comment = ({ refreshComments, comments }) => {
  const { admin } = useAuth();
  const [isAdmin] = admin;
  const { t } = useTranslation(["game", "common"]);
  const [myComment, setMyComment] = useState("");
  const [commentId, setCommentId] = useState(null);
  const loggedUser = JSON.parse(localStorage.getItem("user"));

  const handleSubmit = () => {
    if (!myComment) return alertMessage("warning", `${t("game:addcomment")}`);
    editComment(myComment, commentId).then((res) => {
      setCommentId(null);
      refreshComments();
    });
  };

  return (
    <div className={style.gameOpinions}>
      <div className={style.userComment}>
        {comments.length ? (
          <h3 className={style.title}>{t("game:comments")}:</h3>
        ) : null}
        {comments.map((el) => (
          <div className={style.gameComments} key={el.comment_id}>
            <p className={style.commentUsername}>{el.username || el.game}</p>
            <span className={style.commentDate}>
              {el.comm_date.slice(0, 10)}
              <strong className={style.marginLeft}> </strong>
              {el.comm_date.slice(11, 16)}
            </span>
            {commentId === el.comment_id ? (
              <>
                <textarea
                  defaultValue={myComment}
                  maxLength={300}
                  rows="3"
                  className={style.inputField}
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
                  // <div className={style.commentBtns}>
                  //   <button
                  //     className={`${style.btn} ${style.green}`}
                  //     type="submit"
                  //     onClick={handleSubmit}
                  //   >
                  //     {t("common:save")}
                  //   </button>
                  //   <button
                  //     className={`${style.btn} ${style.red}`}
                  //     type="submit"
                  //     onClick={() => setCommentId(null)}
                  //   >
                  //     {t("common:cancel")}
                  //   </button>
                  // </div>
                )}
              </>
            ) : (
              <>
                <div className={style.commentText}>{el.comm}</div>

                {(el.user_id === loggedUser.user_id || isAdmin) && (
                  <ListBtns
                    denyBtnName={t("common:delete")}
                    denyBtnOnClick={() =>
                      alertDelete(deleteComment, el.comment_id, refreshComments)
                    }
                    confirmBtnName={t("common:edit")}
                    confirmBtnOnClick={() => {
                      setCommentId(el.comment_id);
                      setMyComment(el.comm);
                    }}
                    containerClassName={style.flex}
                  />
                  /* <>
                  <button
                      className={`${style.btn} ${style.green}`}
                      onClick={() => {
                        setCommentId(el.comment_id);
                        setMyComment(el.comm);
                      }}
                    >
                      {t("common:edit")}
                    </button>
                    <button
                      className={`${style.btn} ${style.red}`}
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
                  </> */
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
