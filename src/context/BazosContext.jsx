import { useContext, createContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { changeBtn } from "../data/data";
// const API_URL = "http://localhost:4000";
const API_URL = "";
const BazosContextProvider = createContext();

function BazosContext({ children }) {
  const navigate = useNavigate();
  const [subCategories, setSubCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [ads, setAds] = useState([]);
  const [selectAds, setSelectAds] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { slug } = useParams();
  const [cheked, setCheked] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [emailLogin, setEmailLogin] = useState("");
  const [passwordLogin, setPasswordLogin] = useState("");
  const [me, setMe] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [selectSekce, setSelectSekce] = useState(null);
  const [selectSubCategory, setSelectSubcategory] = useState(null);
  const [allSubcategorie, setAllsubcategorie] = useState([]);
  const [leftBarCategories, setLeftBarCategories] = useState([]);
  const [subcategorypage, setSubCategorypage] = useState([]);
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [city, setCity] = useState("");
  const [postcod, setPostcod] = useState("");
  const [status, setStatus] = useState("");
  const [myFavorites, setMyFavorites] = useState([]);
  const [myAds, setMyAds] = useState([]);
  const [selectInzeratInfo, setSelectInzeratInfo] = useState(null);
  const [alladsuser, setAlladsuser] = useState([]);
  const [authLoading, setAuthLoading] = useState(true);
  const [deleteAccount, setDeleteAccount] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [openSearchResult, setOpenSearchResult] = useState(false);
  const [openSelectCategory, setOpenSelectCategory] = useState(false);
  const [selectRubrika, setSelectRubrika] = useState("Všechny rubriky");
  const [openSelectKategorie, setOpenSelectKategorie] = useState(false);
  const [selectKategorie, setSelectKategorie] = useState("Všechny kategorie");
  const [searchHledat, setSearchHledat] = useState("");
  const [cenaod, setCenaod] = useState("");
  const [cenado, setCenado] = useState("");
  const [quaryRubrika, setQuaryRubrika] = useState("");
  const [quaryKategorie, setQuaryKategorie] = useState("");
  const [allAds, setAllAds] = useState([]);
  const [changeGrid, setChangeGrid] = useState(() => {
    const getChangeGrid = localStorage.getItem("changeGrid");

    return getChangeGrid ? JSON.parse(getChangeGrid) : false;
  });
  const [selectBtnChange, setSelectBtnChange] = useState(() => {
    const getSelectbtn = localStorage.getItem("selectBtn");

    return getSelectbtn ? JSON.parse(getSelectbtn) : changeBtn[1];
  });

  // Paginations
  const [pages, setPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalAds, setTotalAds] = useState(0);
  const [openDeleteAds, setOpenDeleteAds] = useState(null);
  const [podobneInzeraty, setPodobneInzeraty] = useState([]);

  const scrollTo = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    localStorage.setItem("selectBtn", JSON.stringify(selectBtnChange));
  }, [selectBtnChange]);

  useEffect(() => {
    localStorage.setItem("changeGrid", JSON.stringify(changeGrid));
  }, [changeGrid]);

  // allAds

  useEffect(() => {
    const getAllAds = async () => {
      try {
        const res = await fetch(`${API_URL}/api/ads/all`, {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();

        if (res.ok) {
          setAllAds(data);
        }
      } catch (err) {
        console.log(err);
      }
    };
    getAllAds();
  }, []);

  // filter

  useEffect(() => {
    if (selectRubrika !== "Všechny rubriky") {
      setQuaryRubrika(selectRubrika);
    }

    if (selectKategorie !== "Všechny kategorie") {
      setQuaryKategorie(selectKategorie);
    }
  }, [selectRubrika, selectKategorie]);

  const handleFilterAds = async (e) => {
    e.preventDefault();

    const params = new URLSearchParams();

    if (searchHledat) {
      params.set("hledat", searchHledat);
    }

    if (quaryRubrika) {
      params.set("rubrika", quaryRubrika);
    }

    if (quaryKategorie) {
      params.set("kategorie", quaryKategorie);
    }

    if (cenaod) {
      params.set("cenaod", cenaod);
    }

    if (cenado) {
      params.set("cenado", cenado);
    }

    navigate(`/search?${params.toString()}`);
  };

  const handleFiles = (e) => {
    const file = Array.from(e.target.files);

    return setImages((prev) => [...prev, ...file]);
  };

  useEffect(() => {
    if (status) {
      setTimeout(() => {
        setStatus("");
      }, 2600);
    }
  }, [status]);

  const handleAdsAdd = async (e) => {
    e.preventDefault();

    setLoading(true);

    const formData = new FormData();

    formData.append("subcategory_id", selectSubCategory);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("city", city);
    formData.append("postcod", postcod);
    formData.append("user_id", me?.id);

    images.forEach((img) => {
      formData.append("image", img);
    });

    try {
      const res = await fetch(`${API_URL}/api/ads/inzerat/add`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setStatus(data.message, data.title);
        setTitle("");
        setDescription("");
        setPrice("");
        setCity("");
        setPostcod("");
        setImages([]);
        await getMyAds();
        navigate("/mojeinzeraty");
      } else {
        setStatus(data.message);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdsDelete = async (id) => {
    if (!id) return;
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/ads/inzerat/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        await getMyAds();
      }

      console.log("Inzerát byl smazán:", data.message);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFavorites = async (id) => {
    try {
      const inFavorites = myFavorites.some((f) => f.id === id);

      if (inFavorites) {
        const res = await fetch(`${API_URL}/api/favorites/delete/${id}`, {
          method: "DELETE",
          credentials: "include",
        });

        const data = await res.json();

        if (res.ok) {
          getMyFavorites();
          setStatus(data.message);
        }
      } else {
        const res = await fetch(`${API_URL}/api/favorites/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ id }),
        });

        const data = await res.json();

        if (res.ok) {
          getMyFavorites();
        }

        setStatus(data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getMyFavorites = async () => {
    if (!isAuth) {
      setMyFavorites([]);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/favorites/my_favorites`, {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        console.log(data.message);
        return;
      }

      setMyFavorites(data);
    } catch (err) {
      console.log(err);
    }
  };

  const getMyAds = async () => {
    if (!isAuth) {
      setMyAds([]);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/ads/my_ads`, {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        console.log("MY ADS ERROR:", data);
        setMyAds([]);
        return;
      }

      if (!Array.isArray(data)) {
        console.log("MY ADS IS NOT ARRAY:", data);
        setMyAds([]);
        return;
      }

      setMyAds(data);
    } catch (err) {
      console.log("MY ADS FETCH ERROR:", err);
      setMyAds([]);
    }
  };

  useEffect(() => {
    getMyFavorites();
    getMyAds();
  }, [isAuth, authLoading]);

  useEffect(() => {
    const authMe = async () => {
      try {
        const res = await fetch(`${API_URL}/api/auth/me`, {
          method: "GET",
          credentials: "include",
        });

        const dataMe = await res.json();

        if (res.ok) {
          setIsAuth(true);
          setMe(dataMe.user);
        } else {
          setIsAuth(false);
          setMe(null);
        }
      } catch (err) {
        console.log(err);
        setIsAuth(false);
        setMe(null);
      } finally {
        setAuthLoading(false);
      }
    };
    authMe();
  }, []);

  const register = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!cheked) {
      setError("Musíte souhlasit s podmínkami.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
          name,
        }),
      });

      const dataUser = await res.json();

      if (res.ok) {
        setIsAuth(true);
        setMe(dataUser.user);
      } else {
        setIsAuth(false);
        setError(dataUser.message);
      }

      setEmail("");
      setPassword("");
      setName("");
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const login = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!cheked) {
      setError("Musíte souhlasit s podmínkami.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          emailLogin,
          passwordLogin,
        }),
      });

      const dataLogin = await res.json();

      if (res.ok) {
        setIsAuth(true);
        setMe(dataLogin.user);
      } else {
        setIsAuth(false);
        setError(dataLogin.message);
      }

      setEmailLogin("");
      setPasswordLogin("");
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const res = await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      const dataLogout = await res.json();

      setMe(null);
      setIsAuth(false);
      setMyAds([]);
      setError(dataLogout.message);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteAcount = async () => {
    try {
      const res = await fetch(`${API_URL}/api/auth/delete-acount`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();

      setDeleteAccount(false);
      setMe(null);
      setIsAuth(false);
      setError(data.message);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const getAllcategories = async () => {
      try {
        const res = await fetch(`${API_URL}/api/categories`);

        if (!res.ok) {
          throw new Error(`HTTP error: ${res.status}`);
        }

        const dataCategories = await res.json();

        const categoriesWithIcons = dataCategories.map((category) => {
          if (category.slug === "auto") {
            return { ...category, icon: "./images/auto.svg" };
          }

          if (category.slug === "elektro") {
            return { ...category, icon: "./images/elektro.svg" };
          }

          if (category.slug === "mobily") {
            return { ...category, icon: "./images/mobil.svg" };
          }

          if (category.slug === "pc") {
            return { ...category, icon: "./images/pc.svg" };
          }

          if (category.slug === "zvirata") {
            return {
              ...category,
              icon: "./images/zvirata.svg",
            };
          }

          if (category.slug === "nabytek") {
            return { ...category, icon: "./images/nabytek.svg" };
          }

          if (category.slug === "sport") {
            return { ...category, icon: "./images/sport.svg" };
          }

          if (category.slug === "obleceni") {
            return { ...category, icon: "./images/obleceni.svg" };
          }

          return category;
        });

        setAllCategories(categoriesWithIcons);
        setSubCategories(categoriesWithIcons);
        setLeftBarCategories(categoriesWithIcons);
      } catch (err) {
        console.error("Chyba při načítání kategorií:", err);
      }
    };

    getAllcategories();
  }, []);

  // serachTitle

  useEffect(() => {
    const getSearchTitle = async () => {
      if (!searchTitle) return;

      try {
        const res = await fetch(`${API_URL}/api/ads/${searchTitle}`, {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();

        if (res.ok) {
          setSearchResult(data);
          setOpenSearchResult(true);
        } else {
          setSearchResult([{ id: 1, title: data.message }]);
        }
      } catch (err) {
        console.log(err);
      }
    };
    getSearchTitle();
  }, [searchTitle]);

  const values = {
    subCategories,
    setSubCategories,
    ads,
    setAds,
    error,
    setError,
    loading,
    setLoading,
    slug,
    selectAds,
    setSelectAds,
    email,
    setEmail,
    password,
    setPassword,
    name,
    emailLogin,
    setEmailLogin,
    passwordLogin,
    setPasswordLogin,
    setName,
    register,
    login,
    logout,
    isAuth,
    isLogin,
    setIsLogin,
    me,
    selectSekce,
    setSelectSekce,
    selectSubCategory,
    setSelectSubcategory,
    allSubcategorie,
    setAllsubcategorie,
    leftBarCategories,
    setLeftBarCategories,
    subcategorypage,
    setSubCategorypage,
    handleAdsAdd,
    selectSubCategory,
    setSelectSubcategory,
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
    status,
    setStatus,
    handleAddFavorites,
    setMyFavorites,
    myFavorites,
    myAds,
    images,
    setImages,
    handleFiles,
    handleAdsDelete,
    deleteAcount,
    selectInzeratInfo,
    setSelectInzeratInfo,
    setAlladsuser,
    alladsuser,
    setCheked,
    authLoading,
    allCategories,
    deleteAccount,
    setDeleteAccount,
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
    openSelectKategorie,
    setOpenSelectKategorie,
    setSelectKategorie,
    selectKategorie,
    API_URL,
    searchHledat,
    setSearchHledat,
    cenaod,
    setCenaod,
    cenado,
    setCenado,
    handleFilterAds,
    setQuaryRubrika,
    setQuaryKategorie,
    allAds,
    changeGrid,
    setChangeGrid,
    selectBtnChange,
    setSelectBtnChange,
    pages,
    setPages,
    currentPage,
    setCurrentPage,
    totalAds,
    setTotalAds,
    scrollTo,
    openDeleteAds,
    setOpenDeleteAds,
    podobneInzeraty,
    setPodobneInzeraty,
  };

  return (
    <BazosContextProvider.Provider value={values}>
      {children}
    </BazosContextProvider.Provider>
  );
}

export default BazosContext;

export const useBazosContext = () => {
  return useContext(BazosContextProvider);
};
