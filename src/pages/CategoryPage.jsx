import "../css/categorypage.css";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useBazosContext } from "../context/BazosContext";
import Cardadds from "../components/Cardadds";
import Cardadsflex from "../components/Cardadsflex";
import LeftBar from "../components/LeftBar";
import LoadingComponent from "../components/LoadingComponent";
import Status from "../components/Status";
import Backlink from "../components/BackLink";
import ChangeGrid from "../components/ChangeGrid";
import Paginations from "../components/Pginations";

function CategoryPage() {
  const {
    subcategorypage,
    setSubCategorypage,
    ads,
    setAds,
    error,
    setError,
    loading,
    setLoading,
    status,
    setStatus,
    setSelectRubrika,
    selectRubrika,
    selectKategorie,
    API_URL,
    changeGrid,
    setPages,
    pages,
    setCurrentPage,
    currentPage,
    totalAds,
    setTotalAds,
    scrollTo,
  } = useBazosContext();
  const { slug, subcategoryslug } = useParams();

  useEffect(() => {
    setSelectRubrika(slug);
  }, [slug]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectRubrika, slug, subcategoryslug, selectKategorie]);

  useEffect(() => {
    const getSubCategories = async () => {
      try {
        const resSubcategories = await fetch(
          `${API_URL}/api/subcategories/category/${slug}`
        );

        const dataSubcategories = await resSubcategories.json();

        setSubCategorypage(dataSubcategories);
      } catch (err) {
        console.log(err);
      }
    };
    getSubCategories();
  }, [slug, selectRubrika]);

  useEffect(() => {
    const getCategoryAds = async () => {
      if (!currentPage) return;
      setLoading(true);

      try {
        let url;

        if (subcategoryslug) {
          url = `${API_URL}/api/ads/subcategory/${subcategoryslug}?page=${currentPage}`;
        } else {
          url = `${API_URL}/api/ads/category/${slug}?page=${currentPage}`;
        }

        const resAds = await fetch(url);

        if (resAds.ok) {
          const dataAds = await resAds.json();
          setAds(dataAds.ads);
          setPages(dataAds.pagination.totalPages);
          setTotalAds(dataAds.pagination.total);
          scrollTo();
        }
      } catch (err) {
        console.log(err);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 400);
      }
    };

    getCategoryAds();
  }, [slug, subcategoryslug, selectKategorie, currentPage]);

  const items = [
    {
      name: "Hlavní stránka",
      path: "/",
    },
    {
      name: `${slug}`,
    },
  ];

  return (
    <div className="wrapper-categorypage">
      <Backlink items={items} />

      <div className="wrapper-categorypage-content">
        <LeftBar
          subCategories={subcategorypage}
          slug={slug}
          subcategoryslug={subcategoryslug}
        />

        <Status status={status} setStatus={setStatus} />

        <div className="wrapper-leftgrids">
          <div className="wrapper-btn-grids-adslength">
            <ChangeGrid />
            <span>
              Zobrazeno {ads.length} inzerátů z {totalAds}
            </span>
          </div>

          <div className={`wrapper-grid-adds ${changeGrid ? "active" : ""}`}>
            {loading ? (
              <LoadingComponent />
            ) : ads.length === 0 ? (
              <div className="wrapper-empty">Žádný inzerát nenalezen.</div>
            ) : (
              ads.map((ad) =>
                changeGrid ? (
                  <Cardadsflex key={ad.id} ad={ad} />
                ) : (
                  <Cardadds key={ad.id} ad={ad} />
                )
              )
            )}
          </div>

          {pages > 1 && <Paginations />}
        </div>
      </div>
    </div>
  );
}

export default CategoryPage;
