import "../css/backlink.css";
import { Link } from "react-router-dom";

function Backlink({ items }) {
  return (
    <div className="wrapper-backlink">
      {items.map((item, index) => (
        <div key={index} className="wrapper-backlink-item">
          {index > 0 && <span className="backlink-arrow-right">{">"}</span>}

          {index === items.length - 1 ? (
            <span className="backlink-name">{item.name}</span>
          ) : (
            <Link to={item.path} className="backlink-link">
              {item.name}
            </Link>
          )}
        </div>
      ))}
    </div>
  );
}
export default Backlink;
