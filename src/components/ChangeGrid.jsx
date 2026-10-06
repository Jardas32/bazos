import "../css/changegrid.css";
import { changeBtn } from "../data/data";
import { useBazosContext } from "../context/BazosContext";

function ChangeGrid() {
  const { setChangeGrid, selectBtnChange, setSelectBtnChange } =
    useBazosContext();

  return (
    <div className="wrapper-changegrid">
      {changeBtn.map((btn) => (
        <div
          key={btn.id}
          onClick={() => {
            setSelectBtnChange(btn);
            setChangeGrid((prev) => {
              if (btn.id === 2) return false;

              return !prev;
            });
          }}
          className={`changeBox ${
            selectBtnChange?.id === btn.id ? "active" : ""
          }`}
        >
          <img src={btn.icon} alt="icon" />
        </div>
      ))}
    </div>
  );
}
export default ChangeGrid;
