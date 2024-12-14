import express from "express";

import { uploadFile } from "../controllers/file";
import { validateAccessTokenSchema } from "../middleware/validator";
import { accessTokenSchema } from "../schema/schema";
import { AUTH_TOKEN_SECRET } from "../util/constants";

const router = express.Router();

router.post("/", validateAccessTokenSchema(accessTokenSchema, AUTH_TOKEN_SECRET), uploadFile);

export default router;
