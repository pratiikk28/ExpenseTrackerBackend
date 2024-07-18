const jwt = require("jsonwebtoken");

const isAuth = async (req, res, next) => {
  // Extract the authorization header and retrieve the token
  const headerObj = req.headers;
  const token = headerObj?.authorization?.split(" ")[1];

  // Verify the JWT token using the secret "JohnKey"
  const verifyToken = jwt.verify(token, "JohnKey", (err, decoded) => {
    // If there's an error during verification, return false
    if (err) {
      return false;
    } else {
      // If verification is successful, return the decoded token
      return decoded;
    }
  });

  // If token verification succeeded
  if (verifyToken) {
    // Save the user ID from the decoded token to the request object
    req.user = verifyToken.id;
    next(); // Proceed to the next middleware or route handler
  } else {
    // If token verification failed, create an error and pass it to the error handling middleware
    const err = new Error("Token Expired, Login Again");
    next(err);
  }
};

module.exports = isAuth;
