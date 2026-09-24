import "../css/status.css";
import { IoMdCloseCircle } from "react-icons/io";

function Status({ status, setStatus }) {
  return (
    <div className={`wrapper-status ${status ? "active" : ""}`}>
      <p className="status-text">{status}</p>

      <IoMdCloseCircle onClick={() => setStatus("")} className="btn-closed" />
    </div>
  );
}

export default Status;
