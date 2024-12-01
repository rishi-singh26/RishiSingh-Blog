import express from "express";

import * as BlogController from "../controllers/blog";

const router = express.Router();

router.get("/:blogId", BlogController.getBlogById); // blogId will be blog ((slug) + (12 character random id))

export default router;
