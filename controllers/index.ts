import { NextFunction, Request, Response } from "express";

export const getIndex = (req: Request, res: Response, next: NextFunction) => {
    res.render("index");
};