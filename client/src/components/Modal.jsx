import React from "react";

const Modal = ({ title, onClose, children }) => {
  return (
    <div
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      className="container-fluid vh-100 position-fixed z-1 top-0 d-flex justify-content-center align-items-center"
    >
      <div className="card" style={{ width: "700px" }}>
        <div className="card-header card-title d-flex justify-content-between align-items-center">
          <strong>{title}</strong>
          <button className="btn btn-sm btn-danger" onClick={onClose}>
            X
          </button>
        </div>
        <div className="card-body">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
