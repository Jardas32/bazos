import "dotenv/config";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendNodemailer(name, email) {
  const { data, error } = await resend.emails.send({
    from: "Bazos.cz <onboarding@resend.dev>",
    to: [email],
    subject: "Děkujeme za registraci",

    text: `
Dobrý den ${name},

děkujeme, že jste se zaregistrovali na našem webu Bazoš.cz.

Váš účet byl úspěšně vytvořen.

Navštívit Bazoš.cz:
https://www.bazos.cz/

Přejeme vám příjemné používání našeho webu.

Bazoš.cz
`,

    html: `
      <div style="
        max-width: 600px;
        margin: 0 auto;
        padding: 10px;
        font-family: Arial, sans-serif;
        color: #333;
      ">
        <h1 style="color: #222;">
          Bazoš.cz
        </h1>

        <h2>
          Děkujeme za registraci!
        </h2>

        <p>
          Dobrý den <strong>${name}</strong>,
        </p>

        <p>
          děkujeme, že jste se zaregistrovali
          na našem webu <strong>Bazoš.cz</strong>.
        </p>

        <p>
          Váš účet byl úspěšně vytvořen.
        </p>

        <div>
          <a
            href="https://www.bazos.cz/"
            style="
              display: inline-block;
              padding: 12px 24px;
              background: rgba(233, 62, 0, 0.781);
              color: white;
              text-decoration: none;
              border-radius: 5px;
              font-weight: bold;
            "
          >
            Navštívit Bazoš.cz
          </a>
        </div>

        <p>
          Přejeme vám příjemné používání našeho webu.
        </p>

        <p>
          S pozdravem<br>
          <strong>Bazoš.cz</strong>
        </p>
      </div>
    `,
  });

  if (error) {
    console.error("❌ Resend error:", error);
    throw error;
  }

  console.log("✅ Email sent:", data);
}
