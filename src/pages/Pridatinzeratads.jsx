import "../css/pridatinzeratads.css";
import { Link, useParams } from "react-router-dom";
import { useBazosContext } from "../context/BazosContext";

function Pridatinzeratads() {
  const {
    leftBarCategories,
    title,
    setTitle,
    description,
    setDescription,
    price,
    setPrice,
    city,
    setCity,
    postcod,
    setPostcod,
    handleAdsAdd,
    status,
    images,
    setImages,
    handleFiles,
    loadind,
  } = useBazosContext();
  const { subcategoryslug } = useParams();

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

      <div className="wrapper-vyber-sekce-forms">
        <h4>Podat inzerát - ads informace</h4>

        <form onSubmit={handleAdsAdd} className="formAds">
          <div className="gropuFormAds">
            <input
              id="file-upload"
              className="select-files"
              onChange={handleFiles}
              type="file"
              multiple
              accept="image/*"
            />

            <label htmlFor="file-upload" className="btn-select-file">
              📷 Vybrat fotografie
            </label>

            <span className="file-hint">Můžete vybrat více fotografií</span>
          </div>

          <div className="gropuFormAds">
            <span>Title</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              name=""
            />
          </div>
          <div className="gropuFormAds">
            <span>Descriptions</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="ads-description"
              rows={5}
              name=""
            ></textarea>
          </div>
          <div className="gropuFormAds">
            <span>Price</span>
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              type="text"
              name=""
            />
          </div>
          <div className="gropuFormAds">
            <span>City</span>
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              type="text"
              name=""
            />
          </div>
          <div className="gropuFormAds">
            <span>Post cod</span>
            <input
              value={postcod}
              onChange={(e) => setPostcod(e.target.value)}
              type="text"
              name=""
            />
          </div>
          <p className="status">{status}</p>
          <button type="submit" className="btn-pridat">
            {loadind ? "Odesílání..." : "Pridat"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Pridatinzeratads;
