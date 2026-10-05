import "../css/footer.css";
import { useBazosContext } from "../context/BazosContext";

function Footer() {
  const { allAds } = useBazosContext();

  return (
    <div className="wrapper-footer">
      <p>
        ©2026 Mybazar - Inzerce, Bazar <br /> Nápověda, Dotazy, Hodnocení,
        Kontakt, Reklama, Podmínky, Ochrana údajů, RSS <br /> Inzeráty celkem:
        <span style={{ marginLeft: "5px" }}>{allAds.length}</span>
      </p>
      <p>
        Mapa kategorií, Nejvyhledávanější výrazy <br />
        Země: Česká republika, Slovensko, Polsko, Rakousko
      </p>
    </div>
  );
}

export default Footer;
