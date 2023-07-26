import { useState, useEffect } from "react";
import board from "../img/board.jpg";
import Account from "../components/Account";
import Comment from "../components/Comment";
import { getLoggedUser, getUserComments } from "../service";
import EditAccount from "../components/EditAccount";
import Preferences from "./Preferences";
import { useContext } from "react";
import { AuthContext } from "../App";
import { useTranslation } from "react-i18next";
import style from "./Profile.module.css";

const Profile = () => {
  const { t } = useTranslation(["game", "common"]);
  const { admin } = useContext(AuthContext);
  const [isAdmin] = admin;
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState("");
  const [myComments, setMyComments] = useState("");
  const [showAccount, setShowAccount] = useState(true);
  const [showPreferences, setShowPreferences] = useState(false);

  const fetchComments = () => {
    getUserComments().then((res) => setMyComments(res.data));
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchUser = () => {
    getLoggedUser().then((res) => setUser(res.data[0]));
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleEdit = () => {
    setUserId(user.user_id);
  };

  return (
    <div>
      {!isAdmin && (
        <div className={style.flex}>
          <div className={`${style.flex} ${style.margin}`}>
            <button
              className={style.btn}
              onClick={() => {
                setShowAccount(() => !showAccount);
                setShowPreferences(false);
                setUserId(null);
              }}
            >
              {t("common:account")}
            </button>

            <button
              className={style.btn}
              onClick={() => {
                setShowPreferences(() => !showPreferences);
                setUserId(null);
              }}
            >
              {t("common:preferences")}
            </button>
          </div>
        </div>
      )}
      <div className={style.gameContainer}>
        <div className={`${style.gameInfo} ${style.centar}`}>
          {showPreferences ? (
            <>
              <h3 className={style.title}>{t("common:preferences")}:</h3>
              {userId ? (
                <Preferences
                  componentState="isEditing"
                  className={`${style.form} ${style.account}`}
                  fieldClassName={style.editFormField}
                  handleCancel={() => setUserId(null)}
                />
              ) : (
                <Preferences
                  componentState="isViewing"
                  className={`${style.form} ${style.account}`}
                  fieldClassName={style.formField}
                  handleEdit={handleEdit}
                />
              )}
            </>
          ) : (
            <>
              <h3 className={style.title}>{t("common:accountinfo")}:</h3>
              {userId ? (
                <EditAccount
                  user={user}
                  fetchUser={fetchUser}
                  handleCancel={() => setUserId(null)}
                />
              ) : (
                <Account user={user} handleEdit={handleEdit} />
              )}
            </>
          )}
        </div>

        {myComments[0] ? (
          <Comment
            refreshComments={fetchComments}
            comments={myComments}
            isAdmin={isAdmin}
          />
        ) : (
          <div className={style.gameOpinions}>
            <div className={style.cover}>
              <img className={style.coverImg} alt="game" src={board} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default Profile;
