const FormBtns = ({
  denyBtnName,
  denyBtnOnClick,
  confirmBtnName,
  confirmBtnOnClick,
  type = "button",
  disabled,
}) => {
  return (
    <div className="grid-2-cols">
      {!disabled && (
        <button
          className="btn__submit btn--red"
          type="button"
          onClick={denyBtnOnClick}
        >
          {denyBtnName}
        </button>
      )}
      <button
        className="btn__submit btn--green"
        type={type}
        onClick={confirmBtnOnClick}
      >
        {confirmBtnName}
      </button>
    </div>
  );
};

export default FormBtns;
