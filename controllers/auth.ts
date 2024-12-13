import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/user";
// import Token from "../models/token";
import { AUTH_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../util/constants";
import { NextFunction, Response, Request } from "express";
import { CustomResponse } from "../util/custom_response";
import { StatusCodes } from "http-status-codes";

const createAccessToken = (email: string, userId: string) =>
    jwt.sign({ email, userId }, AUTH_TOKEN_SECRET || '', { expiresIn: "2h" });
const createRefreshToken = (userId: string) =>
    jwt.sign({ userId }, REFRESH_TOKEN_SECRET || '', { expiresIn: "7d" });


export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            const error = new CustomResponse({
                message: "Enter a valid name, email and password.",
                statusCode: StatusCodes.BAD_REQUEST,
                errorPath: ["email", "password"],
                status: false,
            });
            return next(error);
        }
        // Validate user email
        const user: User | null = await User.findOne({ where: { email: email } });
        if (!user) {
            const error = new CustomResponse({
                message: "A user with this email could not be found.",
                statusCode: StatusCodes.BAD_REQUEST,
                errorPath: ["email"],
                status: false,
            });
            return next(error);
        }
        // Validate user password
        const isCorrectPassword = await bcrypt.compare(password, user.password);
        if (!isCorrectPassword) {
            const error = new CustomResponse({
                message: "Incorrect password",
                statusCode: StatusCodes.BAD_REQUEST,
                errorPath: ["password"],
                status: false,
            });
            return next(error);
        }
        // Generate tokesn
        const accessToken = createAccessToken(user.email, user.id.toString());
        const refreshToken = createRefreshToken(user.id.toString());
        // create a new access and refresh token for each login
        // await Token.create({ refreshToken, accessToken, userId: user.id });
        res.status(StatusCodes.OK).json(new CustomResponse({
            message: 'Login successful',
            statusCode: StatusCodes.OK,
            data: { accessToken, refreshToken, user: { id: user.id, name: user.name, email: user.email } },
            status: true,
        }));
    } catch (error: any) {
        next(new CustomResponse({
            message: error.message,
            statusCode: error.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR,
            status: false,
        }));
    }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const refreshToken = req.body.refreshToken;
        const parsedRefreshToken = req.body.validatedToken;
        // find if the same token is present in the database or not
        // const existingTokenData: Token | null = await Token.findOne({
        //     where: { userId: parsedRefreshToken.userId, refreshToken },
        // });
        // // validate if there is no entry for this userId and refreshToken in DB
        // if (!existingTokenData || (existingTokenData.refreshToken !== refreshToken)) {
        //     next(new CustomResponse({
        //         message: "Invalid refresh token",
        //         statusCode: StatusCodes.FORBIDDEN,
        //         status: false,
        //     }));
        //     return;
        // }
        // Verify that a user for this refresh token exists
        const user = await User.findByPk(parsedRefreshToken.userId);
        if (!user) {
            return next(new CustomResponse({
                message: "Invalid refresh token, user not found",
                statusCode: StatusCodes.FORBIDDEN,
                status: false,
            }));
        }
        // Generate new tokens
        const accessToken = createAccessToken(user.email, user.id.toString());
        const newRefreshToken = createRefreshToken(user.id.toString());
        // Update the existing tokens for the user session
        // await existingTokenData.update({ refreshToken: newRefreshToken, accessToken });
        res.status(StatusCodes.OK).json(new CustomResponse({
            message: "Success",
            statusCode: StatusCodes.OK,
            data: { accessToken, refreshToken: newRefreshToken },
            status: true,
        }).toJson());
    } catch (error: any) {
        next(new CustomResponse({
            message: error.message,
            statusCode: error.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR,
            status: false,
        }));
    }
};

export const signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            const error = new CustomResponse({
                message: "Enter a valid name, email and password.",
                statusCode: StatusCodes.BAD_REQUEST,
                errorPath: ["email", "password"],
                status: false,
            });
            return next(error);
        }

        const existingUser: User | null = await User.findOne({ where: { email: email.toLowerCase() } });
        if (existingUser && existingUser.email === email) {
            const error = new CustomResponse({
                message: "A user with this email already exists in the system.",
                statusCode: StatusCodes.BAD_REQUEST,
                errorPath: ["email"],
                status: false,
            });
            return next(error);
        }

        const passwordHash = await bcrypt.hash(password, 12);
        const user = await User.create({ name, email, password: passwordHash });
        res.status(StatusCodes.CREATED).json(new CustomResponse({
            message: "Signup successfull",
            statusCode: StatusCodes.CREATED,
            data: { userId: user.id },
            status: true,
        }).toJson());
    } catch (error: any) {
        next(new CustomResponse({
            message: error.message,
            statusCode: error.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR,
            status: false,
        }));
    }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // const refreshToken = req.body.refreshToken;
        // const validatedToken = req.body.validatedToken;
        // const existingTokenData = await Token.findOne({
        //     where: { userId: validatedToken.userId, refreshToken },
        // });
        let statusCode = StatusCodes.OK;
        // if (existingTokenData) {
        //     await existingTokenData.destroy();
        //     statusCode = StatusCodes.GONE;
        // }
        res.status(statusCode).json(new CustomResponse({
            message: "Logged Out",
            statusCode: statusCode,
            status: true,
        }).toJson());
    } catch (error: any) {
        next(new CustomResponse({
            message: error.message,
            statusCode: error.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR,
            status: false,
        }));
    }
};
