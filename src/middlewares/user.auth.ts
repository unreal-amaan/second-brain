import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { NextFunction, Response, Request } from "express";
import { ObjectId } from "mongoose";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

interface CustomRequest extends Request {
    userId?:ObjectId
}

function userauth(req: CustomRequest, res: Response, next: NextFunction) {
    try {
        const token = req.headers["token"] as string;
        if (!token) {
            res.status(401).json({
                message: "Access Denied! No token provided",
            });
            return 
        }

        const decoded_token = jwt.verify(token, JWT_SECRET) as JwtPayload
        req.userId = decoded_token.id
        console.log("User Authentication successful !")
        next();
    } catch {
        res.json({
            message: "Invalid token",
        });
        return 
    }
}

export default userauth
