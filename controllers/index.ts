import { NextFunction, Request, Response } from "express";

export const getIndex = (req: Request, res: Response, next: NextFunction) => {
    res.render("index", {
        pageDescription: "Experienced software developer in the vibrant tech landscape of southern India, building innovative solutions with precision and passion. Explore my portfolio of impactful projects.",
        canonicalUrl: "https://rishisingh.in/",
        title: "Rishi Singh - Blog",
        thumbnailUrl: "/images/BlogWebOGPoster.png",
        path: '/'
    });
};