import "../css/inzeratpage.css";
import emptyImg from "/images/empty.png";
import { useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useBazosContext } from "../context/BazosContext";
import { datainzeratinfo } from "../data/data";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { PiStarDuotone } from "react-icons/pi";
import Backlink from "../components/BackLink";
import Cardadds from "../components/Cardadds";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

function InzeratPage() {
  const {
    leftBarCategories,
    setSubCategories,
    selectAds,
    setSelectAds,
    selectInzeratInfo,
    setSelectInzeratInfo,
    handleAddFavorites,
    myFavorites,
    setQuaryRubrika,
    isAuth,
    API_URL,
    podobneInzeraty,
    setPodobneInzeraty,
  } = useBazosContext();
  const { slug, subcategoryslug, id } = useParams();
  const navigate = useNavigate();
  const inFavorits = myFavorites.some((f) => f.id === selectAds?.id);

  useEffect(() => {
    const getSubCategories = async () => {
      try {
        const resSubcategories = await fetch(
          `${API_URL}/api/subcategories/category/${slug}`
        );

        const dataSubcategories = await resSubcategories.json();

        setSubCategories(dataSubcategories);
      } catch (err) {
        console.log(err);
      }
    };
    getSubCategories();
  }, [slug]);

  useEffect(() => {
    const getAdsbyId = async () => {
      try {
        const resAdsId = await fetch(`${API_URL}/api/ads/inzerat/${id}`);

        const dataAdsId = await resAdsId.json();

        setSelectAds(dataAdsId);
      } catch (err) {
        console.log(err);
      }
    };

    getAdsbyId();
  }, [id]);

  useEffect(() => {
    const getPodobneInzeraty = async () => {
      if (!selectAds?.title) return;

      try {
        const res = await fetch(
          `${API_URL}/api/ads/podobne/${encodeURIComponent(selectAds.title)}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (res.ok) {
          const data = await res.json();

          setPodobneInzeraty(data.filter((i) => i.id !== selectAds?.id));
        }
      } catch (err) {
        console.log(err);
      }
    };

    getPodobneInzeraty();
  }, [selectAds?.title]);

  const items = [
    {
      name: "Hlavní stránka",
      path: "/",
    },
    {
      name: `${slug}`,
      path: `/${slug}`,
    },
    {
      name: `${subcategoryslug}`,
      path: `/${slug}/${subcategoryslug}`,
    },
    {
      name: `inzerát č. ${id}`,
    },
  ];

  return (
    <div className="wrapper-inzeratpage">
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
                    category.slug === subcategoryslug ? "active" : ""
                  }`}
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="wrapper-addsinfo">
          <div className="wrapper-top-title-edd">
            {selectAds?.title} -{" "}
            <span className="data-inzerat">
              {new Date(selectAds?.created_at).toLocaleDateString()}
            </span>
          </div>

          <div className="wrapper-inzerat-sliders">
            <Swiper
              className="wrapper-sliders"
              modules={[Navigation, Pagination, Autoplay]}
              autoplay={false}
              loop={selectAds?.images.length > 1}
              navigation
              speed={600}
              pagination={{ clickable: true }}
            >
              {selectAds?.images.length === 0 ? (
                <img src="..." alt="slide" />
              ) : selectAds?.images?.length > 0 &&
                selectAds?.images[0].image_url !== null ? (
                selectAds?.images.map((slide) => (
                  <SwiperSlide className="slider" key={slide.id}>
                    <div className="wrapper-slider-center">
                      <div className="wrapper-slide">
                        <img
                          className="inzerat-img-slide"
                          src={slide.image_url}
                          alt="img-slide"
                        />
                      </div>
                    </div>
                  </SwiperSlide>
                ))
              ) : (
                <img className="emptyImg" src={emptyImg} alt="empty-img" />
              )}
            </Swiper>

            <div className="wrapper-inzerat-sliders-rightbar">
              {selectAds?.images.length > 1 &&
                selectAds?.images.map((img) => (
                  <div key={img.id} className="wrapper-rightbar-img">
                    <img src={img.image_url} alt="img" />
                  </div>
                ))}
            </div>
          </div>

          <div className="wrapper-descriptions">
            <p className="ad-description">{selectAds?.description}</p>
          </div>
          <div className="wrapper-userinfo">
            <ul className="left-List">
              <li className="left-List-li">
                <span>Jméno:</span>
                <span className="name-user">
                  <strong>{selectAds?.seller_name}</strong>
                </span>
              </li>
              <li className="left-List-li">
                <span>Email:</span>
                <span>
                  {selectAds?.seller_email.length > 8
                    ? `${selectAds?.seller_email.slice(0, 8)}...`
                    : `${selectAds?.seller_email}`}
                </span>
              </li>
              <li className="left-List-li">
                <span>Lokalita:</span>
                <span>{selectAds?.city}</span>
              </li>
              <li className="left-List-li">
                <span>Vidělo:</span>
                <span>{selectAds?.views} lidí</span>
              </li>
              <li className="left-List-li">
                <span>Cena:</span>
                <span className="ad-price">
                  <strong>
                    {Number(selectAds?.price).toLocaleString("cs-CZ", {
                      style: "currency",
                      currency: "CZK",
                      maximumFractionDigits: 0,
                    })}
                  </strong>
                </span>
              </li>
            </ul>

            <div className="right-List">
              {datainzeratinfo.rightList.map((info) => (
                <button
                  onClick={() => {
                    if (info.id === 1) {
                      navigate(
                        `/hodnoceni/${selectAds?.user_id}/${encodeURIComponent(
                          selectAds?.seller_name
                        )}`
                      );
                    }

                    if (info.id === 2) {
                      if (!isAuth) {
                        navigate("/prihlaseni");
                        return;
                      }

                      handleAddFavorites(selectAds?.id);
                    }
                  }}
                  key={info.id}
                  className="right-List-btn"
                >
                  {info.id === 2 ? (
                    <PiStarDuotone
                      className={`starIcon ${inFavorits ? "active" : ""}`}
                    />
                  ) : (
                    <img
                      className="right-icon-info"
                      src={info.icon}
                      alt="icon"
                    />
                  )}

                  <span className="right-List-link">
                    {info.id === 2
                      ? inFavorits
                        ? "Odebrát z oblíbených"
                        : info.text
                      : info.text}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div className="wrapper-podobne-inzeraty">
            <div className="podobne-inzeraty">
              <span>Podobné inzeráty</span>
            </div>

            <div className="wrapper-podobne-grids">
              {podobneInzeraty.map((inzerat) => (
                <Cardadds key={inzerat.id} ad={inzerat} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InzeratPage;
