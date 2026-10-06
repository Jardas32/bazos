import "../css/cardadsflex.css";
import { Link, useParams } from "react-router-dom";
import emptyImg from "/images/empty.png";
import { useBazosContext } from "../context/BazosContext";
import { IoIosHeart } from "react-icons/io";

function Cardadsflex({ ad }) {
  const { slug } = useParams();
  const { isAuth, handleAddFavorites, myFavorites } = useBazosContext();
  const inFavorits = myFavorites.find((f) => f.id === ad.id);

  return (
    <div className="wrapper-adds-card-flex">
      <div className="wrapper-img-card-adds-flex">
        <img
          className="img-card-ads"
          src={
            ad?.images?.[0]?.image_url
              ? `${ad?.images[0]?.image_url}`
              : emptyImg
          }
          alt="icon-adds"
        />
      </div>

      <Link
        to={`/${slug || ad.category_slug}/${ad.subcategory_slug}/inzerat/${
          ad.id
        }`}
        className="link-inzeratpage-flex"
      >
        <div className="wrapper-card-adds-info-flex">
          <h1 className="title-card-adds">
            {ad.title.length > 45 ? `${ad.title.slice(0, 56)}...` : ad.title}
          </h1>

          <p className="description hidden">{ad.description.slice(0, 200)}...</p>
          <p className="description-mobile">{ad.description.slice(0, 46)}...</p>

        </div>

        <span className="price-card-adds-flex">
          {Number(ad.price).toLocaleString("cs-CZ", {
            style: "currency",
            currency: "CZK",
            maximumFractionDigits: 0,
          })}
        </span>

        <span className="city-flex">{ad.city}</span>

        <span className="views-flex">{ad.views} x</span>
      </Link>

      {isAuth && (
        <div className="addHead-flex">
          <IoIosHeart
            onClick={() => handleAddFavorites(ad.id)}
            className={`icon-add-flex ${
              inFavorits?.id === ad?.id ? "active" : ""
            }`}
          />
        </div>
      )}
    </div>
  );
}

export default Cardadsflex;
