import { useSearchParams, Link } from "react-router-dom";
import { useBazosContext } from "../context/BazosContext";
import { useEffect } from "react";
import Cardadds from "../components/Cardadds";
import LoadingComponent from "../components/LoadingComponent";
import Status from "../components/Status";
import Backlink from "../components/BackLink";

const items = [
  {
    name: "Hlavní stránka",
    path: "/",
  },
  {
    name: "vyhledávání",
  },
];

function Seacrhpage() {
  const {
    subcategorypage,
    setSubCategorypage,
    allCategories,
    ads,
    setAds,
    error,
    setError,
    loading,
    setLoading,
    status,
    setStatus,
    selectRubrika,
    leftBarCategories,
    API_URL,
    setCenaod,
    setCenado,
  } = useBazosContext();

  const [searchParams] = useSearchParams();

  const rubrika = searchParams.get("rubrika") || "";
  const kategorie = searchParams.get("kategorie") || "";
  const hledat = searchParams.get("hledat") || "";
  const cenaod = searchParams.get("cenaod") || "";
  const cenado = searchParams.get("cenado") || "";

  useEffect(() => {
    const getSearchAds = async () => {
      setLoading(true);

      try {
        const params = new URLSearchParams();

        if (hledat) {
          params.set("hledat", hledat);
        }

        if (rubrika) {
          params.set("rubrika", rubrika);
        }

        if (kategorie) {
          params.set("kategorie", kategorie);
        }

        if (cenaod) {
          params.set("cenaod", cenaod);
        }

        if (cenado) {
          params.set("cenado", cenado);
        }

        const res = await fetch(`${API_URL}/api/ads?${params.toString()}`, {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();

        if (res.ok) {
          setAds(data);

          setCenaod("");
          setCenado("");
        }
        
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    getSearchAds();
  }, [hledat, cenaod, cenado]);

  return (
    <div className="wrapper-categorypage">
      <Backlink items={items} />

      <div className="wrapper-categorypage-content">
        <div className="wrapper-subcategorie">
          <h3 className="text-categories">Inzerce</h3>

          <ul className="list-category">
            {leftBarCategories.map((category) => (
              <li key={category.id} className="subcategory">
                <Link
                  to={`/${category.slug}`}
                  className={`link-category ${
                    category.slug === selectRubrika ? "active" : ""
                  }`}
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <Status status={status} setStatus={setStatus} />

        <div className="wrapper-leftgrids">
          <div className="wrapper-btn-grids-adslength">
            <span>Zobrazeno inzerátů {ads.length}</span>
          </div>

          <div className="wrapper-grid-adds">
            {loading ? (
              <LoadingComponent />
            ) : ads.length === 0 ? (
              <div className="wrapper-empty">Žádný inzerát nenalezen.</div>
            ) : (
              ads.map((ad) => <Cardadds key={ad.id} ad={ad} />)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Seacrhpage;
