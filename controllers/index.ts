import { NextFunction, Request, Response } from "express";
import { CustomResponse } from "../util/custom_response";
import { StatusCodes } from "http-status-codes";

import Blog from "../models/blog";
import User from "../models/user";

import { getContextDate } from '../util/date';

export const getIndexPage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        type QueryParams = { page: string | undefined, size: string | undefined };
        const { page = '1', size = '80' } = req.query as QueryParams; // Defaults: page 1, size 80
        const intPage = parseInt(page);
        const limit = parseInt(size); // Number of records per page
        const offset = (intPage - 1) * limit; // Skip records

        const { count, rows: blogs } = await Blog.findAndCountAll({
            where: { draft: false },
            include: { model: User, attributes: ['name', 'id'] },
            limit, // Limit the number of records
            offset, // Skip the appropriate number of records
            order: [['createdAt', 'DESC']], // Example: order by created date
        });

        // Calculate total pages
        const totalPages = Math.ceil(count / limit);

        const blogsWithContextDate = blogs.map(b => ({ ...b.dataValues, createdAt: getContextDate(b.createdAt) }));

        res.render("index", {
            pageDescription: "Experienced software developer in the vibrant tech landscape of southern India, building innovative solutions with precision and passion. Explore my portfolio of impactful projects.",
            canonicalUrl: "https://rishisingh.in/",
            title: "Rishi Singh - Blog",
            thumbnailUrl: "/images/BlogWebOGPoster.png",
            path: '/',
            blogs: blogsWithContextDate,
            totalBlogsCount: count,
            currentPage: intPage,
            hasNextPage: intPage < totalPages,
            hasPrevPage: intPage > 1,
            nextPage: intPage + 1,
            prevPage: intPage - 1,
            lastPage: totalPages,
        });
    } catch (error: any) {
        res.redirect('/500');
    }
};

const dummyHTML = "<h1 id='this-is-the-header'>This is the header</h1><h2 id='this-is-the-h2'>This is the h2</h2><h3 id='this-is-the-h3'>This is the h3</h3><table><thead><tr><th>Header</th><th>Header</th></tr></thead><tbody><tr><td>This is the table</td><td>This is another cell</td></tr><tr><td>This the second row</td><td>This is also the second row</td></tr></tbody></table><pre><code class='lang-javascript'>let <span class='hljs-built_in'>name</span> = <span class='hljs-string'>'Jane Doe'</span>console.<span class='hljs-built_in'>log</span>(<span class='hljs-built_in'>name</span>);</code></pre><p>This is in <code>code</code></p><p><img src='/images/BlogWebOGPoster.png' alt='alt text'></p><p><a href='https://markdowntohtml.com'>reference link</a></p><hr><p><a href='https://markdowntohtml.com'>use numbers</a>.</p>";

export const getBlogPageById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const blogId = req.params.blogId;
        if (!blogId) {
            return res.redirect('/404');
        }
        const blog = await Blog.findByPk(blogId);

        // Handle error when blog not found
        if (!blog) {
            return res.redirect('/404');
        }
        
        res.render("blog", {
            title: blog.title,
            path: '/blog', // this is used to apply appropriate css in mets.ejs DO NOT CHANGE
            content: blog.html,
            pageDescription: blog.description,
            canonicalUrl: blog.canonicalUrl,
            thumbnailUrl: blog.thumbnailUrl,
            tags: blog.tags,
            createdAt: getContextDate(blog.createdAt),
            views: blog.views,
        });
    } catch (error: any) {
        res.redirect('/500');
    }
};
