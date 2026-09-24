import "../css/pridatinzerat.css";
import { Link, useParams } from "react-router-dom";
import { useBazosContext } from "../context/BazosContext";

function PridatInzerat() {
  const { subcategoryslug } = useParams();
  const {
    leftBarCategories,
    isLogin,
    isAuth,
    selectSekce,
    setSelectSekce,
    selectSubCategory,
    setSelectSubcategory,
  } = useBazosContext();

  return (
    <div className="wrapper-pridatinzerat-page">
      <div className="wrapper-subcategorie">
        <h3 className="text-categories">Inzerce</h3>

        <ul className="list-category">
          {leftBarCategories.map((category) => (
            <li key={category.id} className="subcategory">
              <Link
                to={`/${category.slug}`}
                className={`link-category ${
                  category.slug === subcategoryslug ? "active" : ""
                }`}
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="wrapper-vyber-sekce">
        <h4>Podat inzerát - vyberte sekci</h4>

        <div className="wrapper-sekce">
          {leftBarCategories.map((c) => (
            <div
              onClick={() => setSelectSekce(c.slug)}
              key={c.id}
              className="wrapper-card-categories-pridat"
            >
              <Link
                to={`/pridat-inzerat/${c.slug}`}
                className="link-categories-pridat"
              >
                <h1 className="categories-title-pridat">{c.name}</h1>
                <img
                  className="categories-icon-pridat"
                  src={c.icon}
                  alt="categories-icon"
                />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PridatInzerat;
