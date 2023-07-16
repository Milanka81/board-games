import ReactFlagsSelect from "react-flags-select";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import style from "./Select.module.css";

const Select = ({ handleLanguageChange }) => {
  const [selected, setSelected] = useState(
    localStorage.getItem("i18nextLng") || ""
  );
  const { i18n } = useTranslation(["common"]);

  const chooseLanguage = (code) => {
    i18n.changeLanguage(code);
    setSelected(code);
  };

  return (
    <ReactFlagsSelect
      className={style.selectField}
      value={localStorage.getItem("i18nextLng")}
      onChange={handleLanguageChange}
      selected={selected}
      onSelect={chooseLanguage}
      countries={["GB", "RU", "RS"]}
      customLabels={{ GB: "English", RU: "русский", RS: "srpski" }}
      placeholder="Language"
    />
  );
};

export default Select;
