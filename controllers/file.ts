import {Request, Response, NextFunction } from "express";
import { CustomResponse } from "../util/custom_response";

export const uploadFile = (req: Request, res: Response, next: NextFunction) => {
    try {
        res.status(200).json({ message: 'File uploaded successfully'})
    } catch (error: any) {
        next(new CustomResponse({ message: error.message, statusCode: 500 }))
    }
}