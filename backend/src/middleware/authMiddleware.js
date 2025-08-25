import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Check if the user is authenticated or not
const authenticate = async (req, res, next) => {
    try {
        let token;

        // Read JWT from the 'jwt' cookie
        token = req.cookies.jwt;

        if (token) {
            try {
                //Checks if the token is valid (not expired, not fake)
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                //Fetch the user by id and attach to req.user but exclude the password
                req.user = await User.findById(decoded.userId).select("-password");
                next();
            } catch (error) {
                res.status(401);
                throw new Error("Not authorized, token failed.");
            }
        } else {
            res.status(401);
            throw new Error("Not authorized, no token");
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { authenticate };
