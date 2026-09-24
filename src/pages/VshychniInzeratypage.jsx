import "../css/alladsuser.css";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useBazosContext } from "../context/BazosContext";

function VshychniInzeratypage() {
  const { leftBarCategories, alladsuser, setAlladsuser } = useBazosContext();
  const { subcategoryslug, user_id, name } = useParams();

  useEffect(() => {
    const getAllinzeratUser = async () => {
      try {
        const res = await fetch(
          `https://bazos-yihu.onrender.com/api/ads/allinzerat/${user_id}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await res.json();

        if (res.ok) {
          setAlladsuser(data);
        }
      } catch (err) {
        console.log(err);
      }
    };

    getAllinzeratUser();
  }, [user_id]);

  return (
    <div className="wrapper-alladsuser">
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

      <div className="wrapper-hodnoceni-rightbar">
        <div className="wrapper-hodnoceni-top">Uživatel: {name}</div>

        <h3 className="text-vshechni">
          Všechny inzeráty uživatele {alladsuser.length}
        </h3>

        <div className="wrapper-alladsuser-grids">
          {alladsuser.map((ad) => (
            <div key={ad.id} className="wrapper-oblibene-card">
              <div className="wrapper-oblibene-img">
                <img
                  className="oblibene-img"
                  src={
                    ad?.images
                      ? `${ad?.images[0].image_url}`
                      : "./images/empty.png"
                  }
                  alt="img"
                />
              </div>

              <div className="wrapper-oblibene-body">
                <h4 className="oblibene-title">{ad.title}</h4>
                <p className="oblibene-description">
                  {ad.description.slice(0, 60)}...
                </p>
                <span>
                  {Number(ad.price).toLocaleString("cs-CZ", {
                    style: "currency",
                    currency: "CZK",
                    maximumFractionDigits: 0,
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default VshychniInzeratypage;
