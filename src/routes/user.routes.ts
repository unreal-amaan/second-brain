import express, { Request, Response } from "express";
import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import validator from "validator";
import { UserModel } from "../schema/schema";

const UserRoutes = express.Router();
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET as string;

UserRoutes.post(
    "/signup",
    async function (req: Request, res: Response): Promise<void> {
        const userSchema = z.object({
            username: z.string().min(1).max(20),
            password: z
                .string()
                .min(8, { message: "Password must be atleast 8 characters" })
                .max(20, { message: "Password must be atmost 20 characters" }),
        });

        const user = userSchema.safeParse(req.body);

        if (!user.success) {
            res.status(400).json({ message: "Invalid Credentials" });
            return;
        }

        const user_data = user.data;
        const options = {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        };
        const valid_pass = validator.isStrongPassword(
            user_data.password,
            options
        );
        if (!valid_pass) {
            res.status(401).json({
                message: "Password is not valid!",
            });
            return;
        }
        try {
            const hashedPassword = await bcrypt.hash(user_data.password, 3);
            await UserModel.create({
                username: user_data.username,
                password: hashedPassword,
            });
            res.status(200).json({
                message: "User Signup Successful",
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "User Signup failed",
            });
        }
    }
);

UserRoutes.post(
    "/signin",
    async (req: Request, res: Response): Promise<void> => {
        interface user_credentials {
            username: string;
            password: string;
        }

        const UserCredentials: user_credentials = req.body;

        const user = await UserModel.findOne({
            username: UserCredentials.username,
        });
        if (!user) {
            res.status(400).json({
                message: "User not found",
            });
            return;
        }
        console.log(user.password);
        console.log(UserCredentials.password);
        const valid_password = await bcrypt.compare(
            UserCredentials.password,
            user.password,
        );

        if (!valid_password) {
            res.status(401).json({
                message: "Invalid Password",
            });
            return;
        }
        const token = jwt.sign(
            {
                username: user.username,
            },
            JWT_SECRET,
            {expiresIn : '1h'}
        );

        res.status(200).json({
            token: token,
            message: "User signin successful",
        });
    }
);

export default UserRoutes;
