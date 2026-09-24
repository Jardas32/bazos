import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { HashRouter } from "react-router-dom";
import BazosContext from "./context/BazosContext.jsx";

createRoot(document.getElementById("root")).render(
  <HashRouter>
    <BazosContext>
      <App />
    </BazosContext>
  </HashRouter>
);
