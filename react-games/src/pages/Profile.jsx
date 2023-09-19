import { useState } from "react";
import Account from "../components/Account";
import Comment from "../components/Comment";
import EditAccount from "../components/EditAccount";
import Preferences from "./Preferences";
import { useTranslation } from "react-i18next";
import { useAuth } from "../components/AuthContext";
import { useGetUserComments } from "../hooks/comment";
import { useGetLoggedUser } from "../hooks/loggedUser";

const Profile = () => {
  const { t } = useTranslation(["game", "common"]);
  const { admin } = useAuth();
  const [isAdmin] = admin;
  const [userId, setUserId] = useState(null);
  const [showAccount, setShowAccount] = useState(true);
  const [showPreferences, setShowPreferences] = useState(false);

  const { data: user, refetch: fetchUser } = useGetLoggedUser();

  const { data: myComments, refetch } = useGetUserComments(user?.user_id);

  const handleEdit = () => {
    setUserId(user?.user_id);
  };

  return (
    <div>
      {!isAdmin && (
        <div className="flex u-justify-start u-mt-s">
          <button
            className="btn__navBtn-small u-m-xs"
            onClick={() => {
              setShowAccount(() => !showAccount);
              setShowPreferences(false);
              setUserId(null);
            }}
          >
            {t("common:account")}
          </button>

          <button
            className="btn__navBtn-small u-m-xs"
            onClick={() => {
              setShowPreferences(() => !showPreferences);
              setUserId(null);
            }}
          >
            {t("common:preferences")}
          </button>
        </div>
      )}
      <div className="gridContainer">
        <div className="flexContainer u-ml-m u-align-center ">
          {showPreferences ? (
            <>
              <h3 className="title">{t("common:preferences")}:</h3>
              {userId ? (
                <Preferences
                  componentState="isEditing"
                  handleCancel={() => setUserId(null)}
                />
              ) : (
                <Preferences
                  componentState="isViewing"
                  fieldClassName="form__inputField"
                  handleEdit={handleEdit}
                />
              )}
            </>
          ) : (
            <>
              <h3 className="title">{t("common:accountinfo")}:</h3>
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
        <div className="flexContainer u-relative">
          <Comment comments={myComments} refetch={refetch} />
        </div>
      </div>
    </div>
  );
};
export default Profile;
