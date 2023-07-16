import { useEffect, useRef } from "react";
import style from "./SearchBar.module.css";

const SearchBar = ({ handleChange, placeholder }) => {
  const inputEl = useRef(null);

  useEffect(() => {
    inputEl.current.focus();
  }, []);

  return (
    <input
      className={style.searchBar}
      type="text"
      placeholder={placeholder}
      onChange={handleChange}
      ref={inputEl}
    />
  );
};
export default SearchBar;
