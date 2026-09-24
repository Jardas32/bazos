import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useBazosContext } from "../context/BazosContext";
import { useNavigate } from "react-router-dom";

function Pridatinzeratsubcategory() {
  const {
    leftBarCategories,
    isLogin,
    isAuth,
    selectSekce,
    setSelectSekce,
    selectSubCategory,
    setSelectSubcategory,
    allSubcategorie,
  } = useBazosContext();
  const { slug, subcategoryslug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuth) {
      navigate("/oblibene");
    }
  }, [isAuth]);

  return (
    <div className="wrapper-categorypage">
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
        <h4>Podat inzerát - vyberte kategory</h4>

        <div className="wrapper-sekce-subcategories">
          {allSubcategorie.map((c) => (
            <div
              onClick={() => setSelectSubcategory(c.id)}
              key={c.id}
              className="wrapper-card-subcategories-pridat"
            >
              <Link
                to={`/pridat-inzerat/${slug}/${c.slug}`}
                className="link-subcategories-pridat"
              >
                <h1 className="categories-title-pridat">{c.name}</h1>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default Pridatinzeratsubcategory;
