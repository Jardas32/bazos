import "../css/mojeinzeraty.css";
import { Link, useParams } from "react-router-dom";
import { useBazosContext } from "../context/BazosContext";
import { IoMdCloseCircle } from "react-icons/io";
import emptyImg from "/images/empty.png";

function Mojeinzeraty() {
  const { subcategoryslug } = useParams();
  const {
    leftBarCategories,
    isLogin,
    isAuth,
    me,
    logout,
    myAds,
    handleAdsDelete,
    deleteAcount,
  } = useBazosContext();

  return (
    <div className="wrapper-mojeinzeraty">
      <div className="wrapper-subcategorie">
        <h3 className="text-categories">Inzerce</h3>

        <ul className="list-category">
          {leftBarCategories?.map((category) => (
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

      <div className="profile">
        <div className="wrapper-eddit">
          <h4 className="myads">Moje inzeráty: {myAds?.length}</h4>
        </div>

        <h4 className="uzivatel">Uživatel:</h4>

        {me ? (
          <div className="wrapper-profile-info">
            <div className="profile-group">
              <span>E-mail:</span>
              <span>{me?.email}</span>
            </div>
            <div className="profile-group">
              <span>Name:</span>
              <span>{me?.name}</span>
            </div>

            <div className="wrapper-delete-acount">
              <button onClick={logout} className="btn-odhlasitse">
                Odhlásit se
              </button>
              <button onClick={deleteAcount} className="btn-delete-acount">
                Smazat účet
              </button>
            </div>

            <div className="wrapper-mojeinzeraty-grids">
              <div className="wrapper-myads-grids">
                {myAds?.map((ad) => (
                  <div key={ad.id} className="wrapper-adds-card">
                    <div className="link-inzeratpage">
                      <div className="wrapper-img-card-adds">
                        <span className="top">TOP</span>
                        <IoMdCloseCircle
                          onClick={() => handleAdsDelete(ad.id)}
                          className="btn-delete-myinzerat"
                        />
                        <img
                          className="img-card-ads"
                          src={
                            ad?.images?.[0]?.image_url
                              ? `${ad?.images?.[0]?.image_url}`
                              : emptyImg
                          }
                          alt="icon-adds"
                        />

                        <span className="city">{ad?.city}</span>
                      </div>

                      <div className="wrapper-card-adds-info">
                        <h1 className="title-card-adds">
                          {ad?.title.length > 45
                            ? `${ad.title.slice(0, 56)}...`
                            : ad.title}
                        </h1>
                        <span className="price-card-adds">
                          {Number(ad?.price).toLocaleString("cs-CZ", {
                            style: "currency",
                            currency: "CZK",
                            maximumFractionDigits: 0,
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="wrapper-prihlasitse">
            <h4 className="nejste-prihlaseni">Nejste přihlášeni</h4>

            <Link to="/oblibene" className="prihlasitse">
              Přihlásit se
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Mojeinzeraty;
