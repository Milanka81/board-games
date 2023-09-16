import { createPortal } from "react-dom";

const Modal = ({ children }) => {
  return createPortal(
    <div className="modal__overlay">
      <div className="modal">{children}</div>
    </div>,
    document.body
  );
};

export default Modal;
