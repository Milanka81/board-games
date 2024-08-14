const jwt = require("jsonwebtoken");

const tokenVerify = (req, res, next) => {
  if (!req.headers.jwt)
    return res.status(401).json({ message: "Invalid or expired token" });
  try {
    const token = req.headers.jwt;
    const secret = process.env.JWT_SECRET;

    const verify = jwt.verify(token, secret);
    req.userId = verify.id;
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
  next();
};

module.exports = { tokenVerify };
