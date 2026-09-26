import jwt from "jsonwebtoken";

function auth(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "Musíte být přihlášeni",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (err) {
    console.log(err);

    return res.status(401).json({
      message: "Neplatné nebo prošlé přihlášení",
    });
  }
}

export default auth;
