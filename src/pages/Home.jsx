import "../css/home.css";
import { useState, useEffect } from "react";
import Cardcategories from "../components/Cardcategories";

function Home() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const resCategories = await fetch(
          "https://bazos-yihu.onrender.com/api/categories"
        );

        if (!resCategories.ok) {
          throw new Error({ message: "Ошибка при загрузке категории" });
        }

        const dataCategories = await resCategories.json();

        setCategories(
          dataCategories.map((category) => {
            if (category.slug === "auto") {
              return { ...category, icon: "./images/auto.svg" };
            } else if (category.slug === "elektro") {
              return { ...category, icon: "./images/elektro.svg" };
            } else if (category.slug === "mobily") {
              return { ...category, icon: "./images/mobil.svg" };
            } else if (category.slug === "pc") {
              return { ...category, icon: "./images/pc.svg" };
            }

            return category;
          })
        );
      } catch (err) {
        console.log(err);
      }
    };

    getCategories();

    return () => getCategories();
  }, []);

  return (
    <div className="wrapper-home">
      <div className="wrapper-grids">
        {categories.map((category) => (
          <Cardcategories key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
}

export default Home;
