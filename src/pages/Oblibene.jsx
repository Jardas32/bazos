import "../css/oblibene.css";
import { Link } from "react-router-dom";
import { useBazosContext } from "../context/BazosContext";
import { useParams } from "react-router-dom";
import LoadingComponent from "../components/LoadingComponent";

function Oblibene() {
  const { subcategoryslug } = useParams();
  const { setQuaryRubrika, leftBarCategories, myFavorites, authLoading } =
    useBazosContext();

  if (authLoading) {
    return <LoadingComponent />;
  }

  myFavorites.map((f) => console.log(f));

  return (
    <div className="wrapper-oblibenepage">
      <div className="wrapper-subcategorie">
        <h3 className="text-categories">Inzerce</h3>

        <ul className="list-category">
          {leftBarCategories.map((category) => (
            <li key={category.id} className="subcategory">
              <Link
                onClick={() => setQuaryRubrika(category.slug)}
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

      <div className="wrapper-oblibene">
        <div className="wrapper-oblibnee-top">
          Oblíbené inzeráty: {myFavorites.length}
        </div>

        {myFavorites.length === 0 ? (
          <h4>Oblíbené je prázdné.</h4>
        ) : (
          <div className="wrapper-oblibene-grids">
            {myFavorites.map((favorite) => (
              <div key={favorite.id} className="wrapper-oblibene-card">
                <Link
                  to={`/${favorite.category_slug}/${favorite.subcategory_slug}/inzerat/${favorite.id}`}
                  className="oblibene-link-inzeratpage"
                >
                  <div className="wrapper-oblibene-img">
                    <img
                      className="oblibene-img"
                      src={
                        favorite?.images[0].image_url !== null
                          ? `${favorite?.images[0].image_url}`
                          : "./images/empty.png"
                      }
                      alt="img"
                    />
                  </div>

                  <div className="wrapper-oblibene-body">
                    <h4 className="oblibene-title">{favorite.title}</h4>
                    <p className="oblibene-description">
                      {favorite.description.slice(0, 60)}...
                    </p>

                    <div className="wrapper-city-price">
                      <span className="oblibene-city">{favorite.city}</span>
                      <span className="oblibene-price">
                        {Number(favorite.price).toLocaleString("cs-CZ", {
                          style: "currency",
                          currency: "CZK",
                          maximumFractionDigits: 0,
                        })}
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Oblibene;
