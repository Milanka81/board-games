import { useEffect, useRef } from "react";

const SearchBar = ({ handleChange, placeholder, className }) => {
  const inputEl = useRef(null);

  useEffect(() => {
    inputEl.current.focus();
  }, []);

  return (
    <div className={className}>
      <input
        className="search__searchBar u-mt-s u-mb-s"
        type="text"
        placeholder={placeholder}
        onChange={handleChange}
        ref={inputEl}
      />
    </div>
  );
};
export default SearchBar;
