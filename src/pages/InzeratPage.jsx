import "../css/inzeratpage.css";
import emptyImg from "/images/empty.png";
import { useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useBazosContext } from "../context/BazosContext";
import { datainzeratinfo } from "../data/data";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

console.log(datainzeratinfo.rightList[0].icon);

function InzeratPage() {
  const {
    leftBarCategories,
    setSubCategories,
    selectAds,
    setSelectAds,
    selectInzeratInfo,
    setSelectInzeratInfo,
    handleAddFavorites,
  } = useBazosContext();
  const { slug, subcategoryslug, id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const getSubCategories = async () => {
      try {
        const resSubcategories = await fetch(
          `https://bazos-yihu.onrender.com/api/subcategories/category/${slug}`
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
        const resAdsId = await fetch(
          `https://bazos-yihu.onrender.com/api/ads/inzerat/${id}`
        );

        const dataAdsId = await resAdsId.json();

        setSelectAds(dataAdsId);
      } catch (err) {
        console.log(err);
      }
    };

    getAdsbyId();
  }, [id]);

  return (
    <div className="wrapper-inzeratpage">
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

      <div className="wrapper-addsinfo">
        <div className="wrapper-top-title-edd">{selectAds?.title}</div>

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
              <span>{selectAds?.seller_email}</span>
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

          <ul className="right-List">
            {datainzeratinfo.rightList.map((info) => (
              <li key={info.id} className="right-List-li">
                <img src={info.icon} alt="icon" />
                <span
                  onClick={() => {
                    if (info.id === 1) {
                      navigate(
                        `/hodnoceni/${selectAds?.user_id}/${encodeURIComponent(
                          selectAds?.seller_name
                        )}`
                      );
                    }

                    if (info.id === 2) {
                      handleAddFavorites(selectAds?.id);
                    }
                  }}
                  className="right-List-link"
                >
                  {info.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default InzeratPage;
