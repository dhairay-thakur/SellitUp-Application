const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    console.log(req.headers)
    const token = req.headers.authorization;
    console.log(token)
    if (!token) {
      return next(new Error("Authentication Failed"));
    }
    const decodedToken = jwt.verify(token, "sellitup-private-key");
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (error) {
    console.log(error);
    return next(new Error("Authentication Failed"));
  }
};
