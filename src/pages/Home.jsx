import "../css/home.css";
import Cardcategories from "../components/Cardcategories";
import { useBazosContext } from "../context/BazosContext";

function Home() {
  const { subCategories } = useBazosContext();

  return (
    <div className="wrapper-home">
      <div className="wrapper-grids">
        {subCategories.map((category) => (
          <Cardcategories key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
}

export default Home;
