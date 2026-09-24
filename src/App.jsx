import "./App.css";
import { Routes, Route } from "react-router-dom";
import Header from "./components/header";
import Home from "./pages/Home";
import Oblibene from "./pages/oblibene";
import Mojeinzeraty from "./pages/Mojeinzeraty";
import PridatInzerat from "./pages/PridatInzerat";
import CategoryPage from "./pages/CategoryPage";
import SubcategoyPage from "./pages/SubcategoryPage";
import InzeratPage from "./pages/InzeratPage";
import Pridatinzeratsubcategory from "./pages/Pridatinzeratsubcategory";
import Pridatinzeratads from "./pages/Pridatinzeratads";
import VshychniInzeratypage from "./pages/VshychniInzeratypage";

function App() {
  return (
    <div className="wrapper-app">
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/oblibene" element={<Oblibene />} />
        <Route path="/mojeinzeraty" element={<Mojeinzeraty />} />
        <Route path="/pridat-inzerat" element={<PridatInzerat />} />

        <Route path="/:slug" element={<CategoryPage />} />
        <Route path="/:slug/:subcategoryslug" element={<SubcategoyPage />} />
        <Route
          path="/:slug/:subcategoryslug/inzerat/:id"
          element={<InzeratPage />}
        />

        <Route
          path="/hodnoceni/:user_id/:name"
          element={<VshychniInzeratypage />}
        />

        <Route
          path="/pridat-inzerat/:slug"
          element={<Pridatinzeratsubcategory />}
        />
        <Route
          path="/pridat-inzerat/:slug/:subcategorySlug"
          element={<Pridatinzeratads />}
        />
      </Routes>
    </div>
  );
}

export default App;
