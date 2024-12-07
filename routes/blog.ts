import express from "express";

import * as BlogController from "../controllers/blog";
import { validateAccessTokenSchema, validateSchema } from "../middleware/validator";
import { accessTokenSchema, blogSchema } from "../schema/schema";
import { AUTH_TOKEN_SECRET } from "../util/constants";

const router = express.Router();

router.delete(
    '/:blogId',
    validateAccessTokenSchema(accessTokenSchema, AUTH_TOKEN_SECRET),
    BlogController.deletePost
);

router.put(
    '/:blogId',
    validateAccessTokenSchema(accessTokenSchema, AUTH_TOKEN_SECRET),
    validateSchema(blogSchema),
    BlogController.editPost
);

router.get('/:blogId', BlogController.getBlogById); // blogId will be blog ((slug) + (12 character random id))

router.post(
    '/',
    validateAccessTokenSchema(accessTokenSchema, AUTH_TOKEN_SECRET),
    validateSchema(blogSchema),
    BlogController.createBlog
);

router.get('/', BlogController.getBlogs);

export default router;
