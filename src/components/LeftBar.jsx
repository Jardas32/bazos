import "../css/leftbar.css";
import { Link } from "react-router-dom";

function LeftBar({ subCategories, slug, subcategoryslug }) {
  return (
    <div className="wrapper-subcategorie">
      <h3 className="text-categories">Kategorie</h3>

      <ul className="list-category">
        {subCategories.map((subcategory) => (
          <li key={subcategory.id} className="subcategory">
            <Link
              to={`/${slug}/${subcategory.slug}`}
              className={`link-category ${
                subcategory.slug === subcategoryslug ? "active" : ""
              }`}
            >
              {subcategory.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default LeftBar;
