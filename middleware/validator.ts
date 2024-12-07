import { NextFunction, Request, Response } from "express";
import { ZodEffects, ZodObject } from "zod";

import { ZodError } from 'zod';
import jwt from 'jsonwebtoken';
import { StatusCodes } from "http-status-codes";
import { CustomResponse } from "../util/custom_response";

export const validateSchema = (schema: ZodObject<any, any> | ZodEffects<ZodObject<any, any>>) => (req: Request, res: Response, next: NextFunction): void => {
    try {
        schema.parse(req.body);
        next(); // Proceed to the next middleware or route handler
    } catch (error: any) {
        handleError(error, next); // Pass non-validation errors to error handlers
    }
};

export const validateRefreshTokenSchema = (schema: ZodObject<any, any>, secret: string | undefined) => (req: Request, res: Response, next: NextFunction): void => {
    try {
        if (!secret) {
            next(new CustomResponse({ message: 'Not authenticated!', statusCode: StatusCodes.UNAUTHORIZED }));
            return;
        }
        var decoded = jwt.verify(req.body.refreshToken, secret);
        var validatedToken = schema.parse(decoded);
        req.body.validatedToken = validatedToken;
        next();
    } catch (error: any) {
        handleError(error, next);
    }
}

export const validateAccessTokenSchema = (schema: ZodObject<any, any>, secret: string | undefined) => (req: Request, res: Response, next: NextFunction): void => {
    try {
        const authHeader = req.get('Authorization');
        if (!authHeader || !secret) {
            next(new CustomResponse({ message: 'Not authenticated!', statusCode: StatusCodes.UNAUTHORIZED }));
            return;
        }
        var decoded = jwt.verify(authHeader.split(' ')[1], secret);
        var validatedToken = schema.parse(decoded);
        req.body.validatedToken = validatedToken;
        next();
    } catch (error: any) {
        handleError(error, next);
    }
}

const handleError = (error: any, next: NextFunction) => {
    if (error instanceof ZodError) {
        next(new CustomResponse({
            message: error.errors[0].message,
            statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
            errorPath: error.errors[0].path,
        }));
        return;
    }
    next(new CustomResponse({
        message: error.message ?? 'Error',
        statusCode: error.statusCode ?? StatusCodes.UNPROCESSABLE_ENTITY,
    }));
}