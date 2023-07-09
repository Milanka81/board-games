import { useEffect, useRef } from "react";

const SearchBar = ({ handleChange, placeholder }) => {
  const inputEl = useRef(null);

  useEffect(() => {
    inputEl.current.focus();
  }, []);

  return (
    <input
      className="search-bar"
      type="text"
      placeholder={placeholder}
      onChange={handleChange}
      ref={inputEl}
    />
  );
};
export default SearchBar;
