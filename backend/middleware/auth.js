const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
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
