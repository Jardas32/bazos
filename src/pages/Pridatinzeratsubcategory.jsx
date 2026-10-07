import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useBazosContext } from "../context/BazosContext";
import { useNavigate } from "react-router-dom";
import Backlink from "../components/BackLink";

function Pridatinzeratsubcategory() {
  const {
    leftBarCategories,
    isAuth,
    setSelectSubcategory,
    allSubcategorie,
    setAllsubcategorie,
    setQuaryRubrika,
    API_URL,
  } = useBazosContext();
  const { slug, subcategorySlug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const getSubCategories = async () => {
      try {
        const res = await fetch(
          `${API_URL}/api/subcategories/category/${slug}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await res.json();

        console.log(data);

        setAllsubcategorie(data);
      } catch (err) {
        console.log(err);
      }
    };
    getSubCategories();
  }, [slug]);

  useEffect(() => {
    if (!isAuth) {
      navigate("/prihlaseni");
    }
  }, [isAuth]);

  const items = [
    {
      name: "Hlavní stránka",
      path: "/",
    },
    {
      name: `${slug}`,
      path: `/pridat-inzerat`,
    },
    {
      name: "kategory",
    },
  ];

  return (
    <div className="wrapper-categorypage">
      <Backlink items={items} />

      <div className="wrapper-categorypage-content">
        <div className="wrapper-subcategorie">
          <h3 className="text-categories">Inzerce</h3>

          <ul className="list-category">
            {leftBarCategories.map((category) => (
              <li key={category.id} className="subcategory">
                <Link
                  onClick={() => setQuaryRubrika(category.slug)}
                  to={`/${category.slug}`}
                  className={`link-category ${
                    category.slug === subcategorySlug ? "active" : ""
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
    </div>
  );
}
export default Pridatinzeratsubcategory;
