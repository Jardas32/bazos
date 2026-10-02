import "../css/cardcategories.css";
import { Link } from "react-router-dom";
import { useBazosContext } from "../context/BazosContext";

function Cardcategories({ category }) {
  const { setSelectRubrika } = useBazosContext();

  return (
    <div className="wrapper-card-categories">
      <Link
        onClick={() => setSelectRubrika(category.slug)}
        to={`/${category.slug}`}
        className="link-subcategories"
      >
        <h1 className="categories-title">{category.name}</h1>
        <img
          className="categories-icon"
          src={category.icon}
          alt="categories-icon"
        />
      </Link>
    </div>
  );
}

export default Cardcategories;
