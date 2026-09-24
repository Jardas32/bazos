import "../css/cardcategories.css";
import { Link } from "react-router-dom";

function Cardcategories({ category }) {
  return (
    <div className="wrapper-card-categories">
      <Link to={`/${category.slug}`} className="link-subcategories">
        <h1 className="categories-title">{category.name}</h1>
        <img className="categories-icon" src={category.icon} alt="categories-icon" />
      </Link>
    </div>
  );
}

export default Cardcategories;
