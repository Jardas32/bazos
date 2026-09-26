import "../css/register.css";
import { Link } from "react-router-dom";
import { useBazosContext } from "../context/BazosContext";

function Register() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    name,
    setName,
    error,
    register,
    setIsLogin,
    setCheked,
  } = useBazosContext();

  return (
    <div className="wrapper-registerbg">
      <div className="nova-registrace">
        <span>Nová registrace</span> <span>/</span>
        <button onClick={() => setIsLogin(true)} className="btn-loginpage">
          Přihlásit se
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

      <form onSubmit={register} className="formRegister">
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            name=""
            required
          />
        </div>
        <div className="groupInputregister">
          <span className="placeholder">Heslo</span>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            name=""
            required
          />
        </div>
        <div className="groupInputregister">
          <span className="placeholder">Name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            name=""
            required
          />
        </div>

        <button className="btn-register" type="submit">
          Registrovat se
        </button>
      </form>
    </div>
  );
}
export default Register;
