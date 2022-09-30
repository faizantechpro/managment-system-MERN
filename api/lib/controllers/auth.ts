import { Router } from 'express';
import Joi from 'joi';
import { InvalidPayload } from 'lib/middlewares/exception';
import { AuthenticationService, userServiceFactory } from '../services';
import asyncHandler from '../utils/async-handler';

const router = Router();

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  mode: Joi.string().valid('cookie', 'json'),
  otp: Joi.string(),
}).unknown();

router.post(
  '/auth/login',
  asyncHandler(async (req, res) => {
    const authenticationService = new AuthenticationService();

    const { error } = loginSchema.validate(req.body);
    if (error) throw new InvalidPayload(error.message);

    const mode = req.body.mode || 'json';

    const ip = req.ip;
    const userAgent = req.get('user-agent');

    const { accessToken, refreshToken, expires } =
      await authenticationService.authenticate({
        ...req.body,
        ip,
        userAgent,
      });

    const payload = {
      data: { access_token: accessToken, expires },
    } as Record<string, Record<string, any>>;

    if (mode === 'json') {
      payload.data.refresh_token = refreshToken;
    }

    return res.json(payload.data);
  })
);

router.post(
  '/auth/logout',
  asyncHandler(async (req, res) => {
    const authenticationService = new AuthenticationService();
    const currentRefreshToken = req.body.refresh_token;

    if (!currentRefreshToken) {
      throw new InvalidPayload(
        `"refresh_token" is required in either the JSON payload or Cookie`
      );
    }

    await authenticationService.logout(currentRefreshToken);

    return res.json();
  })
);

router.post(
  '/auth/password/request',
  asyncHandler(async (req, res) => {
    if (!req.body.email) {
      throw new InvalidPayload(`"email" field is required.`);
    }

    const service = userServiceFactory(req.user);

    try {
      await service.requestPasswordReset(
        req.body.email,
        req.body.reset_url || null
      );
      return res.json({ message: 'email sent' });
    } catch (err) {
      throw new InvalidPayload('bad request');
    }
  })
);

export default router;
