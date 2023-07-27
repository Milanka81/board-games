import { useEffect, useRef } from "react";
import style from "./SearchBar.module.css";

const SearchBar = ({ handleChange, placeholder, className }) => {
  const inputEl = useRef(null);

  useEffect(() => {
    inputEl.current.focus();
  }, []);

  return (
    <div className={className}>
      <input
        className={style.searchBar}
        type="text"
        placeholder={placeholder}
        onChange={handleChange}
        ref={inputEl}
      />
    </div>
  );
};
export default SearchBar;
