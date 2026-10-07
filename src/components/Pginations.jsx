import "../css/paginations.css";
import { useBazosContext } from "../context/BazosContext";

function Paginations() {
  const { pages, currentPage, setCurrentPage } = useBazosContext();

  return (
    <div className="wrapper-paginations">
      <div className="paginations">
        <span>Stránka:</span>

        {Array.from({ length: pages }).map((_, index) => (
          <button
            onClick={() => setCurrentPage(index + 1)}
            key={index}
            className={`btn-page ${currentPage === index + 1 ? "current" : ""}`}
          >
            {index + 1}
          </button>
        ))}

        {pages > 1 && (
          <button
            onClick={() =>
              setCurrentPage((prev) => (prev < pages ? prev + 1 : prev))
            }
            className="btn-next-page"
          >
            Další
          </button>
        )}
      </div>
    </div>
  );
}

export default Paginations;
