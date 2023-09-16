const ListBtns = ({
  denyBtnName,
  denyBtnOnClick,
  confirmBtnName,
  confirmBtnOnClick,
  type,
  containerClassName = "u-flex u-gap-xs u-column u-align-center ",
}) => {
  return (
    <div className={containerClassName}>
      <button
        type={type}
        className="btn__navBtn-small btn--green"
        onClick={confirmBtnOnClick}
      >
        {confirmBtnName}
      </button>
      <button className="btn__navBtn-small btn--red" onClick={denyBtnOnClick}>
        {denyBtnName}
      </button>
    </div>
  );
};

export default ListBtns;
