import { Link, useParams } from "react-router-dom";
import { useBazosContext } from "../context/BazosContext";
import Login from "../components/Login";
import Register from "../components/Register";
import LoadingComponent from "../components/LoadingComponent";

function Prihlaseni() {
  const { subcategoryslug } = useParams();
  const {
    leftBarCategories,
    isLogin,
    isAuth,
    me,
    logout,
    authLoading,
    deleteAcount,
    deleteAccount,
    setDeleteAccount,
  } = useBazosContext();

  if (authLoading) {
    return <LoadingComponent />;
  }

  return (
    <div className="wrapper-oblibenepage">
      <div className="wrapper-subcategorie">
        <h3 className="text-categories">Inzerce</h3>

        <ul className="list-category">
          {leftBarCategories.map((category) => (
            <li key={category.id} className="subcategory">
              <Link
                to={`/${category.slug}`}
                className={`link-category ${
                  category.slug === subcategoryslug ? "active" : ""
                }`}
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="wrapper-oblibene">
        <div className="wrapper-oblibnee-top">Přihlášení</div>

        {isAuth ? (
          <div className="wrapper-profile-info">
            <div className="profile-group">
              <span>E-mail:</span>
              <span>{me?.email}</span>
            </div>

            <div className="profile-group">
              <span>Name:</span>
              <span>{me?.name}</span>
            </div>

            <div className="wrapper-delete-acount">
              <button onClick={logout} className="btn-odhlasitse">
                Odhlásit se
              </button>

              <div className="wrapper-deleteaccount">
                <button
                  onClick={() => setDeleteAccount(true)}
                  className="btn-delete-acount"
                >
                  Smazat účet
                </button>
                <div
                  className={`wrapper-yesno ${deleteAccount ? "active" : ""}`}
                >
                  <p className="text-yesno">Opravdu chcete účet smazat?</p>

                  <button
                    onClick={() => deleteAcount()}
                    className="btn-yesno left"
                  >
                    Ano
                  </button>
                  <button
                    onClick={() => setDeleteAccount(false)}
                    className="btn-yesno"
                  >
                    Ne
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : isLogin ? (
          <Login />
        ) : (
          <Register />
        )}
      </div>
    </div>
  );
}

export default Prihlaseni;
