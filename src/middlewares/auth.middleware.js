import jwt from "jsonwebtoken"
import config from "../config/config.js"

export const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authorization || !authHeader.StartsWith("Bearer ")) {
            return res.status(401).json({
                msg: "Access denied, No token provided"
            })
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, config.JWT_SECRET);

        req.user = decoded;

        next();

    } catch (error) {
        return res.status(403).json({
            msg: "Invalid or expired token"
        })

    }

}