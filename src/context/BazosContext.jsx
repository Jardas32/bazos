import { useContext, createContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
const API_URL = "https://bazos-yihu.onrender.com";

const BazosContextProvider = createContext();

function BazosContext({ children }) {
  const [subCategories, setSubCategories] = useState([]);
  const [ads, setAds] = useState([]);
  const [selectAds, setSelectAds] = useState(null);
  const [loadind, setLoading] = useState(false);
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
        getMyAds();
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
    console.log(id);
    if (!id) return;

    try {
      const res = await fetch(`${API_URL}/api/ads/inzerat/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        getMyAds();
      }

      console.log("Inzerát byl smazán:", data.message);
    } catch (err) {
      console.log(err);
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
    if (!isAuth) return;

    try {
      const res = await fetch(`${API_URL}/api/ads/my_ads`, {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();

      setMyAds(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getMyFavorites();
    getMyAds();
  }, [isAuth]);

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
          setError(dataMe.message);
        }
      } catch (err) {
        console.log(err);
      }
    };
    authMe();
  }, []);

  const register = async (e) => {
    e.preventDefault();

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
    }
  };

  const login = async (e) => {
    e.preventDefault();

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

      console.log(data.message);
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
        const res = await fetch(
          "https://bazos-yihu.onrender.com/api/categories"
        );

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

          return category;
        });

        setSubCategories(categoriesWithIcons);
        setLeftBarCategories(categoriesWithIcons);
      } catch (err) {
        console.error("Chyba při načítání kategorií:", err);
      }
    };

    getAllcategories();
  }, []);

  const values = {
    subCategories,
    setSubCategories,
    ads,
    setAds,
    error,
    setError,
    loadind,
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
