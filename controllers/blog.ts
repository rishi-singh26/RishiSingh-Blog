import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

import Blog from '../models/blog';
import User from '../models/user';
import io from '../socket';

import { CustomResponse } from '../util/custom_response';
import { SocketResponse } from '../util/socket_response';

export const getBlogs = async (req: Request, res: Response, next: NextFunction) => {
    try {
        type QueryParams = { page: string | undefined, size: string | undefined, draft: string | undefined };
        const { page = '1', size = '80', draft = '' } = req.query as QueryParams; // Defaults: page 1, size 80
        const limit = parseInt(size); // Number of records per page
        const offset = (parseInt(page) - 1) * limit; // Skip records

        const { count, rows: blogs } = await Blog.findAndCountAll({
            where: { draft: draft === 'true' },
            include: { model: User, attributes: ['name', 'id'] },
            limit, // Limit the number of records
            offset, // Skip the appropriate number of records
            order: [['createdAt', 'DESC']], // Example: order by created date
        });

        // Calculate total pages
        const totalPages = Math.ceil(count / limit);
        res.status(StatusCodes.OK).json(new CustomResponse({
            message: 'Blogs featched successfully',
            statusCode: StatusCodes.OK,
            data: { blogs, pagination: { totalItems: count, totalPages, currentPage: parseInt(page) } },
            status: true,
        }).toJson());
    } catch (error: any) {
        next(new CustomResponse({
            message: error.message,
            statusCode: error.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR
        }));
    }
};

export const getBlogById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const blogId = req.params.blogId;
        if (!blogId) {
            return next(new CustomResponse({ message: 'BlogID not found', statusCode: StatusCodes.NOT_FOUND }));
        }
        const blog = await Blog.findByPk(blogId);

        // Handle error when blog not found
        if (!blog) {
            return next(new CustomResponse({ message: 'Blog not found', statusCode: StatusCodes.NOT_FOUND }));
        }
        res.status(StatusCodes.OK).json(new CustomResponse({
            message: 'Blog featched successfully',
            statusCode: StatusCodes.OK,
            data: { blog },
            status: true,
        }).toJson());
    } catch (error: any) {
        next(new CustomResponse({
            message: error.message,
            statusCode: error.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR,
        }));
    }
};

export const createBlog = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validatedToken = req.body.validatedToken;
        const title = req.body.title;
        const html = req.body.html;
        const thumbnailUrl = req.body.thumbnailUrl;
        const description = req.body.description;
        const draft = req.body.isDraft;
        const canonicalUrl = req.body.canonicalUrl;
        const tags = req.body.tags;

        const blog = {
            title,
            html,
            thumbnailUrl,
            description,
            userId: validatedToken.userId,
            draft,
            canonicalUrl,
            views: 0,
            tags,
        };
        const result = await Blog.create(blog)
        const user = await User.findByPk(validatedToken.userId);
        const response = new CustomResponse({
            message: 'Post created successfully',
            statusCode: StatusCodes.CREATED,
            status: true,
            data: {
                ...structuredClone(result.dataValues),
                User: { name: user && user.name ? user.name : '', id: user && user.id ? user.id : '' }
            }
        })
        io.getIO().emit('blogs', new SocketResponse('create', response.toJson()).toJson())
        res.status(response.statusCode).json(response.toJson());
    } catch (error: any) {
        next(new CustomResponse({
            message: error.message,
            statusCode: error.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR,
        }));
    }
};

export const editBlog = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const blogId = req.params.blogId;
        if (!blogId) {
            return next(new CustomResponse({ message: 'BlogID not found', statusCode: StatusCodes.NOT_FOUND }));
        }

        const validatedToken = req.body.validatedToken;
        const title = req.body.title;
        const html = req.body.html;
        const thumbnailUrl = req.body.thumbnailUrl;
        const description = req.body.description;
        const draft = req.body.isDraft;
        const canonicalUrl = req.body.canonicalUrl;
        const tags = req.body.tags;

        const result = await Blog.findByPk(req.params.postId)
        if (!result) {
            return next(new CustomResponse({ message: 'Blog not found', statusCode: StatusCodes.NOT_FOUND }));
        }
        if (validatedToken.userId !== result.userId) {
            return next(new CustomResponse({ message: 'Unauthorized', statusCode: StatusCodes.FORBIDDEN }));
        }
        const blog = {
            title,
            html,
            thumbnailUrl,
            description,
            userId: validatedToken.userId,
            draft,
            canonicalUrl,
            views: result.views,
            tags: tags
        };
        const updatedResult = await result.update(blog);
        const response = new CustomResponse({
            message: 'Blog updated successfully',
            statusCode: StatusCodes.OK,
            data: { updatedResult },
            status: true,
        });
        io.getIO().emit('blogs', new SocketResponse('update', response.toJson()).toJson());
        res.status(200).json({ post: updatedResult, message: 'Post updated successfully' });
    } catch (error: any) {
        next(new CustomResponse({
            message: error.message,
            statusCode: error.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR,
        }));
    }
};

export const deleteBlog = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validatedToken = req.body.validatedToken;
        const result = await Blog.findByPk(req.params.blogId);
        if (!result) {
            return next(new CustomResponse({ message: 'Blog not found', statusCode: StatusCodes.NOT_FOUND }));
        }
        if (validatedToken.userId !== result.userId) {
            return next(new CustomResponse({ message: 'Unauthorized', statusCode: StatusCodes.FORBIDDEN }));
        }
        await result.destroy();
        const response = new CustomResponse({
            message: 'Blog deleted',
            statusCode: StatusCodes.GONE,
            status: true,
            data: structuredClone(result.dataValues),
        });
        io.getIO().emit('blogs', new SocketResponse('delete', response.toJson()).toJson());
        res.status(StatusCodes.GONE).json(response.toJson());
    } catch (error: any) {
        next(new CustomResponse({
            message: error.message,
            statusCode: error.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR,
        }));
    }
};
