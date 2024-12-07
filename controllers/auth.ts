import bcrypt from "bcryptjs";
import { ZodError, ZodIssueCode } from "zod";
import jwt from "jsonwebtoken";

import User from "../models/user";
import Token from "../models/token";
import { refreshTokenSchema } from "../schema/schema";
import { AUTH_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../util/constants";
import { NextFunction, Response, Request } from "express";
import { CustomResponse } from "../util/custom_error";
import { StatusCodes } from "http-status-codes";

const createAccessToken = (email: string, userId: string) =>
    jwt.sign({ email, userId }, AUTH_TOKEN_SECRET || '', { expiresIn: "2h" });
const createRefreshToken = (userId: string) =>
    jwt.sign({ userId }, REFRESH_TOKEN_SECRET || '', { expiresIn: "7d" });


export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log(req.body);
        
        const { email, password } = req.body;
        if (!email || !password) {
            const error = new CustomResponse({
                message: "Enter a valid name, email and password.",
                statusCode: StatusCodes.BAD_REQUEST,
                errorPath: ["email", "password"]
            });
            return next(error);
        }
        // Validate user email
        const user: User | null = await User.findOne({ where: { email: email } });
        if (!user) {
            const error = new CustomResponse({
                message: "A user with this email could not be found.",
                statusCode: StatusCodes.BAD_REQUEST,
                errorPath: ["email"]
            });
            return next(error);
        }
        // Validate user password
        const isCorrectPassword = await bcrypt.compare(password, user.password);
        if (!isCorrectPassword) {
            const error = new CustomResponse({
                message: "Incorrect password",
                statusCode: StatusCodes.BAD_REQUEST,
                errorPath: ["password"]
            });
            return next(error);
        }
        // Generate tokesn
        const accessToken = createAccessToken(user.email, user.id.toString());
        const refreshToken = createRefreshToken(user.id.toString());
        // create a new access and refresh token for each login
        await Token.create({ refreshToken, accessToken, userId: user.id });
        res.status(200).json({
            accessToken,
            refreshToken,
            user: { id: user.id, name: user.name, email: user.email },
        });
    } catch (error: any) {
        error.statusCode = error.statusCode ?? 500;
        next(error);
    }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const refreshToken = req.body.refreshToken;
        const parsedRefreshToken = req.body.validatedToken;
        // find if the same token is present in the database or not
        const existingTokenData: Token | null = await Token.findOne({
            where: { userId: parsedRefreshToken.userId, refreshToken },
        });
        // validate if there is no entry for this userId and refreshToken in DB
        if (!existingTokenData || (existingTokenData.refreshToken !== refreshToken)) {
            res.status(403).json({ message: "Invalid refresh token" });
            return;
        }
        // Verify that a user for this refresh token exists
        const user = await User.findByPk(parsedRefreshToken.userId);
        if (!user) {
            res.status(403).json({ message: "Invalid refresh token, user not found" });
            return;
        }
        // Generate new tokens
        const accessToken = createAccessToken(user.email, user.id.toString());
        const newRefreshToken = createRefreshToken(user.id.toString());
        // Update the existing tokens for the user session
        await existingTokenData.update({
            refreshToken: newRefreshToken,
            accessToken,
        });
        res.json({ accessToken, refreshToken: newRefreshToken });
    } catch (error: any) {
        error.statusCode = error.statusCode ?? 500;
        next(error);
    }
};

export const signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            const error = new CustomResponse({
                message: "Enter a valid name, email and password.",
                statusCode: StatusCodes.BAD_REQUEST,
                errorPath: ["email", "password"]
            });
            return next(error);
        }

        const existingUser: User | null = await User.findOne({ where: { email: email.toLowerCase() } });
        if (existingUser && existingUser.email === email) {
            const error = new CustomResponse({
                message: "A user with this email already exists in the system.",
                statusCode: StatusCodes.BAD_REQUEST,
                errorPath: ["email"]
            });
            return next(error);
        }

        const passwordHash = await bcrypt.hash(password, 12);
        const user = await User.create({ name, email, password: passwordHash });
        res.status(201).json({ message: "Signup successfull", userId: user.id });
    } catch (error: any) {
        error.statusCode = error.statusCode ?? 500;
        next(error);
    }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const refreshToken = req.body.refreshToken;
        const validatedToken = req.body.validatedToken;
        const existingTokenData = await Token.findOne({
            where: { userId: validatedToken.userId, refreshToken },
        });
        let statusCode = 200;
        if (existingTokenData) {
            await existingTokenData.destroy();
            statusCode = 410;
        }
        res.status(statusCode).json({ message: "Logged Out" });
    } catch (error: any) {
        error.httpStatusCode = 500;
        next(error);
    }
};
