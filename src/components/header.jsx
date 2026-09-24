import "../css/header.css";
import { Link } from "react-router-dom";

function Header() {
  return (
    <div className="wrapper-header">
      <div className="wrapper-header-top">
        <div className="wrapper-logo">
          <Link to="/">
            <img
              className="logo-icon"
              src="./images/Bazos-login.png"
              alt="logo"
            />
          </Link>
        </div>

        <div className="wrapper-nav">
          <Link to="/oblibene">Oblíbené inzeráty</Link>
          <Link to="/mojeinzeraty">Moje inzeráty</Link>
          <button className="btn-pridat-inzerat">
            <Link className="link-pridat-inzerat" to="/pridat-inzerat">
              Přidat inzerát
            </Link>
          </button>
        </div>
      </div>

      <div className="wrapper-search-filter">
        <form className="formSearch">
          <div className="groupInput">
            <label>Co:</label>
            <input className="inputCo" type="text" placeholder="" />
          </div>
          <div className="wrapper-section">Všechny kategorie</div>

          <div className="wrapper-price">
            <div className="groupInput">
              <label>Cena od:</label>
              <input className="inputPrice" type="text" placeholder="" />
              <span className="spase">-</span>
            </div>

            <div className="groupInput">
              <label>do:</label>
              <input className="inputPrice" type="text" placeholder="" />
              <span>Kč</span>
            </div>
          </div>

          <button className="btn-hledat">Hledat</button>
        </form>
      </div>
    </div>
  );
}

export default Header;
