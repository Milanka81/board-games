import style from "./FormBtns.module.css";
const FormBtns = ({
  denyBtnName,
  denyBtnOnClick,
  confirmBtnName,
  confirmBtnOnClick,
  type = "button",
  disabled,
}) => {
  return (
    <div className={style.btnsContainer}>
      {!disabled && (
        <button
          className={`${style.btnFormSubmit} ${style.red}`}
          type="button"
          onClick={denyBtnOnClick}
        >
          {denyBtnName}
        </button>
      )}
      <button
        className={`${style.btnFormSubmit} ${style.green}`}
        type={type}
        onClick={confirmBtnOnClick}
      >
        {confirmBtnName}
      </button>
    </div>
  );
};

export default FormBtns;
