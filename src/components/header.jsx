import "../css/header.css";
import { Link } from "react-router-dom";
import { useBazosContext } from "../context/BazosContext";
import { IoIosArrowDown } from "react-icons/io";

function Header() {
  const {
    me,
    isAuth,
    searchResult,
    setSearchResult,
    searchTitle,
    setSearchTitle,
    openSearchResult,
    setOpenSearchResult,
    openSelectCategory,
    setOpenSelectCategory,
    selectRubrika,
    setSelectRubrika,
    allCategories,
    openSelectKategorie,
    setOpenSelectKategorie,
    setSelectKategorie,
    selectKategorie,
    subcategorypage,
    searchHledat,
    setSearchHledat,
    cenaod,
    setCenaod,
    cenado,
    setCenado,
    handleFilterAds,
  } = useBazosContext();

  return (
    <div className="wrapper-header">
      <div className="wrapper-header-top">
        <div className="wrapper-logo">
          <Link
            onClick={() => {
              setSelectRubrika("Všechny rubriky");
              setSelectKategorie("Všechny kategorie");
            }}
            to="/"
          >
            <img
              className="logo-icon"
              src="./images/LogoFinal.png"
              alt="logo"
            />
          </Link>
        </div>

        <div className="wrapper-nav">
          <Link
            className={`nav-link ${isAuth ? "active" : ""}`}
            to="/prihlaseni"
          >
            {me ? `${me?.name}` : `Přihlášení`}
          </Link>
          <Link className="nav-link" to="/oblibene">
            Oblíbené inzeráty
          </Link>
          <Link className="nav-link" to="/mojeinzeraty">
            Moje inzeráty
          </Link>
          <button className="btn-pridat-inzerat">
            <Link className="link-pridat-inzerat" to="/pridat-inzerat">
              Přidat inzerát
            </Link>
          </button>
        </div>
      </div>

      <div className="wrapper-search-filter">
        <form onSubmit={handleFilterAds} className="formSearch">
          <div className="groupInput">
            <div className="inputLabel">
              <label>Co:</label>
              <input
                value={searchTitle}
                onChange={(e) => {
                  setSearchTitle(e.target.value);
                  setSearchHledat(e.target.value);
                }}
                className="inputCo"
                type="text"
                placeholder=""
              />

              <button
                onClick={() => {
                  setSearchTitle("");
                  setSearchResult([]);
                  setOpenSearchResult(false);
                }}
                className="btn-clearSearch"
              >
                X
              </button>

              <div
                className={`wrapper-header-searchresult ${
                  openSearchResult ? "active" : ""
                }`}
              >
                <div className="wrapper-header-searchresult-scroll">
                  {searchResult.map((result) => (
                    <Link
                      onClick={() => {
                        setSearchTitle("");
                        setSearchResult([]);
                        setOpenSearchResult(false);
                      }}
                      to={`/vyhledavani/${result.category_slug}/${result.subcategory_slug}/inzerat/${result.id}`}
                      className="link-result"
                      key={result?.id}
                    >
                      {result?.title?.length > 23
                        ? `${result?.title.slice(0, 23)}...`
                        : `${result?.title}`}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setOpenSearchResult(false)}
              type="submit"
              className="btn-hledat mobile"
            >
              Hledat
            </button>
          </div>

          <div className="wrapper-section">
            <div className="wrapper-group-select">
              <div className="wrapper-select">
                <div
                  onClick={() => {
                    setOpenSelectCategory((prev) => !prev);
                    setSelectKategorie("Všechny kategorie");
                  }}
                  className="select-value"
                >
                  {selectRubrika}
                </div>
                <IoIosArrowDown
                  className={`arrowDown ${openSelectCategory ? "active" : ""}`}
                />

                <div
                  className={`wrapper-options ${
                    openSelectCategory ? "active" : ""
                  }`}
                >
                  {allCategories.map((rubrika) => (
                    <Link
                      to={`/${rubrika.slug}`}
                      onClick={() => {
                        setSelectRubrika(rubrika.slug);
                        setOpenSelectCategory(false);
                      }}
                      key={rubrika.id}
                      className="options"
                    >
                      {rubrika.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="wrapper-select mobile">
                <div
                  onClick={() => setOpenSelectKategorie((prev) => !prev)}
                  className="select-value"
                >
                  {selectKategorie}
                </div>
                <IoIosArrowDown
                  className={`arrowDown ${openSelectKategorie ? "active" : ""}`}
                />

                <div
                  className={`wrapper-options ${
                    openSelectKategorie ? "active" : ""
                  }`}
                >
                  {subcategorypage.map((category) => (
                    <Link
                      to={`/${selectRubrika}/${category.slug}`}
                      onClick={() => {
                        setSelectKategorie(category.slug);
                        setOpenSelectKategorie(false);
                      }}
                      key={category.id}
                      className="options"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="wrapper-price">
              <div className="groupInput">
                <label>Cena od:</label>
                <input
                  min={0}
                  value={cenaod}
                  onChange={(e) => setCenaod(e.target.value)}
                  className="inputPrice"
                  type="text"
                  placeholder=""
                />
              </div>

              <div className="groupInput">
                <label>do:</label>
                <input
                  min={0}
                  value={cenado}
                  onChange={(e) => setCenado(e.target.value)}
                  className="inputPrice"
                  type="text"
                  placeholder=""
                />
                <span>Kč</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setOpenSearchResult(false)}
            type="submit"
            className="btn-hledat desktop"
          >
            Hledat
          </button>
        </form>
      </div>
    </div>
  );
}

export default Header;
