import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  // Set JWT as an HTTP-Only Cookie
  res.cookie("jwt", token, {
    httpOnly: true, // Accessible only by the web server and prevent XSS attacks
    secure: process.env.NODE_ENV !== "development", // Cookie is only sent over HTTPS (not HTTP) if in production
    sameSite: process.env.NODE_ENV !== "development" ? "none" : "strict", // Prevent CSRF attacks
    maxAge: 30 * 24 * 60 * 60 * 1000, // Expire in 30 days 
  });

  return token;
};

export default generateToken;