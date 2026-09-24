import "../css/oblibene.css";
import { Link } from "react-router-dom";
import { useBazosContext } from "../context/BazosContext";
import Register from "../components/Register";
import Login from "../components/Login";
import { useParams } from "react-router-dom";

function Oblibene() {
  const { subcategoryslug } = useParams();
  const { leftBarCategories, isLogin, isAuth, myFavorites } = useBazosContext();

  return (
    <div className="wrapper-oblibenepage">
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

      {isAuth ? (
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
                  <div className="wrapper-oblibene-img">
                    <img
                      className="oblibene-img"
                      src={
                        favorite?.images
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
                    <span>
                      {Number(favorite.price).toLocaleString("cs-CZ", {
                        style: "currency",
                        currency: "CZK",
                        maximumFractionDigits: 0,
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <>{isLogin ? <Login /> : <Register />}</>
      )}
    </div>
  );
}

export default Oblibene;
