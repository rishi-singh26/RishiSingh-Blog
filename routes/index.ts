import express from "express";

import * as IndexController from "../controllers/index";

const router = express.Router();

router.get("/", IndexController.getIndex);

export default router;
