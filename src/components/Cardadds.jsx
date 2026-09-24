import "../css/cardadds.css";
import { Link, useParams } from "react-router-dom";
import emptyImg from "/images/empty.png";
import { useBazosContext } from "../context/BazosContext";
import { IoIosHeart } from "react-icons/io";

function Cardadds({ ad }) {
  const { slug } = useParams();
  const {
    isAuth,
    adId,
    setAdId,
    handleAddFavorites,
    myFavorites,
    setMyFavorites,
  } = useBazosContext();
  const inFavorits = myFavorites.find((f) => f.id === ad.id);

  return (
    <div className="wrapper-adds-card">
      {isAuth && (
        <div className="addHead">
          <IoIosHeart
            onClick={() => handleAddFavorites(ad.id)}
            className={`icon-add ${inFavorits?.id === ad?.id ? "active" : ""}`}
          />
        </div>
      )}

      <Link
        to={`/${slug}/${ad.subcategory_slug}/inzerat/${ad.id}`}
        className="link-inzeratpage"
      >
        <div className="wrapper-img-card-adds">
          <span className="top">TOP</span>
          <img
            className="img-card-ads"
            src={
              ad?.images?.[0]?.image_url
                ? `${ad?.images?.[0]?.image_url}`
                : emptyImg
            }
            alt="icon-adds"
          />

          <span className="city">{ad.city}</span>
        </div>

        <div className="wrapper-card-adds-info">
          <h1 className="title-card-adds">
            {ad.title.length > 45 ? `${ad.title.slice(0, 56)}...` : ad.title}
          </h1>
          <span className="price-card-adds">
            {Number(ad.price).toLocaleString("cs-CZ", {
              style: "currency",
              currency: "CZK",
              maximumFractionDigits: 0,
            })}
          </span>
        </div>
      </Link>
    </div>
  );
}

export default Cardadds;
