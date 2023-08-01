import style from "./ListBtns.module.css";

const ListBtns = ({
  denyBtnName,
  denyBtnOnClick,
  confirmBtnName,
  confirmBtnOnClick,
  containerClassName = `${style.actionBtns} ${style.games}`,
}) => {
  return (
    <div className={containerClassName}>
      <button
        className={`${style.btn} ${style.green}`}
        onClick={confirmBtnOnClick}
      >
        {confirmBtnName}
      </button>
      <button className={`${style.btn} ${style.red}`} onClick={denyBtnOnClick}>
        {denyBtnName}
      </button>
    </div>
  );
};

export default ListBtns;
