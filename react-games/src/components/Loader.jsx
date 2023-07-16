import style from "./Loader.module.css";

const Loader = ({ message }) => {
  return (
    <div className={style.loader}>
      <span className={style.spinner}>🎲</span>
      <h3>{message}</h3>
    </div>
  );
};

export default Loader;
