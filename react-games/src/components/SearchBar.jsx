const SearchBar = ({ handleChange, placeholder }) => {
  return (
    <input
      className="search-bar"
      type="text"
      placeholder={placeholder}
      onChange={handleChange}
    />
  );
};
export default SearchBar;
