const Loader = ({ message }) => {
  return (
    <div className="loader">
      <span className="spinner">🎲</span>
      <h3>{message}</h3>
    </div>
  );
};

export default Loader;
