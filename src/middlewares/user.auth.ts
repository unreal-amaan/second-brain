import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { NextFunction, Response, Request } from "express";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

interface CustomRequest extends Request {
    userId?:string
}

function userauth(req: CustomRequest, res: Response, next: NextFunction) {
    try {
        const token = req.headers["token"] as string;
        if (!token) {
            return res.status(401).json({
                message: "Access Denied! No token provided",
            });
        }

        const decoded_token = jwt.verify(token, JWT_SECRET) as JwtPayload
        if (!decoded_token) {
            return res.json({
                message: "Invalid token",
            });
        }
        req.userId = decoded_token.id
        console.log("User Authentication successful !")
        next();
    } catch {
        () => {
            return res.json({
                message: "Invalid token",
            });
        };
    }
}

export default userauth
