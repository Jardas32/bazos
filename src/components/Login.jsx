import "../css/register.css";
import { Link } from "react-router-dom";
import { useBazosContext } from "../context/BazosContext";

function Register() {
  const {
    error,
    setIsLogin,
    emailLogin,
    setEmailLogin,
    passwordLogin,
    setPasswordLogin,
    login,
    setCheked,
  } = useBazosContext();

  return (
    <div className="wrapper-registerbg">
      <div className="nova-registrace">
        <span>Přihlásit se </span> <span>/</span>
        <button onClick={() => setIsLogin(false)} className="btn-loginpage">
          Nová registrace
        </button>
      </div>
      <h3 className="register-info">
        Pro používání oblíbených inzerátů a dalších nadstavbových funkcí
        Bazos.cz je nutné ověření mobilního telefonu
      </h3>
      <p className="register-infoauth">
        Telefonní číslo nebude nikde zveřejněno. <br /> Na telefon je následně
        zaslán mobilní klíč. <br /> Ověření je možné pouze z českého nebo
        slovenského čísla.
      </p>

      <form onSubmit={login} className="formRegister">
        <div className="groupInputSouhlas">
          <input
            onChange={(e) => setCheked(e.target.checked)}
            type="checkbox"
            name=""
          />

          <span>Souhlasím s</span>
          <Link>podmínkami serveru Bazos.cz.</Link>
        </div>

        <p style={{ color: "red", fontSize: "13px" }} className="error">
          {error}
        </p>

        <div className="groupInputregister">
          <span className="placeholder">Email</span>
          <input
            value={emailLogin}
            onChange={(e) => setEmailLogin(e.target.value)}
            type="email"
            name=""
          />
        </div>
        <div className="groupInputregister">
          <span className="placeholder">Heslo</span>
          <input
            value={passwordLogin}
            onChange={(e) => setPasswordLogin(e.target.value)}
            type="password"
            name=""
          />
        </div>

        <button className="btn-register" type="submit">
          Přihlásit se
        </button>
      </form>
    </div>
  );
}
export default Register;
