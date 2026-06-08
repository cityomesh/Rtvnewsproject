import React from "react";
import { useNavigate } from "react-router-dom";

const CancelButton = () => {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      className="btn btn-light me-3"
      onClick={() => navigate("/dashboard")}
    >
      Cancel
    </button>
  );
};

export default CancelButton;
