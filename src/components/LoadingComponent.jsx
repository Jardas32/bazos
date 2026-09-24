import "../css/loading.css";
import { BarLoader } from "react-spinners";

function LoadingComponent() {
  return (
    <div className="wrapper-loading">
      <BarLoader color="gray" width={120} height={4} className="load" />
    </div>
  );
}

export default LoadingComponent;
