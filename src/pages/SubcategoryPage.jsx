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

function SubcategoryPage() {
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
    selectRubrika,
    selectKategorie,
    API_URL,
    changeGrid,
  } = useBazosContext();
  const { slug, subcategoryslug } = useParams();

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
      setLoading(true);
      try {
        let url;

        if (subcategoryslug || selectKategorie) {
          url = `${API_URL}/api/ads/subcategory/${subcategoryslug}`;
        } else {
          url = `${API_URL}/api/ads/category/${slug}`;
        }

        const resAds = await fetch(url);

        const dataAds = await resAds.json();

        setAds(dataAds);
      } catch (err) {
        console.log(err);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 400);
      }
    };

    getCategoryAds();
  }, [slug, subcategoryslug, selectKategorie]);

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
            <span>Zobrazeno inzerátů {ads.length}</span>
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
        </div>
      </div>
    </div>
  );
}

export default SubcategoryPage;
