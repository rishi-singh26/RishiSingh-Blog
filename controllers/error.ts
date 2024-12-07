import { Request, Response, NextFunction } from "express";

export const get404 = (req: Request, res: Response, next: NextFunction) => {
    res.status(404).render('404', {
        title: 'Page Not Found',
        path: '/404',
        pageDescription: '',
        canonicalUrl: '',
        thumbnailUrl: '/images/BlogWebOGPoster.png',
    });
};

export const get500 = (req: Request, res: Response, next: NextFunction) => {
    res.status(500).render('500', {
        title: 'Something went wrong',
        path: '/500',
        pageDescription: '',
        canonicalUrl: '',
        thumbnailUrl: '/images/BlogWebOGPoster.png',
    });
};
