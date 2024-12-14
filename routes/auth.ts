import express from 'express';

import * as authController from '../controllers/auth';

import { validateSchema, validateRefreshTokenSchema, validateAccessTokenSchema } from '../middleware/validator';
import {
    signupSchema,
    loginSchema,
    refreshSchema,
    refreshTokenSchema,
    accessTokenSchema,
    logoutSchema,
} from '../schema/schema';
import { REFRESH_TOKEN_SECRET, AUTH_TOKEN_SECRET } from '../util/constants';

const router = express.Router();

router.post('/login',
    validateSchema(loginSchema),
    authController.login,
);

router.post('/refresh',
    validateSchema(refreshSchema),
    validateRefreshTokenSchema(refreshTokenSchema, REFRESH_TOKEN_SECRET),
    authController.refresh,
);

// router.post('/signup',
//     validateSchema(signupSchema),
//     authController.signup,
// );

router.post('/logout',
    validateSchema(logoutSchema),
    validateRefreshTokenSchema(refreshTokenSchema, REFRESH_TOKEN_SECRET),
    authController.logout,
);

export default router;
