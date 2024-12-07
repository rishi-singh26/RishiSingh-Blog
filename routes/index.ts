import express from "express";

import * as IndexController from "../controllers/index";

const router = express.Router();

router.get("/", IndexController.getIndexPage);

router.get("/:blogId", IndexController.getBlogPageById);

export default router;
