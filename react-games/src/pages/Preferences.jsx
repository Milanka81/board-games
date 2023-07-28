import { useState, useEffect } from "react";

import Multiselect from "multiselect-react-dropdown";
import {
  addPreferences,
  getGameCategories,
  editPreferences,
  getPreferences,
  getSubscription,
  editSubscription,
} from "../service";
import { useFormik } from "formik";
import { refreshPage, handleEmpty } from "../utils";
import { useTranslation } from "react-i18next";
import style from "./Preferences.module.css";

const Preferences = ({
  className,
  componentState,
  title,
  fieldClassName,
  handleCancel,
  handleEdit,
}) => {
  const { t } = useTranslation(["game", "common"]);
  const [preferences, setPreferences] = useState({
    numberOfPlayers: "",
    gameLengthFrom: "",
    gameLengthTo: "",
    artist: "",
    designer: "",
    category: "",
  });
  const [categories, setCategories] = useState([]);
  const [subscribed, setSubscribed] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const loggedUser = JSON.parse(localStorage.getItem("user"));
  const user_id = loggedUser.user_id;

  const isViewing = componentState === "isViewing";
  const isAdding = componentState === "isAdding";

  const subscribeInfo = () =>
    subscribed ? `${t("game:subscribed")}` : `${t("game:unsubscribed")}`;

  const btnSubmitName = () =>
    isViewing ? `${t("common:edit")}` : `${t("common:save")}`;

  const fetchPreferences = () => {
    getPreferences().then((res) => {
      if (!res.data) return;
      const prefData = res.data[0];
      setPreferences({
        numberOfPlayers: handleEmpty(prefData.number_players),
        gameLengthFrom: handleEmpty(prefData.game_length_from),
        gameLengthTo: handleEmpty(prefData.game_length_to),
        artist: handleEmpty(prefData.artist),
        designer: handleEmpty(prefData.designer),
        category: handleEmpty(prefData.category),
      });
    });
  };

  useEffect(() => {
    if (!isAdding) {
      fetchPreferences();
    }
  }, [isAdding]);

  useEffect(() => {
    getSubscription().then((res) => {
      if (res.data[0]?.subscribed) {
        setSubscribed(res.data[0].subscribed);
      }
    });
  }, []);

  const toggleSubscription = () => {
    editSubscription().then(() => setSubscribed(!subscribed));
  };

  useEffect(() => {
    getGameCategories().then((res) => {
      const category = res.data.map((el) => el.category_name);
      setCategories(category);
    });
  }, []);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: preferences,

    onSubmit: (values) => {
      switch (componentState) {
        case "isAdding":
          addPreferences({ values, user_id, selectedCategories }).then(() =>
            refreshPage()
          );
          break;
        case "isEditing":
          editPreferences({ values, user_id, selectedCategories }).then(() => {
            fetchPreferences();
            handleCancel();
          });
          break;
        case "isViewing":
          handleEdit();
          break;
        default:
          break;
      }
    },
  });

  return (
    <>
      <form className={className} onSubmit={formik.handleSubmit}>
        <h3 className={style.title}>{title}</h3>
        <div className={style.fields}>
          <p className={style.gridField}>
            <label className={style.label}>{t("game:numberofplayers")}:</label>
            <input
              className={fieldClassName}
              name="numberOfPlayers"
              id="numberOfPlayers"
              variant="outlined"
              type="number"
              min={1}
              value={formik.values.numberOfPlayers}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={isViewing}
            />
          </p>
        </div>
        <div className={style.fields}>
          <div className={style.gridField}>
            <label className={style.label}>{t("game:playingtime")}:</label>
            <div className={style.flexInput}>
              <input
                className={fieldClassName}
                name="gameLengthFrom"
                id="gameLengthFrom"
                variant="outlined"
                type="number"
                min={1}
                value={formik.values.gameLengthFrom}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={isViewing}
              />{" "}
              <label className={style.label}> - </label>
              <input
                className={fieldClassName}
                name="gameLengthTo"
                id="gameLengthTo"
                variant="outlined"
                type="number"
                min={1}
                value={formik.values.gameLengthTo}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={isViewing}
              />
            </div>
          </div>
        </div>
        <div className={style.fields}>
          <p className={style.gridField}>
            <label className={style.label}>{t("game:artist")}:</label>
            <input
              className={fieldClassName}
              name="artist"
              id="artist"
              variant="outlined"
              type="text"
              value={formik.values.artist}
              onChange={formik.handleChange}
              disabled={isViewing}
            />
          </p>
        </div>
        <div className={style.fields}>
          <p className={style.gridField}>
            <label className={style.label}>{t("game:designer")}:</label>
            <input
              className={fieldClassName}
              name="designer"
              id="designer"
              variant="outlined"
              type="text"
              value={formik.values.designer}
              onChange={formik.handleChange}
              disabled={isViewing}
            />
          </p>
        </div>
        <div className={style.fields}>
          <div className={style.gridField}>
            <label className={style.label}>{t("game:category")}:</label>
            {!isViewing && (
              <Multiselect
                className={style.white}
                options={categories}
                showCheckbox={true}
                showArrow={true}
                isObject={false}
                onRemove={(e) => {
                  setSelectedCategories(e);
                }}
                onSelect={(e) => {
                  setSelectedCategories(e);
                }}
              />
            )}
            {!isViewing && (
              <p className={style.label}>{t("game:addcategory")}:</p>
            )}
            <input
              className={fieldClassName}
              name="category"
              id="category"
              variant="outlined"
              type="text"
              value={formik.values.category}
              onChange={formik.handleChange}
              disabled={isViewing}
            />
          </div>
        </div>

        <div className={style.btnsContainer}>
          {componentState !== "isAdding" && (
            <button
              className={`${style.btnFormSubmit} ${style.red}`}
              type="button"
              onClick={handleCancel}
            >
              {t("common:cancel")}
            </button>
          )}
          <button
            className={`${style.btnFormSubmit} ${style.green}`}
            type="submit"
          >
            {btnSubmitName()}
          </button>
        </div>
      </form>
      <div className={style.subscriptionContainer}>
        <em>{t("game:subscriptionmessage")}</em>
        <p>
          <label className={style.label}>
            <strong>{subscribeInfo()}</strong>
          </label>
          <input
            className={style.checkbox}
            name="subscribed"
            id="subscribed"
            variant="outlined"
            type="checkbox"
            value={subscribed}
            checked={subscribed}
            onChange={toggleSubscription}
          />
        </p>
      </div>
    </>
  );
};
export default Preferences;
