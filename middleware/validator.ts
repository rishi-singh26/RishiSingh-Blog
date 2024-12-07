import { NextFunction, Request, Response } from "express";
import { ZodEffects, ZodObject } from "zod";

import { ZodError } from 'zod';
import jwt from 'jsonwebtoken';
import { StatusCodes } from "http-status-codes";
import { CustomResponse } from "../util/custom_error";

export const validateSchema = (schema: ZodObject<any, any> | ZodEffects<ZodObject<any, any>>) => (req: Request, res: Response, next: NextFunction): void => {
    try {
        // Parse and validate the request data
        schema.parse(req.body);
        next(); // Proceed to the next middleware or route handler
    } catch (error: any) {
        if (error instanceof ZodError) {
            res.status(StatusCodes.BAD_REQUEST).json(error.errors[0]);
            return;
        }
        error.statusCode = error.statusCode ?? 422;
        next(error); // Pass non-validation errors to error handlers
    }
};

export const validateRefreshTokenSchema = (schema: ZodObject<any, any>, secret: string | undefined) => (req: Request, res: Response, next: NextFunction): void => {
    try {
        if (!secret) {
            const error = new CustomResponse({ message: 'Not authenticated!', statusCode: 401});
            next(error);
            return ;
        }
        var decoded = jwt.verify(req.body.refreshToken, secret);
        var validatedToken = schema.parse(decoded);
        req.body.validatedToken = validatedToken;
        next();
    } catch (error: any) {
        if (error instanceof ZodError) {
            res.status(422).json(error.errors[0]);
            return;
        }
        error.statusCode = 401;
        return next(error);
    }
}

export const validateAccessTokenSchema = (schema: ZodObject<any, any>, secret: string | undefined) => (req: Request, res: Response, next: NextFunction): void => {
    try {
        const authHeader = req.get('Authorization');
        if (!authHeader || !secret) {
            const error = new CustomResponse({ message: 'Not authenticated!', statusCode: StatusCodes.UNAUTHORIZED});
            next(error);
            return ;
        }
        var decoded = jwt.verify(authHeader.split(' ')[1], secret);
        var validatedToken = schema.parse(decoded);
        req.body.validatedToken = validatedToken;
        next();
    } catch (error: any) {
        if (error instanceof ZodError) {
            res.status(401).json(error.errors[0]);
            return;
        }
        error.statusCode = 401;
        return next(error);
    }
}
