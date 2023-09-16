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
import FormBtns from "../components/FormBtns";

const Preferences = ({
  className = "form",
  componentState,
  title,
  fieldClassName = "form__inputField-edit",
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
        {title && <h3 className="title u-mb-s">{title}</h3>}
        <div className="form__fieldsContainer">
          <p className="form__gridField">
            <label htmlFor="numberOfPlayers">
              {t("game:numberofplayers")}:
            </label>
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
        <div className="form__fieldsContainer">
          <div className="form__gridField">
            <label htmlFor="gameLengthFrom">{t("game:playingtime")}:</label>
            <div className="form__flexInput">
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
              <label htmlFor="gameLengthTo"> - </label>
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
        <div className="form__fieldsContainer">
          <p className="form__gridField">
            <label htmlFor="artist">{t("game:artist")}:</label>
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
        <div className="form__fieldsContainer">
          <p className="form__gridField">
            <label htmlFor="designer">{t("game:designer")}:</label>
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
        <div className="form__fieldsContainer">
          <div className="form__gridField">
            <label htmlFor="category">{t("game:category")}:</label>
            {!isViewing && (
              <Multiselect
                id="category"
                className="form__select u-mb-xs"
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
              <label htmlFor="addCategory">{t("game:addcategory")}:</label>
            )}
            <input
              className={`${fieldClassName} u-mb-s`}
              name="category"
              id="addCategory"
              variant="outlined"
              type="text"
              value={formik.values.category}
              onChange={formik.handleChange}
              disabled={isViewing}
            />
          </div>
        </div>
        {isAdding ? (
          <FormBtns
            denyBtnName={t("common:cancel")}
            denyBtnOnClick={handleCancel}
            disabled={true}
            confirmBtnName={btnSubmitName()}
            confirmBtnOnClick={formik.handleSubmit}
          />
        ) : (
          <FormBtns
            denyBtnName={t("common:cancel")}
            denyBtnOnClick={handleCancel}
            confirmBtnName={btnSubmitName()}
            confirmBtnOnClick={formik.handleSubmit}
          />
        )}
      </form>
      {!isAdding && (
        <div className="form__subscriptionContainer">
          <em>{t("game:subscriptionmessage")}</em>
          <p>
            <label htmlFor="subscribed">
              <strong>{subscribeInfo()}</strong>
            </label>
            <input
              className="form__checkbox"
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
      )}
    </>
  );
};
export default Preferences;
