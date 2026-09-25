import "dotenv/config";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_BAZOS,
    pass: process.env.SMPT_PASSWORD,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Nodemailer error:", error);
  } else {
    console.log("✅ Nodemailer ready:", success);
  }
});

export async function sendNodemailer(name, email) {
  await transporter.sendMail({
    from: `"Bazos.cz" <${process.env.EMAIL_BAZOS}>`,
    to: email,
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
}
